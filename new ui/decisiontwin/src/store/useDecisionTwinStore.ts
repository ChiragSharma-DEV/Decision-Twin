import { create } from "zustand";
import {
  explainDoppelganger,
  getSession,
  runCrashTest,
  runSimulation,
  uiDomainToBackend,
  uploadData,
} from "../services/api";
import type { DoppelgangerPayload } from "../services/types";
import type { SessionState, SimulationResponse } from "../services/types";
import { mapAdversarialPersonasToUI } from "../services/mappers";
import type { Persona } from "../types";

interface LoadingState {
  session: boolean;
  simulation: boolean;
  crashTest: boolean;
  doppelganger: boolean;
}

interface DecisionTwinState {
  session: SessionState | null;
  simulation: SimulationResponse | null;
  personas: Persona[];
  selectedUiDomain: string;
  loading: LoadingState;
  error: string | null;

  setSelectedUiDomain: (domain: string) => void;
  initSession: (uiDomain: string) => Promise<void>;
  runSimulationFlow: (years?: number) => Promise<void>;
  runCrashTestFlow: (adversarialCount?: number) => Promise<void>;
  explainDoppelgangerFlow: (payload: DoppelgangerPayload) => Promise<string>;
  clearError: () => void;
}

export const useDecisionTwinStore = create<DecisionTwinState>((set, get) => ({
  session: null,
  simulation: null,
  personas: [],
  selectedUiDomain: "all",
  loading: {
    session: false,
    simulation: false,
    crashTest: false,
    doppelganger: false,
  },
  error: null,

  setSelectedUiDomain: (domain) => set({ selectedUiDomain: domain }),

  clearError: () => set({ error: null }),

  initSession: async (uiDomain) => {
    set((s) => ({
      loading: { ...s.loading, session: true },
      error: null,
      selectedUiDomain: uiDomain,
    }));

    try {
      const backendDomain = uiDomainToBackend(uiDomain);
      let session = await getSession();

      if (!session.has_data || session.domain !== backendDomain) {
        await uploadData({ domain: backendDomain, useMock: true });
        session = await getSession();
      }

      set({ session });
      await get().runSimulationFlow(10);
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to initialize session",
      });
    } finally {
      set((s) => ({ loading: { ...s.loading, session: false } }));
    }
  },

  runSimulationFlow: async (years = 10) => {
    set((s) => ({
      loading: { ...s.loading, simulation: true },
      error: null,
    }));

    try {
      const simulation = await runSimulation({ years });
      const personas =
        simulation.adversarial_personas?.length > 0
          ? mapAdversarialPersonasToUI(simulation.adversarial_personas)
          : get().personas;
      set({ simulation, personas });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Simulation failed",
      });
    } finally {
      set((s) => ({ loading: { ...s.loading, simulation: false } }));
    }
  },

  runCrashTestFlow: async (adversarialCount = 15) => {
    set((s) => ({
      loading: { ...s.loading, crashTest: true },
      error: null,
    }));

    try {
      const simulation = await runCrashTest(adversarialCount);
      const personas = mapAdversarialPersonasToUI(
        simulation.adversarial_personas ?? []
      );
      set({ simulation, personas });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Crash test failed",
      });
    } finally {
      set((s) => ({ loading: { ...s.loading, crashTest: false } }));
    }
  },

  explainDoppelgangerFlow: async (payload) => {
    set((s) => ({
      loading: { ...s.loading, doppelganger: true },
      error: null,
    }));

    try {
      const result = await explainDoppelganger(payload);
      return result.explanation;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Doppelganger explain failed";
      set({ error: message });
      throw err;
    } finally {
      set((s) => ({ loading: { ...s.loading, doppelganger: false } }));
    }
  },
}));
