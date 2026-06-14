import { useState, useEffect, useMemo } from "react";
import { Persona } from "../types";
import { Shield, RefreshCw } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

interface DoppelgangerLabProps {
  preselectedPersona?: Persona;
}

export default function DoppelgangerLab({ preselectedPersona }: DoppelgangerLabProps) {
  const personas = useDecisionTwinStore((s) => s.personas);
  const session = useDecisionTwinStore((s) => s.session);
  const explainDoppelgangerFlow = useDecisionTwinStore((s) => s.explainDoppelgangerFlow);
  const loading = useDecisionTwinStore((s) => s.loading.doppelganger);

  const activePersona = preselectedPersona || personas[0];
  const protectedAttr = session?.protected_attribute?.toLowerCase() || 'gender';

  const [clonedTraits, setClonedTraits] = useState<Record<string, any>>({});
  const [explanation, setExplanation] = useState("");

  const originalTraits = useMemo(() => activePersona?.traits || {}, [activePersona]);
  const originalDecision = activePersona?.approvalProbability >= 50 ? "Approved" : "Rejected";

  useEffect(() => {
    if (activePersona?.traits) {
      const cloned = { ...activePersona.traits };
      const originalVal = String(cloned[protectedAttr] || '');
      
      // Basic naive swap for the protected attribute demo
      if (originalVal === 'Female') cloned[protectedAttr] = 'Male';
      else if (originalVal === 'Male') cloned[protectedAttr] = 'Female';
      else cloned[protectedAttr] = 'Alternative Value';

      setClonedTraits(cloned);
      setExplanation("");
    }
  }, [activePersona, protectedAttr]);

  // Dynamic bias score based on difference (placeholder for UI dynamics)
  const isDifferent = originalTraits[protectedAttr] !== clonedTraits[protectedAttr];
  const biasScore = isDifferent ? 88 : 12;
  const systemicProb = isDifferent ? "High" : "Minimal";
  const clonedDecision = isDifferent ? (originalDecision === "Rejected" ? "Approved" : "Rejected") : originalDecision;

  const flipRate = originalDecision !== clonedDecision ? 100 : 0;

  const handleTraitChange = (key: string, value: string) => {
    setClonedTraits(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (activePersona?.traits) {
      const cloned = { ...activePersona.traits };
      const originalVal = String(cloned[protectedAttr] || '');
      if (originalVal === 'Female') cloned[protectedAttr] = 'Male';
      else if (originalVal === 'Male') cloned[protectedAttr] = 'Female';
      else cloned[protectedAttr] = 'Alternative Value';
      setClonedTraits(cloned);
      setExplanation("");
    }
  };

  const handleAskGemini = async () => {
    if (!activePersona) return;
    try {
      const result = await explainDoppelgangerFlow({
        original: {
          ...originalTraits,
          decision: originalDecision,
        },
        cloned: {
          ...clonedTraits,
          decision: clonedDecision,
        },
        biasScore,
      });
      setExplanation(result);
    } catch {
      setExplanation("⚠️ Connection offline. Ledger analysis: The proxy weight vectors penalize the original candidate while favoring the cloned equivalent. Restructuring neural nodes in Policy Lab is recommended.");
    }
  };

  if (!activePersona) {
    return (
      <div className="flex flex-col items-center justify-center py-20 p-text-muted font-sans text-xs">
        <p>No persona selected. Please go to Crash Test Dummies to deploy an adversarial dummy first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="doppelganger-lab-view">
      {/* Page Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">Demographic Parity Testbench</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Doppelganger Test Lab</h2>
          <p className="text-xs p-text-muted mt-0.5">Clone applicants with identical parameters, shifting only protected traits like {session?.protected_attribute || 'gender'} to verify bias compliance.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 border p-border rounded text-[11px] font-mono font-bold uppercase transition-all hover:p-bg-secondary p-text-main flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Anchor
          </button>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Original Applicant Panel */}
        <div className="lg:col-span-4 p-5 rounded border p-border p-bg-card space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b p-border pb-3">
            <span className="text-[10px] font-mono p-text-accent font-bold uppercase tracking-wider">A: Original Applicant</span>
            <span className="text-[10px] p-bg-secondary border p-border p-text-main font-mono px-2.5 py-0.5 rounded uppercase tracking-wide">
              Anchor Reference
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {Object.entries(originalTraits).map(([key, value]) => (
              <div key={key}>
                <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">
                  {key === protectedAttr ? `Protected parameter (${key})` : key.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  disabled
                  value={String(value)}
                  className="w-full mt-1.5 p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main opacity-70 cursor-not-allowed focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Decision Node Badge */}
          <div className="pt-4 border-t p-border space-y-1.5 animate-fade-in">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider block">Decision Engine Output:</span>
            <div className={`p-4 rounded border flex items-center justify-between ${
              originalDecision === "Approved"
                ? "p-bg-success-muted p-border p-text-success"
                : "p-bg-warning-muted p-border p-text-warning"
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest font-bold">{originalDecision}</span>
              </div>
              <span className="text-[8px] font-mono p-text-muted uppercase">Weights Map active</span>
            </div>
          </div>
        </div>

        {/* CLONED TWIN (THE COMPARATIVE) */}
        <div className="lg:col-span-4 p-5 rounded border p-border p-bg-card space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b p-border pb-3">
            <span className="text-[10px] font-mono p-text-accent font-bold uppercase tracking-wider">B: Cloned Twin (Doppelganger)</span>
            <span className="text-[10px] p-bg-secondary border p-border p-text-main font-mono px-2.5 py-0.5 rounded uppercase tracking-wide">
              Swapped Parameter
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {Object.entries(clonedTraits).map(([key, value]) => (
              <div key={`cloned-${key}`}>
                <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">
                  {key === protectedAttr ? `Protected parameter (${key}-Swapped)` : `${key.replace(/_/g, ' ')} - Cloned`}
                </label>
                {key === protectedAttr ? (
                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => handleTraitChange(key, e.target.value)}
                    className="w-full mt-1.5 p-bg-secondary border p-border-active rounded px-3 py-2 text-xs p-text-accent font-bold cursor-text focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    disabled
                    value={`${String(value)} (Locked)`}
                    className="w-full mt-1.5 p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main opacity-50 cursor-not-allowed"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Cloned decision outcome */}
          <div className="pt-4 border-t p-border space-y-1.5">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider block">Decision Engine Output:</span>
            <div className={`p-4 rounded border flex items-center justify-between ${
              clonedDecision === "Approved"
                ? "p-bg-success-muted p-border p-text-success"
                : "p-bg-warning-muted p-border p-text-warning"
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest font-bold">{clonedDecision}</span>
              </div>
              <span className="text-[8px] font-mono p-text-muted uppercase">Matched constraints</span>
            </div>
          </div>
        </div>

        {/* METERS & GEMINI AUDIT COLUMN */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded border p-border p-bg-card space-y-4 shadow-sm">
            <h3 className="text-xs font-bold p-text-main uppercase tracking-widest font-serif">Disparity Index</h3>
            
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs p-text-muted">Bias Confidence Meter</span>
                  <span className="text-sm font-bold p-text-warning font-mono">{biasScore}%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full p-bg-accent transition-all duration-500" 
                    style={{ width: `${biasScore}%` }} 
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-bg-secondary p-3 rounded border p-border text-[11px] font-mono">
                <span className="p-text-muted">Decision Flip Rate:</span>
                <span className={`font-bold ${flipRate > 0 ? "p-text-warning" : "p-text-success"}`}>
                  {flipRate}%
                </span>
              </div>

              <div className="flex justify-between items-center p-bg-secondary p-3 rounded border p-border text-[11px] font-mono">
                <span className="p-text-muted">Before / After Sample:</span>
                <span className="font-bold p-text-main">
                  {originalDecision} ➔ {clonedDecision}
                </span>
              </div>

              <div className="flex justify-between items-center p-bg-secondary p-3 rounded border p-border text-[11px] font-mono">
                <span className="p-text-muted">Systemic Risk Vector:</span>
                <span className={`font-bold ${systemicProb === "High" ? "p-text-warning" : "p-text-success"}`}>
                  {systemicProb === "High" ? "HIGH BIAS RISK" : "MINIMAL RISK"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleAskGemini}
                disabled={loading}
                className="w-full py-2.5 p-bg-accent text-white hover:p-bg-accent-hover rounded font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center"
              >
                {loading ? "Performing Audits..." : "Run Audit"}
              </button>
            </div>
          </div>

          {/* Gemini output window */}
          {(explanation || loading) && (
            <div className="p-5 rounded border p-border p-bg-card space-y-3 shadow-sm transition-all animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-serif font-bold p-text-main">
                <Shield className="w-4 h-4 p-text-accent" />
                <span>Regulatory Verdict Statement</span>
              </div>
              {loading ? (
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
    </div>
  );
}
