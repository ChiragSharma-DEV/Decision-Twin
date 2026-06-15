import { useEffect, useMemo, useState } from "react";
import { Shield, TrendingUp, AlertCircle, Users, Landmark, Percent, Ban, Calendar, ArrowUpRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from "recharts";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";
import {
  getAvailableTimelineYears,
  getMetricsForCalendarYear,
  mapSimulationToDashboardKpis,
  simulationYearToCalendarYear,
} from "../services/mappers";

interface DashboardViewProps {
  onCopilotMsg?: (msg: string) => void;
  selectedDomain: string;
}

export default function DashboardView({ onCopilotMsg, selectedDomain }: DashboardViewProps) {
  const { session, simulation, loading, error } = useDecisionTwinStore();
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const timelineYears = useMemo(
    () => getAvailableTimelineYears(simulation),
    [simulation]
  );

  useEffect(() => {
    if (timelineYears.length && !timelineYears.includes(selectedYear)) {
      setSelectedYear(timelineYears[0]);
    }
  }, [timelineYears, selectedYear]);

  const currentMetrics = useMemo(() => {
    const metrics = getMetricsForCalendarYear(simulation, selectedYear);
    if (metrics) return metrics;
    return {
      fairness: 0,
      riskAccumulation: 0,
      approvalRate: 0,
      disparityEvolution: 0,
      feedbackScore: 0,
    };
  }, [simulation, selectedYear]);

  const kpis = useMemo(
    () => mapSimulationToDashboardKpis(simulation, session),
    [simulation, session]
  );

  const chartData = useMemo(() => {
    if (!simulation?.yearly_results) return [];
    return simulation.yearly_results.map((r) => ({
      year: simulationYearToCalendarYear(r.year),
      fairness: Math.round(Math.max(0, Math.min(100, r.metrics.demographic_parity_ratio * 100))),
      approvalRate: Math.round(Math.max(0, Math.min(100, r.average_target_rate * 100))),
      disparityEvolution: Math.round(Math.max(0, Math.min(100, Math.abs(r.metrics.demographic_parity_diff) * 100))),
    }));
  }, [simulation]);

  const isSimulatorLinked = Boolean(simulation && session?.has_data);

  const domainLabels: Record<string, string> = {
    all: "Consolidated Digital Audit",
    credit: "RBI Micro-Lending Model",
    education: "Academic Scholarship Allocations",
    employment: "Enterprise Recruitment Engine",
    hr: "Social Welfare & Grants"
  };

  return (
    <div className="space-y-6" id="dashboard-view-main">
      {/* Title & Domain Context Banner */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,var(--accent-gold-muted),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">PREDICTIVE CONTEXT PORTFOLIO</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">{domainLabels[selectedDomain] || "Consolidated Portfolio"}</h2>
          <p className="text-xs p-text-muted mt-0.5 max-w-xl leading-relaxed">
            Continuous 10-Year simulation based on current algorithmic weights, applicant geographical distributions, and policy criteria.
          </p>
        </div>
        <div className="flex items-center gap-2 p-bg-secondary px-3 py-1.5 rounded border p-border text-[10px] font-mono shadow-sm">
          <span className={`w-2 h-2 rounded-full ${isSimulatorLinked ? "p-bg-accent animate-pulse" : "bg-neutral-400"}`} />
          <span className="p-text-main tracking-wider font-semibold">
            {loading.simulation ? "SYNCING SIMULATOR" : isSimulatorLinked ? "SIMULATOR LINKED" : "SIMULATOR STANDBY"}
          </span>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded border p-border p-bg-card relative overflow-hidden group hover:p-border-active hover:shadow-md transition-all duration-300">
          <div className="absolute bottom-0 left-0 w-full h-0.5 p-bg-accent opacity-30" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider">Gov Score</span>
            <Shield className="w-3.5 h-3.5 p-text-accent" />
          </div>
          <p className="text-3xl font-light font-mono p-text-main mt-2 tracking-tighter">{kpis.govScore}<span className="text-xs p-text-muted">/100</span></p>
          <span className="text-[9px] font-mono p-text-success p-bg-success-muted px-1.5 py-0.5 rounded inline-block mt-2">
            {kpis.govSubtitle}
          </span>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded border p-border p-bg-card relative overflow-hidden group hover:p-border-active hover:shadow-md transition-all duration-300">
          <div className="absolute bottom-0 left-0 w-full h-0.5 p-bg-accent opacity-30" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider">Compliance</span>
            <Percent className="w-3.5 h-3.5 p-text-accent" />
          </div>
          <p className="text-3xl font-light font-mono p-text-main mt-2 tracking-tighter">{kpis.compliancePct}%</p>
          <span className="text-[9px] font-mono p-text-success p-bg-success-muted px-1.5 py-0.5 rounded inline-block mt-2">
            {kpis.complianceSubtitle}
          </span>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded border p-border p-bg-card relative overflow-hidden group hover:p-border-active hover:shadow-md transition-all duration-300">
          <div className="absolute bottom-0 left-0 w-full h-0.5 p-bg-accent opacity-30" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider">Fairness</span>
            <TrendingUp className="w-3.5 h-3.5 p-text-accent" />
          </div>
          <p className="text-3xl font-light font-mono p-text-main mt-2 tracking-tighter">{kpis.fairnessPct}%</p>
          <span className="text-[9px] font-mono p-text-warning p-bg-warning-muted px-1.5 py-0.5 rounded inline-block mt-2">
            {kpis.fairnessSubtitle}
          </span>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded border p-border p-bg-card relative overflow-hidden group hover:p-border-active hover:shadow-md transition-all duration-300">
          <div className="absolute bottom-0 left-0 w-full h-0.5 p-bg-accent opacity-30" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider">Revenue Saved</span>
            <Landmark className="w-3.5 h-3.5 p-text-accent" />
          </div>
          <p className="text-xl font-medium font-sans p-text-main mt-3 tracking-tight">{kpis.revenueDisplay}</p>
          <span className="text-[9px] font-mono p-text-success p-bg-success-muted px-1.5 py-0.5 rounded inline-block mt-2">
            {kpis.revenueSubtitle}
          </span>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded border p-border p-bg-card relative overflow-hidden group hover:p-border-active hover:shadow-md transition-all duration-300">
          <div className="absolute bottom-0 left-0 w-full h-0.5 p-bg-accent opacity-30" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider">Cohort Size</span>
            <Users className="w-3.5 h-3.5 p-text-accent" />
          </div>
          <p className="text-3xl font-light font-mono p-text-main mt-2 tracking-tighter">{kpis.cohortDisplay}</p>
          <span className="text-[9px] font-mono p-text-muted mt-2 block">
            Active telemetry
          </span>
        </div>

        {/* Card 6 */}
        <div className="p-4 rounded border p-border p-bg-card relative overflow-hidden group hover:p-border-active hover:shadow-md transition-all duration-300">
          <div className="absolute bottom-0 left-0 w-full h-0.5 p-bg-accent opacity-30" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider">Projected Fine</span>
            <Ban className="w-3.5 h-3.5 p-text-accent" />
          </div>
          <p className="text-3xl font-light font-mono p-text-main mt-2 tracking-tighter">{kpis.projectedFineDisplay}</p>
          <span className="text-[9px] font-mono p-text-success p-bg-success-muted px-1.5 py-0.5 rounded inline-block mt-2">
            {kpis.fineSubtitle}
          </span>
        </div>
      </div>

      {/* CENTERPIECE: 10-Year AI Impact Simulation Timeline */}
      <div className="p-6 rounded border p-border p-bg-card space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,var(--accent-gold-muted),transparent_50%)] pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 relative z-10">
          <div>
            <h3 className="text-lg font-serif font-bold p-text-main flex items-center gap-2">
              <Calendar className="w-4 h-4 p-text-accent" />
              10-Year AI Impact Simulation Sandbox
            </h3>
            <p className="text-xs p-text-muted mt-0.5">Select simulated timeline horizons to witness automated risk drift and compounding systemic feedback loops.</p>
          </div>
          <div className="text-[10px] font-mono p-text-accent p-bg-accent-muted border p-border py-1 px-3 rounded font-bold uppercase tracking-wider">
            Horizon Map Connected
          </div>
        </div>

        {/* Timeline Slider as a premium tactile scale */}
        <div className="p-1.5 p-bg-secondary rounded border p-border flex items-center justify-between overflow-x-auto gap-2 shadow-sm">
          {timelineYears.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`py-2 px-4 text-xs font-mono font-semibold rounded cursor-pointer transition-all duration-200 shrink-0 ${
                  isSelected
                    ? "p-bg-accent text-white shadow-sm"
                    : "p-text-muted hover:p-text-main hover:bg-white/5"
                }`}
              >
                {year}
                {year === 2026 && <span className="block text-[8px] opacity-70 font-bold uppercase mt-0.5">CURRENT</span>}
              </button>
            );
          })}
        </div>

        {/* Simulation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Custom Luxury Metrics Visualization */}
          <div className="p-5 rounded border p-border p-bg-secondary/40 space-y-4">
            <span className="text-[10px] uppercase tracking-widest font-mono p-text-accent font-bold">Projections for Year {selectedYear}</span>
            <div className="grid grid-cols-2 gap-4">
              {/* Metric 1 */}
              <div className="p-4 p-bg-card rounded border p-border hover:shadow-sm transition-all">
                <span className="text-[10px] p-text-muted font-mono block uppercase tracking-tight">Fairness Trajectory</span>
                <p className="text-2xl font-light font-mono p-text-main mt-1">{currentMetrics.fairness}%</p>
                {/* Thin premium horizontal line meter */}
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="p-bg-accent h-full transition-all duration-700" style={{ width: `${currentMetrics.fairness}%` }} />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-4 p-bg-card rounded border p-border hover:shadow-sm transition-all">
                <span className="text-[10px] p-text-muted font-mono block uppercase tracking-tight">Approval Forecast</span>
                <p className="text-2xl font-light font-mono p-text-main mt-1">{currentMetrics.approvalRate}%</p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="p-bg-accent h-full transition-all duration-700" style={{ width: `${currentMetrics.approvalRate}%` }} />
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-4 p-bg-card rounded border p-border hover:shadow-sm transition-all">
                <span className="text-[10px] p-text-muted font-mono block uppercase tracking-tight">Disparity Evolution</span>
                <p className="text-2xl font-light font-mono p-text-main mt-1">{currentMetrics.disparityEvolution}%</p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="p-bg-accent h-full transition-all duration-700" style={{ width: `${currentMetrics.disparityEvolution}%` }} />
                </div>
              </div>

              {/* Metric 4 */}
              <div className="p-4 p-bg-card rounded border p-border hover:shadow-sm transition-all">
                <span className="text-[10px] p-text-muted font-mono block uppercase tracking-tight">Risk Drift Accumulation</span>
                <p className="text-2xl font-light font-mono p-text-main mt-1">{currentMetrics.riskAccumulation}%</p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="p-bg-accent h-full transition-all duration-700" style={{ width: `${currentMetrics.riskAccumulation}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3.5 p-bg-warning-muted rounded border p-border flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 p-text-warning shrink-0 mt-0.5" />
              <p className="text-[11px] p-text-main font-sans leading-relaxed">
                {selectedYear > 2028 ? (
                  <span className="font-extrabold p-text-warning">⚠️ SYSTEM RISK DRIFT DETECTED: </span>
                ) : (
                  <span className="font-extrabold p-text-success">✓ CALIBRATED RANGE: </span>
                )}
                {simulation?.gemma_critique || `Feedback loops over the 10-year timeline amplify proxy indexes. Rural disparity and demographic approval profiles represent vulnerabilities by ${selectedYear}. Open the **Policy Lab** to enforce real-time regulatory guardrails.`}
                {error ? ` API: ${error}` : ""}
              </p>
            </div>
          </div>

          {/* Premium Spatial Correlation Network Representation (Bespoke Artwork) */}
          <div className="p-5 rounded border p-border p-bg-secondary/40 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase tracking-widest font-mono p-text-accent font-bold">Longitudinal Trajectory</span>
              <span className="text-[9px] font-mono p-text-muted uppercase">Recharts Rendering</span>
            </div>

            <div className="h-64 w-full rounded p-bg-card border p-border relative overflow-hidden flex items-center justify-center p-4 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--color-text-main)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="approvalRate" name={`${session?.target_outcome || 'Approval'} Rate`} fill="var(--color-accent-gold-muted)" barSize={20} radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="fairness" name="Fairness Ratio" stroke="var(--color-accent-gold)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="disparityEvolution" name="Disparity Evolution" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] p-text-muted mt-3 pt-2.5 border-t p-border">
              <span>Stochastic weights index tracking:</span>
              <button
                onClick={() => onCopilotMsg ? onCopilotMsg(`Predict ${selectedYear} outcomes`) : null}
                className="text-xs p-text-accent hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                Perform Gemini Deep Audit
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
