import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BoardroomPresentation() {
  const [activeSlide, setActiveSlide] = useState(0);

  const SLIDES = [
    {
      title: "Governance Score Ledger",
      pillar: "01 / PILLAR ONE",
      value: "95 / 100",
      rating: "GRADE A - HIGH EXCELLENCE",
      desc: "Robust algorithmic controls certified against ISO 42001 stand as our de-facto model score. Auditable checkpoints minimize downstream parameters drift to nominal parameters thresholds.",
      accent: "border-l-4 border-amber-600"
    },
    {
      title: "Demographic Fairness Score",
      pillar: "02 / PILLAR TWO",
      value: "92%",
      rating: "STOCHASTIC EQUAL OPPORTUNITY",
      desc: "By decoupling demographic proxies (including localized zip-indices and household density indices), the core sandboxes maintain high approval parity across male/female applicants.",
      accent: "border-l-4 border-amber-600"
    },
    {
      title: "Systemic Risk Index Score",
      pillar: "03 / PILLAR THREE",
      value: "Minimal",
      rating: "RBI DEFENSIVE SAFE-GUARDED",
      desc: "Risk accumulation factors are fully neutralized over our interactive 10-year forecasts. Real-time feedback monitoring shields organizational models from compounding class penalties.",
      accent: "border-l-4 border-amber-600"
    },
    {
      title: "Cumulative Financial Impact",
      pillar: "04 / PILLAR FOUR",
      value: "₹5.4 Crores",
      rating: "ANNUAL SAVINGS DEMO COHORT",
      desc: "Translating ethical AI into profit indices: by resolving predictive customer churn trends and completely eliminating litigation penalties, net interest margins improve safely.",
      accent: "border-l-4 border-amber-600"
    },
    {
      title: "Statutory Compliance Status",
      pillar: "05 / PILLAR FIVE",
      value: "100%",
      rating: "PASS PROJECTED EXTREME COMPLIANT",
      desc: "Certified transparency across RBI guidelines, EU AI Act Sandboxes, and DPDP frameworks. Explicit audit trail export systems can satisfy global sovereign inspectors instantly.",
      accent: "border-l-4 border-amber-600"
    }
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const current = SLIDES[activeSlide];

  return (
    <div className="space-y-6" id="boardroom-presentation-view">
      {/* Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">Investor & Boardroom Presentation</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Boardroom Presentation Mode</h2>
          <p className="text-xs p-text-muted mt-0.5">Pruned 5-slide regulatory report designed for Chief Officers, Regulators, and Board Directors.</p>
        </div>
      </div>

      {/* Main slide projector viewport */}
      <div className="min-h-[380px] rounded border p-border p-bg-card p-10 flex flex-col justify-between relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,var(--accent-gold-muted),transparent_50%)] pointer-events-none opacity-40" />

        {/* Current slide indicators */}
        <div className="flex justify-between items-center text-[10px] font-mono mb-6">
          <span className="p-text-accent font-bold tracking-wider">{current.pillar}</span>
          <span className="p-text-muted">BOARDROOM PRESENTATION SCREEN</span>
        </div>

        {/* Slide contents */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${current.accent} pl-6 py-2`}>
          <div className="md:col-span-8 space-y-3.5 text-left">
            <h3 className="text-2xl md:text-3.5xl font-serif font-bold p-text-main leading-tight">{current.title}</h3>
            <span className="inline-block text-[10px] font-mono font-bold tracking-wider p-text-accent uppercase">{current.rating}</span>
            <p className="text-xs p-text-muted leading-relaxed max-w-xl font-sans">
              {current.desc}
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 p-bg-secondary border p-border rounded text-center shadow-inner">
            <span className="text-3xl md:text-5xl font-light p-text-main font-mono select-none tracking-tight">{current.value}</span>
            <span className="text-[8px] p-text-muted font-mono block mt-1.5 uppercase font-semibold">Verified Convergence</span>
          </div>
        </div>

        {/* Slides Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-4 border-t p-border text-[10px] font-mono">
          {/* Dot indicators */}
          <div className="flex gap-2.5">
            {SLIDES.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveSlide(dotIdx)}
                className={`w-3 h-1.5 rounded-full cursor-pointer transition-all ${
                  activeSlide === dotIdx ? "p-bg-accent w-6" : "bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="px-3.5 py-1.5 p-bg-secondary border p-border hover:p-border-active p-text-main rounded text-[11px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 p-bg-accent text-white hover:p-bg-accent-hover rounded text-[11px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
