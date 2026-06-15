import { useState } from "react";
import { INITIAL_MAP_REGIONS } from "../mockData";
import { MapRegion } from "../types";
import { Map, Flame } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

export default function GovernanceMap() {
  const simulation = useDecisionTwinStore((s) => s.simulation);
  const latestYear = simulation?.yearly_results?.[simulation.yearly_results.length - 1];
  const overallRate = latestYear?.average_target_rate ?? 0.72;
  const disparateImpact = latestYear?.metrics?.disparate_impact ?? 0.82;

  const dynamicRegions = INITIAL_MAP_REGIONS.map((reg) => {
    // scale approval rate relative to the overall simulation rate
    const baseRate = reg.id === "map-north" ? 0.84 : (reg.id === "map-west" ? 0.72 : (reg.id === "map-south" ? 0.62 : 0.52));
    const scaledRate = Math.round(overallRate * 100 * (baseRate / 0.72));
    const approvalRate = Math.max(10, Math.min(100, scaledRate));
    
    // determine biasHotspot label and risk score relative to disparate impact
    let biasHotspot: "Low" | "Moderate" | "High" | "Critical" = "Low";
    let riskClusterScore = reg.riskClusterScore;
    if (disparateImpact < 0.65) {
      biasHotspot = reg.id === "map-south" ? "Critical" : (reg.id === "map-east" ? "High" : "Moderate");
      riskClusterScore = Math.max(5, Math.round((1.0 - disparateImpact) * 100 * (reg.riskClusterScore / 42)));
    } else if (disparateImpact < 0.8) {
      biasHotspot = reg.id === "map-south" ? "High" : "Moderate";
      riskClusterScore = Math.max(5, Math.round((1.0 - disparateImpact) * 100 * (reg.riskClusterScore / 42)));
    } else {
      biasHotspot = reg.id === "map-north" ? "Low" : "Moderate";
      riskClusterScore = Math.max(5, Math.round((1.0 - disparateImpact) * 100));
    }
    
    return {
      ...reg,
      approvalRate,
      biasHotspot,
      riskClusterScore
    };
  });

  const [selectedRegionId, setSelectedRegionId] = useState<string>(dynamicRegions[2]?.id || "");
  const selectedRegion = dynamicRegions.find(r => r.id === selectedRegionId) || dynamicRegions[2];

  return (
    <div className="space-y-6" id="governance-map-view">
      {/* Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">Geographic Inequality Hotspots</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Real-Time Governance Map</h2>
          <p className="text-xs p-text-muted mt-0.5">Review geographic bias clusters, regional loan approvals, and social disparity ratios across sovereign territories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Geographic Canvas View Column */}
        <div className="lg:col-span-7 p-6 rounded border p-border p-bg-card relative flex flex-col justify-between overflow-hidden min-h-[440px] shadow-sm">
          <div className="absolute top-4 left-4 z-10 space-y-1">
            <span className="text-[9px] p-text-accent font-mono tracking-widest block uppercase font-bold">SOVEREIGN SANDBOX GEOMETRY</span>
            <span className="text-[11px] p-text-muted">Select a vector node region to inspect local metrics.</span>
          </div>

          {/* Stylized Vector Map representing main India geo zones */}
          <div className="flex-grow flex items-center justify-center py-6 relative">
            <svg 
              className="w-full max-w-[340px] h-[300px] filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)]" 
              viewBox="0 0 400 480"
              id="india-zone-svg"
            >
              <path 
                d="M170,40 L190,20 L210,15 L230,25 L215,60 L240,80 L230,110 L280,115 L320,130 L380,140 L380,180 L340,190 L300,185 L280,210 L240,220 L210,250 L200,320 L180,360 L160,430 L150,460 L140,430 L110,320 L100,290 L60,260 L40,240 L50,190 L80,165 L110,140 Z"
                fill="none"
                stroke="currentColor"
                className="p-text-muted"
                strokeWidth="1.5"
                strokeDasharray="4"
              />

              {dynamicRegions.map((reg) => {
                const isSelected = selectedRegion?.id === reg.id;
                let zoneColor = "rgba(66, 133, 244, 0.45)"; 
                let strokeColor = "#4285F4";
                if (reg.biasHotspot === "Critical") {
                  zoneColor = "rgba(234, 67, 53, 0.5)";
                  strokeColor = "#EA4335";
                } else if (reg.biasHotspot === "High") {
                  zoneColor = "rgba(251, 188, 5, 0.45)";
                  strokeColor = "#FBBC05";
                } else if (reg.biasHotspot === "Moderate") {
                  zoneColor = "rgba(124, 58, 237, 0.45)";
                  strokeColor = "#7c3aed";
                }

                return (
                  <g 
                    key={reg.id} 
                    onClick={() => setSelectedRegionId(reg.id)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    <circle 
                      cx={reg.coordinates[0]} 
                      cy={reg.coordinates[1]} 
                      r={isSelected ? 28 : 22} 
                      fill={zoneColor}
                      stroke={isSelected ? "currentColor" : strokeColor}
                      className="p-text-main"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <circle 
                      cx={reg.coordinates[0]} 
                      cy={reg.coordinates[1]} 
                      r={4} 
                      fill="#FFF"
                    />
                    <text 
                      x={reg.coordinates[0] - 15} 
                      y={reg.coordinates[1] + 32} 
                      fill="currentColor" 
                      fontSize="9"
                      fontFamily="Inter, sans-serif"
                      className={`font-semibold pointer-events-none ${isSelected ? "p-text-accent font-bold" : "p-text-muted"}`}
                    >
                      {reg.stateName.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[9px] p-text-muted font-mono mt-2 pt-2 border-t p-border">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Low Disparity</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-violet-500" /> Moderate Drift</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-yellow-500" /> High Risk</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 animate-pulse" /> Critical Hotspot</span>
          </div>
        </div>

        {/* Region Telemetry Inspector Sideboard */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded border p-border p-bg-card space-y-6 shadow-sm">
            {selectedRegion ? (
              <>
                <div className="border-b p-border pb-4 space-y-1">
                  <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest block font-bold">REGIONAL TELEMETRY DECODER</span>
                  <h3 className="text-xl font-serif font-bold p-text-main leading-tight">{selectedRegion.stateName}</h3>
                  <p className="text-xs p-text-muted">Total regional citizens tracked: <span className="font-mono p-text-main text-xs font-bold">{selectedRegion.impactedCount.toLocaleString()}</span></p>
                </div>

                <div className="space-y-4">
                  {/* Metric Row 1 */}
                  <div className="p-3.5 p-bg-secondary rounded border p-border flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider block">Model approval rate</span>
                      <span className="text-lg font-bold p-text-main font-mono">{selectedRegion.approvalRate}%</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-1 rounded p-bg-card p-border p-text-accent font-bold uppercase">Standard Rate</span>
                  </div>

                  {/* Metric Row 2 */}
                  <div className="p-3.5 p-bg-secondary rounded border p-border flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider block">Bias severity scale</span>
                      <span className={`text-sm font-bold uppercase ${
                        selectedRegion.biasHotspot === "Critical" 
                          ? "p-text-warning" 
                          : selectedRegion.biasHotspot === "High"
                          ? "p-text-warning"
                          : "p-text-success"
                      }`}>{selectedRegion.biasHotspot}</span>
                    </div>
                    {selectedRegion.biasHotspot === "Critical" && (
                      <Flame className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                  </div>

                  {/* Metric Row 3 */}
                  <div className="p-3.5 p-bg-secondary rounded border p-border flex justify-between items-center font-sans">
                    <div>
                      <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider block">Risk cluster index</span>
                      <span className="text-lg font-bold p-text-main font-mono">{selectedRegion.riskClusterScore}%</span>
                    </div>
                    <span className="text-[10px] p-text-muted">Density threshold</span>
                  </div>

                  {/* Future projection warnings */}
                  <div className="p-4 rounded border p-border p-bg-secondary text-xs p-text-muted space-y-1 shadow-sm">
                    <span className="font-bold p-text-main block">Stochastic 10-Year Warning</span>
                    <p className="leading-relaxed text-[11px]">
                      {selectedRegion.biasHotspot === "Critical" || selectedRegion.biasHotspot === "High" ? (
                        "Feedback loops over zip-index vectors represent high volatility. Approval parity will drop an additional 14% unless protected filters are active."
                      ) : (
                        "General parity thresholds remain safe. Continue weekly monitoring."
                      )}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center p-text-muted text-xs font-sans">
                Select any regional coordinate hot pin on the map viewport to load active micro-borrower metrics.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
