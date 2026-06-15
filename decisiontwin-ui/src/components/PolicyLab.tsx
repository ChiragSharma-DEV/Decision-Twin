import { useState } from "react";
import { calculatePolicySimulation } from "../mockData";
import { SimulationResult } from "../types";
import { Sliders, Play, AlertCircle } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

export default function PolicyLab() {
  const simulation = useDecisionTwinStore((s) => s.simulation);
  const latestYear = simulation?.yearly_results?.[simulation.yearly_results.length - 1];
  const disparateImpact = latestYear?.metrics?.disparate_impact ?? 0.82;
  const overallRate = latestYear?.average_target_rate ?? 0.72;

  const [creditThreshold, setCreditThreshold] = useState(720);
  const [interestRate, setInterestRate] = useState(12);
  const [scholarshipCutoff, setScholarshipCutoff] = useState(85);
  const [hiringCriteria, setHiringCriteria] = useState(75);
  const [protectedFilter, setProtectedFilter] = useState(true);
  const [horizon, setHorizon] = useState<5 | 10 | 20>(10);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult>({
    approvalChange: Math.round((overallRate - 0.5) * 100),
    fairnessChange: Math.round((disparateImpact - 0.7) * 100),
    revenueChange: simulation?.business_impact ? Number((simulation.business_impact.financial_loss_amount / 100000).toFixed(1)) : 5.2,
    socialImpactChange: Math.round(disparateImpact * 30),
    regulatoryRiskChange: Math.round((1.0 - disparateImpact) * -50)
  });

  const runSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      const sim = calculatePolicySimulation(
        creditThreshold,
        interestRate,
        scholarshipCutoff,
        hiringCriteria,
        protectedFilter,
        horizon
      );
      
      const adjustedSim = {
        approvalChange: Math.round(sim.approvalChange * (overallRate / 0.72)),
        fairnessChange: Math.round(sim.fairnessChange * (1.1 - disparateImpact)),
        revenueChange: Number((sim.revenueChange * (simulation?.business_impact ? (simulation.business_impact.financial_loss_amount / 1500000) : 1)).toFixed(2)),
        socialImpactChange: Math.round(sim.socialImpactChange * (disparateImpact / 0.82)),
        regulatoryRiskChange: Math.round(sim.regulatoryRiskChange * ((1.05 - disparateImpact) / 0.2))
      };
      
      setResult(adjustedSim);
      setLoading(false);
    }, 1200);
  };

  const loadScenario = (type: "inclusive" | "conservative" | "unrestrained") => {
    if (type === "inclusive") {
      setCreditThreshold(620);
      setInterestRate(8);
      setScholarshipCutoff(65);
      setHiringCriteria(55);
      setProtectedFilter(true);
      setHorizon(10);
    } else if (type === "conservative") {
      setCreditThreshold(780);
      setInterestRate(18);
      setScholarshipCutoff(90);
      setHiringCriteria(85);
      setProtectedFilter(false);
      setHorizon(20);
    } else {
      setCreditThreshold(680);
      setInterestRate(14);
      setScholarshipCutoff(80);
      setHiringCriteria(70);
      setProtectedFilter(false);
      setHorizon(5);
    }
  };

  return (
    <div className="space-y-6" id="policy-lab-view">
      {/* Page Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">Algorithmic Restructuring Node</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Policy Lab</h2>
          <p className="text-xs p-text-muted mt-0.5">Calibrate core model thresholds, interest parameters, or cutoff brackets, generating instant long-term feedback forecasts.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => loadScenario("inclusive")}
            className="px-3 py-1.5 border p-border rounded text-[10px] font-mono font-bold uppercase transition-all hover:p-bg-secondary p-text-main cursor-pointer"
          >
            Scenario: Inclusion
          </button>
          <button
            onClick={() => loadScenario("conservative")}
            className="px-3 py-1.5 border p-border rounded text-[10px] font-mono font-bold uppercase transition-all hover:p-bg-secondary p-text-main cursor-pointer"
          >
            Scenario: High Yield
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Configuration */}
        <div className="lg:col-span-6 p-6 rounded border p-border p-bg-card space-y-5 shadow-sm">
          <h3 className="text-xs font-bold p-text-main uppercase tracking-widest font-serif flex items-center gap-2">
            <Sliders className="w-4 h-4 p-text-accent" />
            Simulation Multi-Parameters
          </h3>

          <div className="space-y-4">
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs p-text-main">Credit approval score threshold</span>
                <span className="text-xs font-bold p-text-accent font-mono">{creditThreshold}</span>
              </div>
              <input
                type="range"
                min="500"
                max="850"
                value={creditThreshold}
                onChange={(e) => setCreditThreshold(Number(e.target.value))}
                className="w-full mt-1.5 accent-amber-700 cursor-pointer"
              />
              <span className="text-[9px] p-text-muted font-mono mt-1 block">Higher blocks subprime, minimizing credit risks but worsening demographic disparity.</span>
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs p-text-main">Standard interest rate (%)</span>
                <span className="text-xs font-bold p-text-accent font-mono">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full mt-1.5 accent-amber-700 cursor-pointer"
              />
              <span className="text-[9px] p-text-muted font-mono mt-1 block">Higher rates generate immediate yields but compound bankruptcy feedback loops over time.</span>
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs p-text-main">Scholarship grant academic cutoff</span>
                <span className="text-xs font-bold p-text-accent font-mono">{scholarshipCutoff}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={scholarshipCutoff}
                onChange={(e) => setScholarshipCutoff(Number(e.target.value))}
                className="w-full mt-1.5 accent-amber-700 cursor-pointer"
              />
              <span className="text-[9px] p-text-muted font-mono mt-1 block">Strictness excludes rural tier-3 graduates without legacy credential proxies.</span>
            </div>

            {/* Slider 4 */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs p-text-main">ATS automated recruitment filter criteria</span>
                <span className="text-xs font-bold p-text-accent font-mono">{hiringCriteria}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={hiringCriteria}
                onChange={(e) => setHiringCriteria(Number(e.target.value))}
                className="w-full mt-1.5 accent-amber-700 cursor-pointer"
              />
              <span className="text-[9px] p-text-muted font-mono mt-1 block">Alumni mapping filters can compound systemic gaps.</span>
            </div>

            {/* Protected Filter Toggle */}
            <div className="p-3.5 p-bg-secondary rounded border p-border flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold p-text-main block">Protected Demographic Filter Guard</span>
                <span className="text-[10px] p-text-muted leading-tight">Neutralizes implicit identifiers automatically.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={protectedFilter}
                  onChange={() => setProtectedFilter(!protectedFilter)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-700"></div>
              </label>
            </div>

            {/* Horizon selection */}
            <div>
              <span className="text-xs p-text-muted font-mono uppercase tracking-wider block mb-1.5">Simulation time horizon:</span>
              <div className="grid grid-cols-3 p-1 p-bg-secondary rounded border p-border shadow-sm">
                {[5, 10, 20].map((h) => (
                  <button
                    key={h}
                    onClick={() => setHorizon(h as any)}
                    className={`py-1.5 text-xs font-mono font-bold rounded cursor-pointer transition-all ${
                      horizon === h 
                        ? "p-bg-accent text-white" 
                        : "p-text-muted hover:p-text-main"
                    }`}
                  >
                    {h} Years
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full py-2.5 p-bg-accent text-white hover:p-bg-accent-hover font-mono text-[11px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current text-white" />
            {loading ? "Recomputing Trajectories..." : "Commit Simulation Run"}
          </button>
        </div>

        {/* Dynamic Simulation Results Feed */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded border p-border p-bg-card space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b p-border pb-3">
              <span className="text-xs font-bold p-text-main uppercase tracking-widest font-serif">Compounded Horizon Deltas</span>
              <span className="text-[10px] p-text-accent font-mono">CONVERGED AT {horizon}Y</span>
            </div>

            {loading ? (
              <div className="h-44 flex flex-col items-center justify-center space-y-3">
                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 dark:border-neutral-800 border-t-amber-700 animate-spin" />
                <span className="text-xs font-mono p-text-muted">Processing stochastic differential equations...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Metric 1 */}
                  <div className="p-3.5 p-bg-secondary rounded border p-border">
                    <span className="text-[10px] p-text-muted font-mono block uppercase">Approval Shift</span>
                    <p className={`text-xl font-bold mt-1 ${result.approvalChange >= 0 ? "p-text-success" : "p-text-warning"}`}>
                      {result.approvalChange > 0 ? `+${result.approvalChange}` : result.approvalChange}%
                    </p>
                    <span className="text-[9px] p-text-muted">Regional demographics</span>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-3.5 p-bg-secondary rounded border p-border">
                    <span className="text-[10px] p-text-muted font-mono block uppercase">Fairness Shift</span>
                    <p className={`text-xl font-bold mt-1 ${result.fairnessChange >= 0 ? "p-text-success" : "p-text-warning"}`}>
                      {result.fairnessChange > 0 ? `+${result.fairnessChange}` : result.fairnessChange}%
                    </p>
                    <span className="text-[9px] p-text-muted">Demographic Parity index</span>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-3.5 p-bg-secondary rounded border p-border">
                    <span className="text-[10px] p-text-muted font-mono block uppercase">Yield Variation</span>
                    <p className={`text-xl font-bold mt-1 ${result.revenueChange >= 0 ? "p-text-success" : "p-text-warning"}`}>
                      {result.revenueChange >= 0 ? `+₹${result.revenueChange}` : `₹${result.revenueChange}`} Cr
                    </p>
                    <span className="text-[9px] p-text-muted">Simulated balance index</span>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-3.5 p-bg-secondary rounded border p-border">
                    <span className="text-[10px] p-text-muted font-mono block uppercase">Social Factor</span>
                    <p className={`text-xl font-bold mt-1 ${result.socialImpactChange >= 0 ? "p-text-success" : "p-text-warning"}`}>
                      {result.socialImpactChange > 0 ? `+${result.socialImpactChange}` : result.socialImpactChange}%
                    </p>
                    <span className="text-[9px] p-text-muted">Community inclusion ratio</span>
                  </div>
                </div>

                <div className="p-4 rounded border p-border p-bg-secondary flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] font-mono p-text-muted block uppercase">REGULATORY RISK PROTECTION</span>
                    <span className="text-sm font-bold p-text-warning">{result.regulatoryRiskChange}% Risk Reduction</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded border ${
                    result.regulatoryRiskChange > 0 
                      ? "p-bg-warning-muted p-text-warning" 
                      : "p-bg-success-muted p-text-success"
                  }`}>
                    {result.regulatoryRiskChange > 0 ? "⚠️ MONITOR" : "✓ CALIBRATED"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded border p-border p-bg-card text-xs p-text-muted flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 p-text-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              When <span className="p-text-main font-semibold">Protected Demographic Filter Guard</span> is enabled, proxy weights for zip-code coordinates decline sharply, lifting fairness metrics. Cumulative revenue climbs symmetrically, proving that ethical governance and yields align over a {horizon}-year horizon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
