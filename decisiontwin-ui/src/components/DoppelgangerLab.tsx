import { useState, useEffect, useMemo } from "react";
import { Shield, RefreshCw, Loader2, AlertOctagon, Flame } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";
import { runDoppelganger, explainDoppelganger } from "../services/api";
import type { DoppelgangerResponse } from "../services/types";
import type { Persona } from "../types";

interface DoppelgangerLabProps {
  preselectedPersona?: Persona;
}

export default function DoppelgangerLab({ preselectedPersona }: DoppelgangerLabProps) {
  const session = useDecisionTwinStore((s) => s.session);
  
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditResult, setAuditResult] = useState<DoppelgangerResponse["data"] | null>(null);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const protectedAttr = session?.protected_attribute?.toLowerCase() || "gender";

  const handleRunAudit = async () => {
    setAuditRunning(true);
    setError(null);
    setAuditResult(null);
    setExplanation("");
    try {
      const result = await runDoppelganger();
      if (result.status === "success" && result.data) {
        setAuditResult(result.data);
        setSelectedSampleIndex(0);
      } else {
        setError("Failed to retrieve doppelganger audit results.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Doppelgänger audit failed.");
    } finally {
      setAuditRunning(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setSelectedSampleIndex(0);
    setExplanation("");
    setError(null);
  };

  const selectedSample = useMemo(() => {
    if (!auditResult?.flipped_cases_sample || auditResult.flipped_cases_sample.length === 0) {
      return null;
    }
    return auditResult.flipped_cases_sample[selectedSampleIndex] || null;
  }, [auditResult, selectedSampleIndex]);

  const originalTraits = useMemo(() => selectedSample?.original_traits || {}, [selectedSample]);
  const flippedTraits = useMemo(() => selectedSample?.flipped_traits || {}, [selectedSample]);

  const handleAskGemini = async () => {
    if (!selectedSample || !auditResult) return;
    setExplaining(true);
    setExplanation("");
    try {
      const getValString = (traits: Record<string, any>, keys: string[]) => {
        for (const k of keys) {
          if (traits[k] !== undefined) return String(traits[k]);
        }
        return "N/A";
      };
      
      const getValNum = (traits: Record<string, any>, keys: string[]) => {
        for (const k of keys) {
          if (typeof traits[k] === "number") return traits[k];
          if (typeof traits[k] === "string") {
            const parsed = parseInt(traits[k].replace(/[^0-9]/g, ""), 10);
            if (!Number.isNaN(parsed)) return parsed;
          }
        }
        return 0;
      };

      const nameVal = getValString(originalTraits, ["name", "candidate_name", "applicant_name"]) !== "N/A"
        ? getValString(originalTraits, ["name", "candidate_name", "applicant_name"])
        : `Flipped Candidate #${selectedSampleIndex + 1}`;

      const payload = {
        original: {
          name: nameVal,
          gender: getValString(originalTraits, [protectedAttr, "gender"]),
          income: getValNum(originalTraits, ["income", "family_income"]),
          creditScore: getValNum(originalTraits, ["credit_score", "creditScore", "academic_score", "technical_score"]),
          decision: "Rejected",
        },
        cloned: {
          gender: getValString(flippedTraits, [protectedAttr, "gender"]),
          income: getValNum(flippedTraits, ["income", "family_income"]),
          creditScore: getValNum(flippedTraits, ["credit_score", "creditScore", "academic_score", "technical_score"]),
          decision: "Approved",
        },
        biasScore: auditResult.flip_rate_percentage,
      };

      const result = await explainDoppelganger(payload);
      setExplanation(result.explanation);
    } catch {
      setExplanation("⚠️ Connection offline. Ledger analysis: The proxy weight vectors penalize the original candidate while favoring the cloned equivalent. Restructuring neural nodes in Policy Lab is recommended.");
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="space-y-6" id="doppelganger-lab-view">
      {/* Page Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">Demographic Parity Testbench</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Doppelganger Test Lab</h2>
          <p className="text-xs p-text-muted mt-0.5">Clone applicants with identical parameters, shifting only protected traits like {session?.protected_attribute || "gender"} to verify bias compliance.</p>
        </div>
        <div className="flex gap-2">
          {auditResult && (
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 border p-border rounded text-[11px] font-mono font-bold uppercase transition-all hover:p-bg-secondary p-text-main flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Audit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 p-bg-warning-muted border border-red-500/20 text-red-500 rounded text-xs font-mono">
          ⚠️ Audit Error: {error}
        </div>
      )}

      {auditRunning && (
        <div className="p-12 rounded border p-border p-bg-card text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto p-text-accent" />
          <p className="text-xs p-text-muted font-mono uppercase tracking-wider">
            Running counterfactual analysis across entire applicant dataset...
          </p>
          <p className="text-[11px] p-text-muted max-w-md mx-auto leading-relaxed">
            This processes model predictions for all rejected candidates after swapping their protected trait ({protectedAttr}) to the privileged class to determine the decision flip rate.
          </p>
        </div>
      )}

      {!auditRunning && !auditResult && (
        <div className="p-12 rounded border p-border p-bg-card text-center space-y-4">
          <AlertOctagon className="w-8 h-8 mx-auto p-text-accent" />
          <h3 className="text-sm font-bold p-text-main font-serif">Counterfactual Audit Required</h3>
          <p className="text-xs p-text-muted max-w-lg mx-auto leading-relaxed">
            The Doppelganger Lab performs a strict counterfactual audit on the loaded machine learning model using the active dataset. It swaps the protected attribute ({protectedAttr}) for all rejected unprivileged candidates and re-runs model inference to calculate the exact decision flip rate.
          </p>
          {preselectedPersona && (
            <div className="p-3.5 p-bg-secondary border p-border rounded text-xs p-text-main max-w-md mx-auto">
              Selected Anchor candidate: <span className="font-bold p-text-accent">{preselectedPersona.name}</span>. Click below to analyze identical candidates and check if their decisions flip under trait swaps.
            </div>
          )}
          <button
            onClick={handleRunAudit}
            className="px-6 py-2.5 p-bg-accent text-white hover:p-bg-accent-hover font-mono text-[11px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm"
          >
            Run Doppelganger Audit
          </button>
        </div>
      )}

      {!auditRunning && auditResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Panel A: Original traits */}
          <div className="lg:col-span-4 p-5 rounded border p-border p-bg-card space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b p-border pb-3">
              <span className="text-[10px] font-mono p-text-accent font-bold uppercase tracking-wider">A: Original Applicant</span>
              <span className="text-[10px] p-bg-secondary border p-border p-text-main font-mono px-2.5 py-0.5 rounded uppercase tracking-wide">
                Rejected Candidate
              </span>
            </div>

            {selectedSample ? (
              <div className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {Object.entries(originalTraits).map(([key, value]) => {
                    if (key === session?.target_outcome || key === "model_decision") return null;
                    return (
                      <div key={key}>
                        <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">
                          {key === protectedAttr ? `Protected trait (${key})` : key.replace(/_/g, " ")}
                        </label>
                        <input
                          type="text"
                          disabled
                          value={String(value)}
                          className="w-full mt-1.5 p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main opacity-70 cursor-not-allowed focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t p-border space-y-1.5">
                  <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider block">Decision Engine Output:</span>
                  <div className="p-4 rounded border flex items-center justify-between p-bg-warning-muted p-border p-text-warning">
                    <span className="text-xs font-mono uppercase tracking-widest font-bold">Rejected</span>
                    <span className="text-[8px] font-mono p-text-muted uppercase">Dataset Row</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs p-text-muted text-center py-10">No candidates available.</p>
            )}
          </div>

          {/* Panel B: Flipped twin */}
          <div className="lg:col-span-4 p-5 rounded border p-border p-bg-card space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b p-border pb-3">
              <span className="text-[10px] font-mono p-text-accent font-bold uppercase tracking-wider">B: Cloned Twin (Doppelganger)</span>
              <span className="text-[10px] p-bg-secondary border p-border p-text-main font-mono px-2.5 py-0.5 rounded uppercase tracking-wide">
                Flipped to Privileged
              </span>
            </div>

            {selectedSample ? (
              <div className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {Object.entries(flippedTraits).map(([key, value]) => {
                    if (key === session?.target_outcome || key === "model_decision") return null;
                    const isSwapped = key === protectedAttr;
                    return (
                      <div key={`cloned-${key}`}>
                        <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">
                          {isSwapped ? `Protected trait (${key}-Swapped)` : `${key.replace(/_/g, " ")}`}
                        </label>
                        <input
                          type="text"
                          disabled
                          value={String(value)}
                          className={`w-full mt-1.5 p-bg-secondary border rounded px-3 py-2 text-xs opacity-80 cursor-not-allowed ${
                            isSwapped ? "p-border-active p-text-accent font-bold" : "p-border p-text-main"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t p-border space-y-1.5">
                  <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider block">Decision Engine Output:</span>
                  <div className="p-4 rounded border flex items-center justify-between p-bg-success-muted p-border p-text-success">
                    <span className="text-xs font-mono uppercase tracking-widest font-bold">Approved</span>
                    <span className="text-[8px] font-mono p-text-muted uppercase">Decision Flipped</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs p-text-muted text-center py-10">No candidates available.</p>
            )}
          </div>

          {/* Right sidebar: Audit metrics & sample selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded border p-border p-bg-card space-y-4 shadow-sm">
              <h3 className="text-xs font-bold p-text-main uppercase tracking-widest font-serif">Audit Disparity Index</h3>

              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs p-text-muted">Dataset Flip Rate</span>
                    <span className="text-sm font-bold p-text-warning font-mono">{auditResult.flip_rate_percentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full p-bg-accent transition-all duration-500" 
                      style={{ width: `${auditResult.flip_rate_percentage}%` }} 
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center p-bg-secondary p-3 rounded border p-border text-[11px] font-mono">
                  <span className="p-text-muted">Privileged Group:</span>
                  <span className="font-bold p-text-accent uppercase">
                    {auditResult.privileged_class}
                  </span>
                </div>

                {auditResult.flipped_cases_sample.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono p-text-muted uppercase tracking-widest block font-bold">
                      Flipped Cases Sample ({auditResult.flipped_cases_sample.length})
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {auditResult.flipped_cases_sample.map((caseItem, idx) => {
                        const original = caseItem.original_traits;
                        const nameVal = original.name || original.candidate_name || original.applicant_name || `Flipped Case #${idx + 1}`;
                        const isSelected = selectedSampleIndex === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedSampleIndex(idx);
                              setExplanation("");
                            }}
                            className={`w-full py-1.5 px-3 rounded border text-left text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "p-bg-accent text-white border-transparent"
                                : "p-bg-secondary p-border p-text-main hover:p-border-active"
                            }`}
                          >
                            <span className="truncate max-w-[140px]">{nameVal}</span>
                            <span className="text-[9px] opacity-85">
                              {original[protectedAttr]} ➔ {auditResult.privileged_class}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 p-bg-success-muted rounded border p-border text-center text-xs p-text-success">
                    No individual decision flips detected. Perfect parity achieved.
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAskGemini}
                  disabled={explaining || !selectedSample}
                  className="w-full py-2.5 p-bg-accent text-white hover:p-bg-accent-hover rounded font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center disabled:opacity-65"
                >
                  {explaining ? "Performing Audits..." : "Run Gemini Explanation"}
                </button>
              </div>
            </div>

            {/* Explanation box */}
            {(explanation || explaining) && (
              <div className="p-5 rounded border p-border p-bg-card space-y-3 shadow-sm transition-all animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-serif font-bold p-text-main">
                  <Shield className="w-4 h-4 p-text-accent" />
                  <span>Regulatory Verdict Statement</span>
                </div>
                {explaining ? (
                  <div className="space-y-2 pt-1 animate-pulse">
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
                  </div>
                ) : (
                  <p className="text-[11px] p-text-main leading-relaxed whitespace-pre-wrap font-sans">
                    {explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
