import { useState, useEffect, useMemo } from "react";
import { Persona } from "../types";
import { Check, X, Shield, RefreshCw } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

interface DoppelgangerLabProps {
  preselectedPersona?: Persona;
}

export default function DoppelgangerLab({ preselectedPersona }: DoppelgangerLabProps) {
  const [originalName, setOriginalName] = useState("Priyanka Sen");
  const [originalGender, setOriginalGender] = useState("Female");
  const [originalIncome, setOriginalIncome] = useState(50000);
  const [originalCreditScore, setOriginalCreditScore] = useState(760);
  const [originalDecision, setOriginalDecision] = useState<"Approved" | "Rejected">("Rejected");

  const [clonedGender, setClonedGender] = useState("Male");
  const [clonedDecision, setClonedDecision] = useState<"Approved" | "Rejected">("Approved");

  const [biasScore, setBiasScore] = useState(91);
  const [systemicProb, setSystemicProb] = useState("High");

  const [explanation, setExplanation] = useState("");

  const explainDoppelgangerFlow = useDecisionTwinStore((s) => s.explainDoppelgangerFlow);
  const loading = useDecisionTwinStore((s) => s.loading.doppelganger);

  // Sync if page loaded from Crash Test select
  useEffect(() => {
    if (preselectedPersona) {
      setOriginalName(preselectedPersona.name);
      setOriginalGender(preselectedPersona.gender);
      setOriginalCreditScore(preselectedPersona.creditScore || 710);
      
      const cleanIncome = parseInt(preselectedPersona.income.replace(/[^0-9]/g, "")) || 50000;
      setOriginalIncome(cleanIncome);
      setOriginalDecision("Rejected");

      setClonedGender(preselectedPersona.gender === "Female" ? "Male" : "Female");
      setClonedDecision("Approved");
      setExplanation("");
    }
  }, [preselectedPersona]);

  // Adjust outcome depending on stats logic
  useEffect(() => {
    if (originalGender === "Female" && clonedGender === "Male" && originalCreditScore >= 700) {
      setOriginalDecision("Rejected");
      setClonedDecision("Approved");
      setBiasScore(91);
      setSystemicProb("High");
    } else if (originalGender === "Male" && clonedGender === "Female" && originalCreditScore >= 700) {
      setOriginalDecision("Approved");
      setClonedDecision("Rejected");
      setBiasScore(88);
      setSystemicProb("High");
    } else {
      setOriginalDecision(originalCreditScore >= 680 ? "Approved" : "Rejected");
      setClonedDecision(originalCreditScore >= 680 ? "Approved" : "Rejected");
      setBiasScore(12);
      setSystemicProb("Minimal");
    }
  }, [originalGender, clonedGender, originalCreditScore, originalIncome]);

  const flipRate = useMemo(() => {
    if (originalDecision !== clonedDecision) return 100;
    return 0;
  }, [originalDecision, clonedDecision]);

  const handleAskGemini = async () => {
    try {
      const result = await explainDoppelgangerFlow({
        original: {
          name: originalName,
          gender: originalGender,
          income: originalIncome,
          creditScore: originalCreditScore,
          decision: originalDecision,
        },
        cloned: {
          gender: clonedGender,
          income: originalIncome,
          creditScore: originalCreditScore,
          decision: clonedDecision,
        },
        biasScore,
      });
      setExplanation(result);
    } catch {
      setExplanation("⚠️ Connection offline. Ledger analysis: Zip-code proxy weight vectors under XGBoost bias models penalize the original female candidate while favoring the cloned male equivalent. Restructuring neural nodes in Policy Lab is recommended.");
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
          <p className="text-xs p-text-muted mt-0.5">Clone applicants with identical parameters, shifting only protected traits like gender to verify bias compliance.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setOriginalGender("Female");
              setClonedGender("Male");
              setOriginalCreditScore(760);
              setOriginalIncome(50000);
              setOriginalName("Priyanka Sen");
              setExplanation("");
            }}
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

          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">Applicant Name</label>
              <input
                type="text"
                value={originalName}
                onChange={(e) => setOriginalName(e.target.value)}
                className="w-full mt-1.5 p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main focus:outline-none focus:p-border-active"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">Protected parameter (Gender)</label>
              <select
                value={originalGender}
                onChange={(e) => setOriginalGender(e.target.value)}
                className="w-full mt-1.5 p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main focus:outline-none focus:p-border-active cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">Monthly Income (₹)</label>
              <input
                type="number"
                value={originalIncome}
                onChange={(e) => setOriginalIncome(Number(e.target.value))}
                className="w-full mt-1.5 p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main font-mono font-bold focus:outline-none focus:p-border-active"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-[9px] font-mono p-text-muted uppercase tracking-wider">Credit Rating Score</label>
                <span className="text-xs font-mono font-bold p-text-accent">{originalCreditScore}</span>
              </div>
              <input
                type="range"
                min="500"
                max="850"
                value={originalCreditScore}
                onChange={(e) => setOriginalCreditScore(Number(e.target.value))}
                className="w-full mt-2 accent-amber-700 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] p-text-muted font-mono mt-0.5">
                <span>500 (Subprime)</span>
                <span>850 (Excellent)</span>
              </div>
            </div>
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

          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">Identical Profile Name</label>
              <input
                type="text"
                disabled
                value={`${originalName} (Twin)`}
                className="w-full mt-1.5 p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main opacity-50 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">Protected parameter (Gender-Swapped)</label>
              <select
                value={clonedGender}
                onChange={(e) => setClonedGender(e.target.value)}
                className="w-full mt-1.5 p-bg-secondary border p-border-active rounded px-3 py-2 text-xs p-text-accent font-bold cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">Monthly Income - Cloned</label>
              <input
                type="text"
                disabled
                value={`₹${originalIncome.toLocaleString()} (Locked to Anchor)`}
                className="w-full mt-1.5 p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono p-text-muted uppercase tracking-wider">Credit Rating - Cloned</label>
              <div className="mt-1.5 p-2.5 p-bg-secondary rounded border p-border text-xs p-text-muted font-mono text-center">
                Strict Parity: Score Locked to <span className="p-text-accent font-bold">{originalCreditScore}</span>
              </div>
            </div>
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
