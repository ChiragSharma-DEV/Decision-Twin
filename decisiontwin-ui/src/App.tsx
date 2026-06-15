import { useEffect, useState } from "react";
import LoginPortal from "./components/LoginPortal";
import DashboardView from "./components/DashboardView";
import CrashTestDummies from "./components/CrashTestDummies";
import DoppelgangerLab from "./components/DoppelgangerLab";
import PersonaExplorer from "./components/PersonaExplorer";
import AuditGenerator from "./components/AuditGenerator";
import GeminiCopilot from "./components/GeminiCopilot";
import DataIngestionModal from "./components/DataIngestionModal";
import { Persona } from "./types";
import { useDecisionTwinStore } from "./store/useDecisionTwinStore";

import { 
  Shield, LayoutDashboard, Users, AlertCircle, Sliders, DollarSign, 
  Layers, Search, ShieldCheck, FileText, Map, Presentation, Bell,
  ArrowRight, SearchCode, BrainCircuit, Globe, Info, Upload
} from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Do not bypass login, show login screen first
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);

  const [selectedPersonaForDoppelganger, setSelectedPersonaForDoppelganger] = useState<Persona | undefined>(undefined);

  const handleSelectPersonaForTest = (persona: Persona) => {
    setSelectedPersonaForDoppelganger(persona);
    setActiveTab("doppelganger");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Safe navigation handler
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const NAV_ITEMS = [
    { id: "dashboard", label: "Executive Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "dummies", label: "Crash Test Dummies", icon: <Users className="w-4 h-4" /> },
    { id: "doppelganger", label: "Doppelganger Lab", icon: <BrainCircuit className="w-4 h-4" /> },
    { id: "explorer", label: "Persona Explorer", icon: <SearchCode className="w-4 h-4" /> },
    { id: "audit", label: "Audit Report Generator", icon: <FileText className="w-4 h-4" /> }
  ];

  const [theme, setTheme] = useState<"cream" | "mono">("cream"); // User gets gorgeous cream & brown as initial default

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    text: string;
    type: "warning" | "success" | "info";
    time: string;
    read: boolean;
  }>>([
    {
      id: "init-1",
      text: "System initialized. Secure Auditor is active.",
      type: "success",
      time: "Just now",
      read: false
    }
  ]);

  const initSession = useDecisionTwinStore((s) => s.initSession);
  const simulation = useDecisionTwinStore((s) => s.simulation);
  const session = useDecisionTwinStore((s) => s.session);
  const checkActiveSession = useDecisionTwinStore((s) => s.checkActiveSession);

  useEffect(() => {
    if (isLoggedIn) {
      checkActiveSession().then((hasSession) => {
        if (!hasSession) {
          setIsIngestionModalOpen(true);
        }
      });
    }
  }, [isLoggedIn, checkActiveSession]);

  useEffect(() => {
    if (session) {
      initSession(selectedDomain);
    }
  }, [selectedDomain, initSession, session]);

  useEffect(() => {
    if (!simulation) return;
    
    // Generate alerts dynamically from simulation outcomes
    const newAlerts: Array<{
      id: string;
      text: string;
      type: "warning" | "success" | "info";
      time: string;
      read: boolean;
    }> = [];
    
    const latestYear = simulation.yearly_results?.[simulation.yearly_results.length - 1];
    if (latestYear) {
      const dpRatio = latestYear.metrics.demographic_parity_ratio;
      const selectedDomainName = selectedDomain === "all" ? "Lending" : selectedDomain;
      
      if (dpRatio < 0.8) {
        newAlerts.push({
          id: `sim-alert-bias-${Date.now()}-${Math.random()}`,
          text: `Warning: Parity ratio fell to ${(dpRatio * 100).toFixed(0)}% in Year ${latestYear.year} under the 80% regulatory threshold.`,
          type: "warning",
          time: "Just now",
          read: false
        });
      } else {
        newAlerts.push({
          id: `sim-alert-fair-${Date.now()}-${Math.random()}`,
          text: `Compliance Check: Parity ratio is ${(dpRatio * 100).toFixed(0)}% for Year ${latestYear.year}. Status: PASS.`,
          type: "success",
          time: "Just now",
          read: false
        });
      }

      if (simulation.business_impact) {
        newAlerts.push({
          id: `sim-alert-revenue-${Date.now()}-${Math.random()}`,
          text: `Opportunity Loss: Projected margin gap of ${simulation.business_impact.currency_formatted} estimated.`,
          type: "info",
          time: "Just now",
          read: false
        });
      }
    }
    
    if (newAlerts.length > 0) {
      setNotifications(prev => {
        const existingTexts = new Set(prev.map(n => n.text));
        const filteredNew = newAlerts.filter(a => !existingTexts.has(a.text));
        if (filteredNew.length === 0) return prev;
        return [...filteredNew, ...prev].slice(0, 15);
      });
    }
  }, [simulation, selectedDomain]);

  if (!isLoggedIn) {
    return <LoginPortal onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={`min-h-screen p-bg-main p-text-main flex flex-col font-sans relative transition-colors duration-500 ${theme === "cream" ? "theme-cream" : "theme-mono"}`} id="applet-main-container">
      {/* Absolute classic background accents (subtle vector overlays instead of glaring tech-blobs) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,var(--accent-gold-muted),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.02),transparent_40%)] pointer-events-none" />

      {/* Header (Top Bar) */}
      <header className="border-b p-border p-bg-card backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-3 shrink-0 select-none">
          <div className="w-8 h-8 rounded border p-border flex items-center justify-center p-bg-secondary shadow-sm">
            <Shield className="w-4 h-4 p-text-accent" />
          </div>
          <div>
            <span className="text-lg tracking-widest font-serif block leading-none font-bold uppercase">
              Decision<span className="p-text-accent">Twin</span>
            </span>
            <span className="text-[8px] font-mono tracking-widest uppercase opacity-70 block mt-1">EST. 2026 • EXECUTIVE ETHICS SANDBOX</span>
          </div>
        </div>

        {/* Global Search & Domain selector */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto flex-grow max-w-xl lg:mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 p-text-accent opacity-60" />
            <input
              type="text"
              readOnly
              onClick={() => handleNavigate("explorer")}
              className="w-full pl-9 pr-3 py-1.5 p-bg-secondary border p-border rounded text-xs p-text-main cursor-pointer focus:outline-none focus:border-active"
              placeholder="Search demographic cohorts, audit indices..."
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 select-none">
            <span className="text-[9px] font-mono p-text-muted uppercase shrink-0 tracking-wider">DOMAIN:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="p-bg-secondary border p-border rounded px-3 py-1.5 text-xs p-text-main focus:outline-none focus:p-border-active cursor-pointer font-sans"
            >
              <option value="all">Consolidated Audit</option>
              <option value="credit">Finance & Credit Rating</option>
              <option value="education">Academic Grants & Loans</option>
              <option value="employment">Enterprise Recruitment ATS</option>
              <option value="hr">Social Welfare Allotments</option>
            </select>
          </div>
        </div>

        {/* Theme Segment Selection, Profile & Controls */}
        <div className="flex items-center gap-4 shrink-0 justify-end w-full lg:w-auto">
          {/* Dual Theme Switcher */}
          <div className="flex p-1 rounded border p-border p-bg-secondary select-none shadow-sm">
            <button
              onClick={() => setTheme("cream")}
              className={`px-3 py-1 text-[10px] font-mono font-bold rounded tracking-tight transition-all cursor-pointer ${
                theme === "cream"
                  ? "p-bg-accent text-white shadow-sm"
                  : "p-text-muted hover:p-text-main"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme("mono")}
              className={`px-3 py-1 text-[10px] font-mono font-bold rounded tracking-tight transition-all cursor-pointer ${
                theme === "mono"
                  ? "bg-white text-black font-extrabold shadow-sm"
                  : "p-text-muted hover:p-text-main"
              }`}
            >
              Dark
            </button>
          </div>

          <div className="hidden xl:flex flex-col text-right font-mono text-[9px] p-text-muted">
            <span className="uppercase">AUDITING: <span className="p-text-main font-bold">{session?.domain || 'Global'}</span></span>
            <span className="p-text-accent font-semibold text-[10px] lowercase">decisiontwin@teamdecyphers.in</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell icon with badge */}
            <div className="relative">
              <div 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded p-bg-secondary border p-border cursor-pointer hover:p-bg-main transition-colors select-none"
              >
                <Bell className="w-4 h-4 p-text-muted" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 p-bg-accent rounded-full border p-border animate-pulse" />
                )}
              </div>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 p-bg-card border p-border rounded-lg shadow-xl z-50 overflow-hidden font-sans">
                  <div className="px-4 py-3 border-b p-border flex items-center justify-between p-bg-secondary">
                    <span className="text-xs font-bold uppercase tracking-wider p-text-main">Notifications</span>
                    {notifications.some(n => !n.read) && (
                      <button 
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        className="text-[10px] p-text-accent hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y p-border">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs p-text-muted">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
                          }}
                          className={`px-4 py-3 hover:p-bg-secondary cursor-pointer transition-colors ${!n.read ? 'bg-opacity-5 bg-[var(--accent-gold)]' : ''}`}
                        >
                          <div className="flex gap-2.5 items-start">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                              n.type === 'warning' ? 'bg-red-500' :
                              n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-grow">
                              <p className="text-xs p-text-main font-medium leading-normal">{n.text}</p>
                              <span className="text-[9px] p-text-muted mt-1 block">{n.time}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t p-border text-center p-bg-secondary">
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-[10px] text-red-500 hover:underline cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Upload Model & Data button */}
            <button
              onClick={() => setIsIngestionModalOpen(true)}
              className="text-xs px-3 py-1.5 p-bg-accent text-white hover:p-bg-accent-hover rounded transition-all cursor-pointer font-semibold flex items-center gap-1.5 shadow-sm mr-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>New Session / Upload Data</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 p-bg-secondary border p-border hover:p-border-active p-text-muted hover:p-text-main rounded transition-all cursor-pointer font-semibold"
            >
              Lock Console
            </button>
          </div>
        </div>
      </header>

      {/* Main split dashboard frame */}
      <div className="flex-grow flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto px-6 py-6 gap-6 relative z-10">
        
        {/* Left Side menu */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2 relative">
          <div className="sticky top-24 space-y-1 bg-transparent">
            <span className="text-[9px] font-mono p-text-muted uppercase tracking-widest block px-2.5 mb-2.5">Sim Console Modules</span>
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full py-2.5 px-3.5 rounded border transition-all text-left text-xs font-semibold flex items-center gap-3.5 cursor-pointer ${
                    isActive 
                      ? "p-bg-accent text-white font-extrabold border-transparent shadow-sm" 
                      : "border-transparent p-text-muted hover:p-text-main hover:bg-white/5"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "p-text-accent"}`}>{item.icon}</span>
                  <span className="font-sans text-[12px] tracking-tight">{item.label}</span>
                </button>
              );
            })}

            <div className="px-2 pt-2 pb-1">
              <button
                onClick={() => setIsIngestionModalOpen(true)}
                className="w-full py-2 px-3.5 rounded border border-dashed p-border hover:p-border-active p-text-main hover:bg-neutral-500/10 transition-all text-left text-xs font-semibold flex items-center gap-3.5 cursor-pointer shadow-sm"
              >
                <Upload className="w-4 h-4 p-text-accent" />
                <span className="font-sans text-[12px] tracking-tight">New Session / Upload</span>
              </button>
            </div>

            <div className="pt-4 border-t p-border px-2">
              <div className="p-3.5 p-bg-secondary rounded border p-border space-y-1.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-[9px] font-bold p-text-accent font-sans uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>PREJUDICE RADAR ACTIVE</span>
                </div>
                <p className="text-[10px] p-text-muted leading-relaxed font-sans">
                  Monitoring latent correlation patterns in real-time for protected trait <span className="p-text-main font-bold uppercase">{session?.protected_attribute || 'Unknown'}</span>. System reports {session ? 'active' : 'idle'} simulation tracking.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center content slot pages */}
        <main className="flex-grow min-w-0" id="workbench-core">
          {activeTab === "dashboard" && <DashboardView selectedDomain={selectedDomain} onCopilotMsg={handleNavigate} />}
          {activeTab === "dummies" && <CrashTestDummies onSelectPersona={handleSelectPersonaForTest} onNavigateToTab={handleNavigate} />}
          {activeTab === "doppelganger" && <DoppelgangerLab preselectedPersona={selectedPersonaForDoppelganger} />}
          {activeTab === "explorer" && <PersonaExplorer />}
          {activeTab === "audit" && <AuditGenerator />}
        </main>
      </div>

      {/* Floating Copilot module pane */}
      <GeminiCopilot onNavigateToTab={handleNavigate} />

      {/* Corporate signature footnote */}
      <footer className="border-t p-border py-8 px-6 bg-transparent mt-auto relative z-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono p-text-muted">
          <div>
            <span>© 2026 DECISIONTWIN PROTOTYPE.</span>
            <span className="mx-2">•</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <span>RBI Compliance Sandbox</span>
            <span>•</span>
            <span>NITI Aayog Responsible AI standards</span>
            <span>•</span>
            <span>ISO 42001 Standard Governance</span>
          </div>
        </div>
      </footer>

      {/* Data Ingestion Modal */}
      <DataIngestionModal 
        isOpen={isIngestionModalOpen || !session} 
        onClose={() => setIsIngestionModalOpen(false)}
        onSuccess={() => {
          const currentSession = useDecisionTwinStore.getState().session;
          if (currentSession) {
            const backendToUiDomain = (d: string): string => {
              const map: Record<string, string> = {
                lending: "credit",
                scholarship: "education",
                hiring: "employment",
              };
              return map[d] ?? "credit";
            };
            setSelectedDomain(backendToUiDomain(currentSession.domain));
          }
        }}
      />
    </div>
  );
}
