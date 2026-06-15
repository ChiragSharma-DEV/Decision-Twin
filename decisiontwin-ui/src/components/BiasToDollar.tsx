import { AlertOctagon, Landmark } from "lucide-react";

export default function BiasToDollar() {
  const GENDER_BIAS_METRICS = [
    { label: "Potential revenue loss", value: "₹5.2 Crores", sub: "Annualized Leakage", isBad: true },
    { label: "Regulatory risk penalty", value: "High Exposure", sub: "RBI Sec 4.2 Violated", isBad: true },
    { label: "Brand Damage Index", value: "Severe Risk", sub: "Social Sentiment -32%", isBad: true },
    { label: "Customer Churn Spike", value: "12%", sub: "+4.2% over Baseline", isBad: true },
    { label: "Excluded Candidates", value: "42k Citizens", sub: "Blocked from Rating", isBad: false },
    { label: "Litigation Settlement", value: "₹2.5 Cr Est.", sub: "Class-action threshold", isBad: true }
  ];

  return (
    <div className="space-y-6" id="bias-to-dollar-view">
      {/* Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">BALANCE SHEET RISK INDEX</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Bias to Dollar Translator</h2>
          <p className="text-xs p-text-muted mt-0.5">Quantify ethical algorithmic drifts directly into corporate profit indices, compliance costs, and brand equity metrics.</p>
        </div>
        <div className="p-bg-warning-muted border border-red-500/20 p-text-warning px-3.5 py-1.5 text-[10px] font-bold font-mono rounded flex items-center gap-2 shrink-0 shadow-sm uppercase tracking-wider">
          <AlertOctagon className="w-4 h-4 text-red-500" /> RISK TRIGGERED
        </div>
      </div>

      {/* Corporate Ledger Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {GENDER_BIAS_METRICS.map((col, idx) => (
          <div key={idx} className="p-4 rounded border p-border p-bg-card space-y-1.5 hover:p-border-active transition-all duration-300 shadow-sm relative overflow-hidden">
            <span className="text-[9px] font-mono p-text-muted block uppercase tracking-wider">{col.label}</span>
            <p className={`text-xl font-light font-mono ${col.isBad ? "p-text-warning" : "p-text-main"}`}>{col.value}</p>
            <span className="text-[8px] font-mono p-text-muted block">{col.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cost of Bias Projection table */}
        <div className="p-6 rounded border p-border p-bg-card space-y-4 shadow-sm">
          <span className="text-xs font-bold p-text-main uppercase tracking-widest block font-serif">
            Annual Balance Sheet Leakage Trajectory (10-Year projection)
          </span>

          <div className="overflow-x-auto text-[11px] font-sans">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b p-border text-[9px] font-mono p-text-muted uppercase tracking-wider">
                  <th className="py-2.5">YEAR</th>
                  <th className="py-2.5 text-right">BIAS-NEGLECTED LOSS</th>
                  <th className="py-2.5 text-right">BIAS-MITIGATED YIELD</th>
                  <th className="py-2.5 text-right">NET RETURN (₹ CRORES)</th>
                </tr>
              </thead>
              <tbody className="divide-y p-border">
                {[
                  { year: "2026", unmitigated: "₹5.2 Cr", mitigated: "₹1.2 Cr", return: "+4.00" },
                  { year: "2027", unmitigated: "₹6.8 Cr", mitigated: "₹1.0 Cr", return: "+5.80" },
                  { year: "2028", unmitigated: "₹8.4 Cr", mitigated: "₹0.9 Cr", return: "+7.50" },
                  { year: "2029", unmitigated: "₹11.2 Cr", mitigated: "₹0.7 Cr", return: "+10.50" },
                  { year: "2030", unmitigated: "₹14.5 Cr", mitigated: "₹0.5 Cr", return: "+14.00" },
                  { year: "2035", unmitigated: "₹28.9 Cr", mitigated: "₹0.1 Cr", return: "+28.80" }
                ].map((item, idx) => (
                  <tr key={idx} className="hover:p-bg-secondary transition-colors duration-200">
                    <td className="py-3 font-mono font-bold p-text-muted">{item.year}</td>
                    <td className="py-3 text-right font-mono text-red-500">{item.unmitigated}</td>
                    <td className="py-3 text-right font-mono text-emerald-650">{item.mitigated}</td>
                    <td className="py-3 text-right font-mono font-bold p-text-main">{item.return} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[9px] p-text-muted leading-relaxed italic border-t p-border pt-4">
            *Losses are simulated using compounding demographic feedback multipliers, regulatory fine structures under NITI Aayog Responsible AI standards, and brand valuation metrics.
          </p>
        </div>

        {/* Visual Bloomberg-style chart */}
        <div className="p-6 rounded border p-border p-bg-card flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold p-text-main uppercase tracking-widest font-serif">Stated Enterprise Yield Comparison</span>
              <span className="text-[9px] font-mono p-text-accent font-bold">RECONCILIATION LEDGER</span>
            </div>
            <p className="text-xs p-text-muted">Visualizing 10-Year cumulative risk delta in corporate metrics.</p>
          </div>

          <div className="h-44 flex items-end justify-between gap-5 px-4 pt-4 border-b p-border relative overflow-hidden">
            {/* Visual Guide Grid Bars */}
            <div className="absolute inset-x-0 bottom-1/4 border-b p-border text-[8px] font-mono p-text-muted">₹10 Cr level</div>
            <div className="absolute inset-x-0 bottom-2/4 border-b p-border text-[8px] font-mono p-text-muted">₹20 Cr level</div>
            <div className="absolute inset-x-0 bottom-3/4 border-b p-border text-[8px] font-mono p-text-muted">₹30 Cr level</div>

            {/* Simulated bar pairs */}
            <div className="flex-1 flex flex-col items-center h-full justify-end z-10">
              <div className="flex gap-2.5 items-end justify-center w-full h-2/3">
                <div className="w-4 bg-red-400 hover:opacity-85 h-3/4 rounded-t-sm transition-all" title="Unmitigated cost" />
                <div className="w-4 p-bg-accent hover:opacity-85 h-1/4 rounded-t-sm transition-all" title="Mitigated cost" />
              </div>
              <span className="text-[9px] font-mono p-text-muted mt-2">2026</span>
            </div>

            <div className="flex-1 flex flex-col items-center h-full justify-end z-10">
              <div className="flex gap-2.5 items-end justify-center w-full h-2/3">
                <div className="w-4 bg-red-500 hover:opacity-85 h-4/5 rounded-t-sm transition-all" title="Unmitigated cost" />
                <div className="w-4 p-bg-accent hover:opacity-85 h-[20%] rounded-t-sm transition-all" title="Mitigated cost" />
              </div>
              <span className="text-[9px] font-mono p-text-muted mt-2">2028</span>
            </div>

            <div className="flex-1 flex flex-col items-center h-full justify-end z-10">
              <div className="flex gap-2.5 items-end justify-center w-full h-2/3">
                <div className="w-4 bg-red-500 hover:opacity-85 h-[95%] rounded-t-sm transition-all" title="Unmitigated cost" />
                <div className="w-4 p-bg-accent hover:opacity-85 h-[15%] rounded-t-sm transition-all" title="Mitigated cost" />
              </div>
              <span className="text-[9px] font-mono p-text-muted mt-2">2030</span>
            </div>

            <div className="flex-1 flex flex-col items-center h-full justify-end z-10">
              <div className="flex gap-2.5 items-end justify-center w-full h-2/3">
                <div className="w-4 bg-red-500 hover:opacity-85 h-full rounded-t-sm transition-all" title="Unmitigated cost" />
                <div className="w-4 p-bg-accent hover:opacity-85 h-[10%] rounded-t-sm transition-all" title="Mitigated cost" />
              </div>
              <span className="text-[9px] font-mono p-text-muted mt-2">2035</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono p-text-muted pt-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm" /> Bias-neglected Leakage</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 var(--accent-gold) h-2.5 p-bg-accent rounded-sm" /> Mitigated Yield</span>
          </div>
        </div>
      </div>
    </div>
  );
}
