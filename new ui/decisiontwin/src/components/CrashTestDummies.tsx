import { useEffect, useState } from "react";
import { Persona } from "../types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

interface CrashTestDummiesProps {
  onSelectPersona?: (persona: Persona) => void;
  onNavigateToTab?: (tab: string) => void;
}

export default function CrashTestDummies({ onSelectPersona, onNavigateToTab }: CrashTestDummiesProps) {
  const { personas, loading, error, runCrashTestFlow } = useDecisionTwinStore();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  useEffect(() => {
    if (personas.length > 0) {
      setSelectedPersona((prev) => {
        if (prev && personas.some((p) => p.id === prev.id)) return prev;
        return personas[0];
      });
    } else {
      setSelectedPersona(null);
    }
  }, [personas]);

  const handleDeploy = () => {
    runCrashTestFlow(15);
  };

  return (
    <div className="space-y-6" id="crash-test-dummies-view">
      {/* Page Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">Demographic Adversarial Testing</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Digital Crash Test Dummies</h2>
          <p className="text-xs p-text-muted mt-0.5">Stress-test production scoring filters using calibrated adversarial applicant archetypes before deployment.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={handleDeploy}
            disabled={loading.crashTest}
            className="px-4 py-2 rounded font-mono text-[11px] font-bold uppercase tracking-wider p-bg-accent text-white hover:p-bg-accent-hover transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading.crashTest ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deploying Dummies...
              </>
            ) : (
              "Deploy Adversarial Dummies"
            )}
          </button>
          <button
            onClick={() => onNavigateToTab?.("doppelganger")}
            className="px-4 py-2 rounded font-mono text-[11px] font-bold uppercase tracking-wider p-bg-accent text-white hover:p-bg-accent-hover transition-all cursor-pointer shadow-sm"
          >
            Doppelganger Lab ➔
          </button>
        </div>
      </div>

      {error && (
        <p className="text-[11px] font-mono p-text-warning px-2">{error}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Grid of cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading.crashTest && personas.length === 0 ? (
            <div className="col-span-full p-8 rounded border p-border p-bg-card text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto p-text-accent" />
              <p className="text-xs p-text-muted mt-3 font-mono uppercase tracking-wider">Generating adversarial personas...</p>
            </div>
          ) : personas.length === 0 ? (
            <div className="col-span-full p-8 rounded border p-border p-bg-card text-center">
              <p className="text-xs p-text-muted font-sans">No adversarial personas loaded. Click <span className="font-bold p-text-accent">Deploy Adversarial Dummies</span> to run the crash test.</p>
            </div>
          ) : (
            personas.map((p) => {
            const isSelected = selectedPersona?.id === p.id;
            const vulnColor = p.vulnerability === "Critical" 
              ? "text-red-500 bg-red-500/10 border-red-500/20" 
              : p.vulnerability === "High"
              ? "p-text-warning p-bg-warning-muted border-red-500/20"
              : "text-amber-500 bg-amber-500/10 border-amber-500/20";

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPersona(p)}
                className={`p-5 rounded border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? "p-bg-card p-border-active shadow-md"
                    : "p-bg-card p-border h-full hover:p-border-active"
                }`}
              >
                {/* Subtle top right background tag */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neutral-200/5 to-transparent rounded-full translate-x-4 -translate-y-4" />
                
                <div className="flex items-start gap-4">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover border p-border shrink-0 shadow-sm"
                  />
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-bold p-text-main tracking-tight">{p.name}</h4>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${vulnColor}`}>
                        {p.vulnerability}
                      </span>
                    </div>
                    <p className="text-[11px] p-text-accent font-mono leading-none font-semibold uppercase tracking-wider">{p.role}</p>
                    <p className="text-[10px] p-text-muted leading-tight line-clamp-1">{p.location}</p>
                  </div>
                </div>

                {/* Score meters */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t p-border pt-3.5">
                  <div>
                    <span className="text-[9px] font-mono p-text-muted uppercase tracking-tight block">Approval Probability</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-xl font-light font-mono ${p.approvalProbability < 40 ? "text-red-500 font-normal" : "p-text-accent"}`}>
                        {p.approvalProbability}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono p-text-muted uppercase tracking-tight block">Risk Index Score</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-light font-mono p-text-main">
                        {p.riskScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compound Feedback Loop Tracker */}
                <div className="mt-4 flex gap-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
                  {p.heatmap.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-grow transition-colors"
                      style={{
                        backgroundColor: val > 75 ? "#EA4335" : val > 50 ? "#FBBC05" : "#34A853"
                      }}
                      title={`Time step score index: ${val}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono p-text-muted mt-1.5 uppercase tracking-widest font-semibold">
                  <span>Simulation Horizon</span>
                  <span>10 Years ➔</span>
                </div>
              </div>
            );
          })
          )}
        </div>

        {/* Right column: Single Persona deep telemetry inspection desk */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded border p-border p-bg-card space-y-6 sticky top-24 shadow-sm">
            {selectedPersona ? (
              <>
            <div className="flex items-center gap-3">
              <img
                src={selectedPersona.avatar}
                alt={selectedPersona.name}
                className="w-14 h-14 rounded object-cover border p-border shadow-sm"
              />
              <div>
                <h3 className="text-lg font-serif font-bold p-text-main leading-tight">{selectedPersona.name}</h3>
                <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest block font-bold mt-0.5">CANDIDATE INTELLIGENCE</span>
                <span className="text-[11px] p-text-muted block mt-0.5">{selectedPersona.gender} • Monthly Income: {selectedPersona.income}</span>
              </div>
            </div>

            <div className="space-y-4 border-t p-border pt-4">
              <div>
                <span className="text-[9px] font-mono p-text-muted uppercase tracking-widest block">Core Demographics</span>
                <div className="grid grid-cols-2 gap-2 mt-1.5 p-bg-secondary p-3 rounded border p-border text-[11px] font-mono p-text-main shadow-inner">
                  <div>Edu: {selectedPersona.education}</div>
                  <div>Disability: {selectedPersona.disability}</div>
                  <div className="col-span-2 text-[10px] p-text-muted mt-1">Location Profile: {selectedPersona.location}</div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono p-text-muted uppercase tracking-widest block">Autonomous Prediction Outcome</span>
                <div className="p-3.5 p-bg-warning-muted border p-warning-border p-text-warning rounded text-xs font-sans mt-2 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block uppercase text-[10px] tracking-wide">Automatic Reject Flagged</span>
                    <p className="text-[11px] p-text-main mt-1 leading-relaxed">{selectedPersona.outcome}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono p-text-muted uppercase tracking-widest block">Audit Vulnerability Assessment</span>
                <p className="text-xs p-text-main leading-relaxed mt-1.5 font-sans">
                  {selectedPersona.vulnerabilityDetail}
                </p>
              </div>

              {/* Advanced multi-step heatmap graph breakdown */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono p-text-muted uppercase tracking-widest block">10-Year Probability Drift Heatmap</span>
                <div className="space-y-1.5">
                  {selectedPersona.heatmap.map((score, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <span className="text-[9px] font-mono p-text-muted w-12">Year {2026 + hIdx}</span>
                      <div className="flex-grow bg-neutral-200 dark:bg-neutral-800 h-2 rounded overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${score}%`,
                            backgroundColor: score > 70 ? "#EA4335" : score > 40 ? "#FBBC05" : "#34A853"
                          }}
                        />
                      </div>
                      <span className="text-[9px] font-mono p-text-main w-6 text-right">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t p-border">
              <button
                onClick={() => onSelectPersona?.(selectedPersona)}
                className="w-full py-2.5 rounded font-mono text-[11px] font-semibold uppercase tracking-wider p-bg-accent text-white hover:p-bg-accent-hover transition-all cursor-pointer text-center shadow-sm"
              >
                Launch Doppelganger Simulation
              </button>
            </div>
              </>
            ) : (
              <p className="text-xs p-text-muted text-center py-8 font-sans">Select a deployed dummy or run the crash test to inspect telemetry.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
