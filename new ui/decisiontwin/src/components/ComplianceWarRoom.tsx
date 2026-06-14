import { useState } from "react";
import { INITIAL_COMPLIANCE } from "../mockData";
import { ComplianceFramework } from "../types";
import { ShieldCheck, FileCheck, AlertTriangle } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

export default function ComplianceWarRoom() {
  const simulation = useDecisionTwinStore((s) => s.simulation);
  const latestYear = simulation?.yearly_results?.[simulation.yearly_results.length - 1];
  const disparateImpact = latestYear?.metrics?.disparate_impact ?? 0.85;

  const dynamicCompliance = INITIAL_COMPLIANCE.map((frame) => {
    const basePct = frame.id === "comp-6" ? 100 : (frame.id === "comp-1" ? 96 : (frame.id === "comp-2" ? 92 : (frame.id === "comp-3" ? 88 : (frame.id === "comp-4" ? 79 : 95))));
    const percentage = Math.round(disparateImpact * basePct);
    const status = percentage >= 80 ? "Pass" : "Monitor";
    return {
      ...frame,
      percentage,
      status
    };
  });

  const [selectedCompId, setSelectedCompId] = useState<string>(dynamicCompliance[0]?.id || "");
  const selectedComp = dynamicCompliance.find(c => c.id === selectedCompId) || dynamicCompliance[0];

  return (
    <div className="space-y-6" id="compliance-war-room-view">
      {/* Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">REGULATORY COMPLIANCE WAR ROOM</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Compliance War Room</h2>
          <p className="text-xs p-text-muted mt-0.5">Stress-test your mathematical models against key sovereign data protection frameworks and statutory digital guidelines.</p>
        </div>
        <div className="p-bg-success-muted border p-success-border p-text-success px-3.5 py-1.5 text-[10px] font-bold font-mono rounded flex items-center gap-2 shrink-0 shadow-sm uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" /> Compliance Projection: Secure
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compliance Table of Frameworks */}
        <div className="lg:col-span-8 p-6 rounded border p-border p-bg-card space-y-4 shadow-sm">
          <span className="text-xs font-bold p-text-main uppercase tracking-widest block font-serif">
            Sovereign & Statutory Audit Registers
          </span>

          <div className="overflow-x-auto text-[11px] font-sans">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b p-border text-[9px] font-mono p-text-muted uppercase tracking-wider">
                  <th className="py-2.5">COMPLIANCE FRAMEWORK</th>
                  <th className="py-2.5 text-center">REGION</th>
                  <th className="py-2.5 text-center">READY RATE</th>
                  <th className="py-2.5 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y p-border">
                {dynamicCompliance.map((frame) => {
                  const isSelected = selectedComp?.id === frame.id;
                  const isPass = frame.status === "Pass";

                  return (
                    <tr
                      key={frame.id}
                      onClick={() => setSelectedCompId(frame.id)}
                      className={`hover:p-bg-secondary transition-all cursor-pointer duration-200 ${
                        isSelected 
                          ? "p-bg-accent-muted font-semibold p-text-accent p-border-active border-l-4" 
                          : ""
                      }`}
                    >
                      <td className="py-3.5 flex items-center gap-2 font-medium">
                        <FileCheck className={`w-4 h-4 ${isPass ? "p-text-success" : "p-text-warning"}`} />
                        <span className="p-text-main">{frame.name}</span>
                      </td>
                      <td className="py-3.5 text-center p-text-muted font-mono uppercase">{frame.region}</td>
                      <td className="py-3.5 text-center font-mono font-bold p-text-main">{frame.percentage}%</td>
                      <td className="py-3.5 text-center">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-wide ${
                          isPass 
                            ? "p-bg-success-muted p-text-success border-emerald-500/20" 
                            : "p-bg-warning-muted p-text-warning border-amber-500/20"
                        }`}>
                          {frame.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 p-bg-secondary rounded border p-border text-[10px] p-text-muted font-mono text-center shadow-inner">
            Click any statutory register above to load automated regulatory gap analyses and board compliance recommendations.
          </div>
        </div>

        {/* Selected Framework regulatory gap analysis reports */}
        <div className="lg:col-span-4 rounded border p-border p-bg-card p-6 space-y-6 shadow-sm">
          <div className="space-y-1.5 border-b p-border pb-4">
            <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest block font-bold">COMPLIANCE GAP MONITOR</span>
            <h3 className="text-lg font-serif font-bold p-text-main leading-tight">{selectedComp.name}</h3>
            <p className="text-xs p-text-muted">Jurisdiction: {selectedComp.region} Portal</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-sans mb-1">
                <span className="p-text-muted">Framework readiness score:</span>
                <span className="font-bold font-mono p-text-main">{selectedComp.percentage}%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full p-bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${selectedComp.percentage}%` }}
                />
              </div>
            </div>

            {/* Gap List */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono p-text-muted uppercase tracking-widest block font-bold">Detected Gaps ({selectedComp.gaps.length})</span>
              {selectedComp.gaps.length === 0 ? (
                <div className="p-3 p-bg-success-muted border p-success-border rounded p-text-success text-xs shadow-sm">
                  ✓ 100% Core compliance achieved. No outstanding structural parameter deviation detected.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedComp.gaps.map((gap, gIdx) => (
                    <div key={gIdx} className="p-3.5 p-bg-secondary border p-border rounded flex items-start gap-2 text-xs p-text-main shadow-inner">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold p-text-accent block uppercase text-[10px] tracking-tight">VULNERABILITY POINT GAPs</span>
                        <p className="text-[11px] p-text-muted leading-relaxed mt-0.5">{gap}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Compliance Action recommendations */}
            <div className="p-4 p-bg-secondary border p-border rounded-lg text-xs leading-relaxed p-text-muted shadow-sm">
              <span className="font-bold p-text-main block mb-1">Remediation Blueprint</span>
              Transition production modules to our *DecisionTwin Guardrailed Model* in the Comparison Lab to eliminate regulatory penalties.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
