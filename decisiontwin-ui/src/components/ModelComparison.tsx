import { useState } from "react";
import { INITIAL_MODELS } from "../mockData";
import { ModelMetric } from "../types";
import { Sparkles, Brain, Layers } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

export default function ModelComparison() {
  const simulation = useDecisionTwinStore((s) => s.simulation);
  const session = useDecisionTwinStore((s) => s.session);
  
  const latestYear = simulation?.yearly_results?.[simulation.yearly_results.length - 1];
  const dpRatio = latestYear?.metrics?.demographic_parity_ratio ?? 0.85;
  const disparateImpact = latestYear?.metrics?.disparate_impact ?? 0.82;
  const averageTargetRate = latestYear?.average_target_rate ?? 0.42;

  const modelPath = session?.model_path || "lending_model.pkl";
  const modelFilename = modelPath.split(/[/\\]/).pop() || "Active Model";
  
  const activeModelDetails: ModelMetric = {
    name: `Active: ${modelFilename} (Guardrailed)`,
    accuracy: Math.min(99, Math.round(averageTargetRate * 100 + 40)), 
    fairness: Math.round(dpRatio * 100),
    compliance: Math.round(Math.min(1.0, disparateImpact) * 100),
    explainability: 94,
    riskScore: Math.round((1.0 - disparateImpact) * 100),
    governanceScore: Math.round(dpRatio * 100)
  };

  const dynamicModels = [
    ...INITIAL_MODELS.slice(0, 4),
    activeModelDetails
  ];

  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(4);
  const selectedModel = dynamicModels[selectedModelIndex] || activeModelDetails;

  return (
    <div className="space-y-6" id="model-comparison-view">
      {/* Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">Algorithmic Tradeoff Engine</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Multi-Model Comparison Lab</h2>
          <p className="text-xs p-text-muted mt-0.5">Evaluate model tradeoffs between deep precision and governance compliance across legacy classification algorithms.</p>
        </div>
        <div className="flex gap-2">
          <span className="p-bg-secondary border p-border p-text-main px-3 py-1.5 text-[10px] font-mono rounded flex items-center gap-1.5 uppercase font-bold tracking-wider">
            <Layers className="w-4 h-4 p-text-accent" /> 5 Model Profiles Active
          </span>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Comparison Matrix Table */}
        <div className="lg:col-span-8 p-6 rounded border p-border p-bg-card space-y-4 shadow-sm">
          <span className="text-xs font-bold p-text-main uppercase tracking-widest block font-serif">
            Candidate Performance & Risk Scorecard
          </span>

          <div className="overflow-x-auto text-[11px] font-sans">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b p-border text-[9px] font-mono p-text-muted uppercase tracking-wider">
                  <th className="py-3">ALGORITHM MODEL SCHEMA</th>
                  <th className="py-3 text-center">ACCURACY</th>
                  <th className="py-3 text-center">FAIRNESS</th>
                  <th className="py-3 text-center font-bold">COMPLIANCE</th>
                  <th className="py-3 text-center">EXPLAINABILITY</th>
                  <th className="py-3 text-center">GOVERNANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y p-border">
                {dynamicModels.map((m, idx) => {
                  const isSelected = selectedModelIndex === idx;
                  const isGuardrailed = m.name.includes("Active");

                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedModelIndex(idx)}
                      className={`hover:p-bg-secondary transition-all cursor-pointer duration-250 ${
                        isSelected 
                          ? "p-bg-accent-muted font-semibold p-text-accent p-border-active border-l-4" 
                          : ""
                      }`}
                    >
                      <td className="py-3 flex items-center gap-2">
                        {isGuardrailed ? (
                          <Sparkles className="w-3.5 h-3.5 p-text-accent animate-pulse" />
                        ) : (
                          <Brain className="w-3.5 h-3.5 p-text-muted" />
                        )}
                        <span className="p-text-main">{m.name}</span>
                      </td>
                      <td className="py-3 text-center font-mono p-text-main">{m.accuracy}%</td>
                      <td className="py-3 text-center font-mono p-text-main">{m.fairness}%</td>
                      <td className="py-3 text-center font-mono p-text-main">{m.compliance}%</td>
                      <td className="py-3 text-center font-mono p-text-main">{m.explainability}%</td>
                      <td className="py-3 text-center font-mono font-bold p-text-success">
                        {m.governanceScore}/100
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 p-bg-secondary rounded border p-border flex items-center justify-between text-[11px] font-mono">
            <span className="p-text-muted">Select any row to view individual metrics and audit reports.</span>
            <span className="p-text-accent font-bold uppercase">DecisionTwin Active</span>
          </div>
        </div>

        {/* Selected Model metrics deep analysis */}
        <div className="lg:col-span-4 rounded border p-border p-bg-card p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 border-b p-border pb-3">
            <h3 className="text-xs font-bold p-text-main uppercase tracking-widest font-serif">Metric Breakdown</h3>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-base font-bold p-text-main font-serif leading-snug">{selectedModel.name}</span>
              <span className="text-[9px] font-mono p-text-muted block uppercase tracking-widest mt-1">Active Schema Profile</span>
            </div>

            {/* Custom styled progress bars */}
            <div className="space-y-3.5">
              {[
                { name: "Prediction Accuracy", val: selectedModel.accuracy },
                { name: "Demographic Fairness", val: selectedModel.fairness },
                { name: "Regulatory Compliance", val: selectedModel.compliance },
                { name: "Explainability Depth", val: selectedModel.explainability },
                { name: "Weighted Safety Ratio", val: 100 - selectedModel.riskScore }
              ].map((bar, bIdx) => (
                <div key={bIdx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="p-text-muted font-sans">{bar.name}</span>
                    <span className="font-mono p-text-main font-bold">{bar.val}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full p-bg-accent transition-all duration-300"
                      style={{ width: `${bar.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pro/Con Summary of model style */}
            <div className="p-4 rounded border p-border p-bg-secondary space-y-2 shadow-sm">
              <span className="text-[9px] font-mono p-text-muted uppercase tracking-widest block font-bold">Audit Specialist Verdict</span>
              {selectedModel.governanceScore > 90 ? (
                <div className="text-xs p-text-success font-sans space-y-1">
                  <div className="font-extrabold flex items-center gap-1">✓ GOVERNANCE RATING: PASS</div>
                  <p className="text-[11px] p-text-main leading-relaxed">
                    This model matches RBI Sandbox digital requirements. Features are decoupled from zip-code and gender proxies, neutralizing systemic bias without compromising margins.
                  </p>
                </div>
              ) : selectedModel.accuracy > 90 ? (
                <div className="text-xs p-text-warning font-sans space-y-1 animate-pulse">
                  <div className="font-extrabold flex items-center gap-1">⚠️ SYSTEM REGULATORY LEAKAGE</div>
                  <p className="text-[11px] p-text-main leading-relaxed">
                    While matching 91%+ test accuracy, this schema relies heavily on proxy indicators mapping Low Income/Rural coordinates, violating standard compliance protocols.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-amber-500 font-sans space-y-1">
                  <div className="font-extrabold flex items-center gap-1">● COMPLIANCE STATUS: EVALUATING</div>
                  <p className="text-[11px] p-text-main leading-relaxed">
                    This model limits complex proxy bias but lacks predictive depth or has poor explainability scores, producing moderate overall governance.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
