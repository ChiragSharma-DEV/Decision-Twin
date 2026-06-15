import { useState } from "react";
import { Shield } from "lucide-react";

interface LoginPortalProps {
  onLoginSuccess: () => void;
}

export default function LoginPortal({ onLoginSuccess }: LoginPortalProps) {
  const [activeTab, setActiveTab] = useState<"enterprise" | "gov">("enterprise");
  const [theme, setTheme] = useState<"cream" | "mono">("cream");

  return (
    <div className={`min-h-screen p-bg-main p-text-main flex flex-col justify-between overflow-x-hidden relative transition-colors duration-500 ${theme === "cream" ? "theme-cream" : "theme-mono"}`} id="login-portal">
      {/* Absolute classic background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_top_right,var(--accent-gold-muted),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.01),transparent_40%)] pointer-events-none" />

      {/* Header */}
      <header className="border-b p-border p-bg-card backdrop-blur-md px-6 py-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border p-border flex items-center justify-center p-bg-secondary shadow-sm">
            <Shield className="w-4 h-4 p-text-accent" />
          </div>
          <div>
            <span className="text-base tracking-widest font-serif block leading-none font-bold uppercase">
              Decision<span className="p-text-accent">Twin</span>
            </span>
            <span className="text-[8px] font-mono tracking-widest uppercase opacity-70 block mt-1">EST. 2026 • EXECUTIVE ETHICS SANDBOX</span>
          </div>
        </div>
        
        {/* Theme Switcher */}
        <div className="flex p-0.5 rounded border p-border p-bg-secondary select-none shadow-sm">
          <button
            onClick={() => setTheme("cream")}
            className={`px-3 py-1 text-[9px] font-mono font-bold rounded tracking-tight transition-all cursor-pointer ${
              theme === "cream"
                ? "p-bg-accent text-white shadow-sm"
                : "p-text-muted hover:p-text-main"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("mono")}
            className={`px-3 py-1 text-[9px] font-mono font-bold rounded tracking-tight transition-all cursor-pointer ${
              theme === "mono"
                ? "bg-white text-black font-extrabold shadow-sm"
                : "p-text-muted hover:p-text-main"
            }`}
          >
            Dark
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-grow z-10 w-full">
        {/* Left Interactive Section */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 border p-border rounded-full text-[10px] font-mono p-text-accent font-bold uppercase tracking-wider p-bg-secondary shadow-sm">
              ★ Grand Finale Edition
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold p-text-main leading-tight tracking-tight">
              Predict the future impact of <br />
              <span className="p-text-accent font-extrabold">AI Decisions.</span>
            </h1>
            <p className="p-text-muted max-w-xl text-xs md:text-sm leading-relaxed">
              Predict, audit, and auto-correct systemic bias across credit rating systems, hiring flows, and social grants using advanced multi-agent digital crash-test models.
            </p>
          </div>

          {/* Core Feature Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded border p-border p-bg-card hover:p-border-active transition-all duration-300 shadow-sm">
              <h4 className="text-xs font-bold p-text-main uppercase tracking-wider font-mono">✓ AI Fairness Simulation</h4>
              <p className="text-xs p-text-muted mt-1 leading-relaxed">Stochastically monitor demographics against disparate impact limits.</p>
            </div>
            <div className="p-5 rounded border p-border p-bg-card hover:p-border-active transition-all duration-300 shadow-sm">
              <h4 className="text-xs font-bold p-text-main uppercase tracking-wider font-mono">✓ RBI Compliance Engine</h4>
              <p className="text-xs p-text-muted mt-1 leading-relaxed">Full regulatory mapping for micro-lending and digital sandbox audits.</p>
            </div>
            <div className="p-5 rounded border p-border p-bg-card hover:p-border-active transition-all duration-300 shadow-sm">
              <h4 className="text-xs font-bold p-text-main uppercase tracking-wider font-mono">✓ Digital Crash Test Dummies</h4>
              <p className="text-xs p-text-muted mt-1 leading-relaxed">Stochastic citizen personas engineered to stress-test high risk models.</p>
            </div>
            <div className="p-5 rounded border p-border p-bg-card hover:p-border-active transition-all duration-300 shadow-sm">
              <h4 className="text-xs font-bold p-text-main uppercase tracking-wider font-mono">✓ Multi-Agent Decision Lab</h4>
              <p className="text-xs p-text-muted mt-1 leading-relaxed">Evaluate continuous feedback loops and accumulated systemic risk.</p>
            </div>
          </div>
        </div>

        {/* Right Authentication Box */}
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="p-8 rounded border p-border p-bg-card shadow-lg space-y-6 relative overflow-hidden">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-serif font-bold p-text-main leading-tight">Console Authentication</h3>
              <p className="text-xs p-text-muted">Enter administrative simulation environment</p>
            </div>

            {/* Toggle federated SSO vs government logins */}
            <div className="grid grid-cols-2 p-1 p-bg-secondary rounded border p-border shadow-sm">
              <button
                onClick={() => setActiveTab("enterprise")}
                className={`py-1.5 text-xs font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                  activeTab === "enterprise"
                    ? "p-bg-accent text-white shadow-sm"
                    : "p-text-muted hover:p-text-main"
                }`}
              >
                Workspace
              </button>
              <button
                onClick={() => setActiveTab("gov")}
                className={`py-1.5 text-xs font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                  activeTab === "gov"
                    ? "p-bg-accent text-white shadow-sm"
                    : "p-text-muted hover:p-text-main"
                }`}
              >
                NIC Gov ID
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={onLoginSuccess}
                className="w-full py-2.5 px-4 p-bg-secondary border p-border hover:p-border-active p-text-main font-mono text-xs font-bold uppercase rounded flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm text-center"
              >
                Continue with Google Account
              </button>

              <button
                onClick={onLoginSuccess}
                className="w-full py-2.5 px-4 p-bg-accent text-white hover:p-bg-accent-hover font-mono text-xs font-bold uppercase rounded flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm text-center"
              >
                Bypass SSO - Enter Demo Sandbox
              </button>
            </div>

            <p className="text-[10px] p-text-muted text-center leading-relaxed font-mono">
              Demo bypass credentials automatically registered. Secure SHA256 tunnel validated.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t p-border p-bg-card py-6 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono p-text-muted">
          <div>
            <span>© 2026 DECISIONTWIN PROTOTYPE.</span>
          </div>
          <div className="flex gap-4">
            <span>RBI Security Sandbox</span>
            <span>•</span>
            <span>NITI Aayog Responsible AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
