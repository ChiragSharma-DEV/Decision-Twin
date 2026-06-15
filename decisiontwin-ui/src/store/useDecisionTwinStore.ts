import { create } from "zustand";
import {
  explainDoppelganger,
  getSession,
  runCrashTest,
  runSimulation,
  uiDomainToBackend,
  uploadData,
  overrideDecision,
  generateDetailedReport,
  type UploadDataOptions,
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
  uploadCustomData: (options: UploadDataOptions) => Promise<void>;
  checkActiveSession: () => Promise<boolean>;
  runSimulationFlow: (years?: number) => Promise<void>;
  runCrashTestFlow: (adversarialCount?: number) => Promise<void>;
  explainDoppelgangerFlow: (payload: DoppelgangerPayload) => Promise<string>;
  overrideDecisionFlow: (payload: { year: number; row_index: number; new_decision: number }) => Promise<void>;
  generateDetailedReportFlow: () => Promise<string>;
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
        const defaultTargets: Record<string, { target: string; protected: string }> = {
          lending: { target: "approved", protected: "gender" },
          hiring: { target: "hired", protected: "gender" },
          scholarship: { target: "selected", protected: "gender" },
        };
        const defaults = defaultTargets[backendDomain] || { target: "approved", protected: "gender" };
        
        await uploadData({
          domain: backendDomain,
          useMock: true,
          targetOutcome: defaults.target,
          protectedAttribute: defaults.protected
        });
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

  uploadCustomData: async (options) => {
    set((s) => ({
      loading: { ...s.loading, session: true },
      error: null,
    }));

    try {
      await uploadData(options);
      
      const backendToUiDomain = (domain: string): string => {
        const map: Record<string, string> = {
          lending: "credit",
          scholarship: "education",
          hiring: "employment",
        };
        return map[domain] ?? "credit";
      };
      
      const uiDomain = backendToUiDomain(options.domain);
      set({ selectedUiDomain: uiDomain });

      const session = await getSession();
      set({ session });
      await get().runSimulationFlow(10);
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to upload custom data",
      });
      throw err;
    } finally {
      set((s) => ({ loading: { ...s.loading, session: false } }));
    }
  },

  checkActiveSession: async () => {
    try {
      const session = await getSession();
      if (session.has_data) {
        set({ session });
        
        const backendToUiDomain = (domain: string): string => {
          const map: Record<string, string> = {
            lending: "credit",
            scholarship: "education",
            hiring: "employment",
          };
          return map[domain] ?? "credit";
        };
        
        const uiDomain = backendToUiDomain(session.domain);
        set({ selectedUiDomain: uiDomain });
        
        await get().runSimulationFlow(10);
        return true;
      }
      return false;
    } catch (err) {
      return false;
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

  overrideDecisionFlow: async (payload) => {
    set((s) => ({
      loading: { ...s.loading, simulation: true },
      error: null,
    }));
    try {
      const res = await overrideDecision(payload);
      // Update simulation results using the returned recomputed simulation
      if (res && res.status === "success") {
        // Build simulation object compatible with state
        const updatedSimulation: SimulationResponse = {
          status: "success",
          years_simulated: get().session?.years_simulated ?? 10,
          adversarial_personas_count: get().simulation?.adversarial_personas_count ?? 0,
          adversarial_personas: get().simulation?.adversarial_personas ?? [],
          gemma_critique: res.gemma_critique || "",
          yearly_results: res.yearly_results || [],
          business_impact: res.business_impact
        };
        
        const personas =
          updatedSimulation.adversarial_personas?.length > 0
            ? mapAdversarialPersonasToUI(updatedSimulation.adversarial_personas)
            : get().personas;

        set({ simulation: updatedSimulation, personas });
      } else {
        // Fallback: just refresh simulation from scratch
        await get().runSimulationFlow(get().session?.years_simulated ?? 10);
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Override decision failed",
      });
      throw err;
    } finally {
      set((s) => ({ loading: { ...s.loading, simulation: false } }));
    }
  },

  generateDetailedReportFlow: async () => {
    try {
      const res = await generateDetailedReport();
      return res.report;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Detailed report generation failed";
      set({ error: message });
      throw err;
    }
  },
}));
