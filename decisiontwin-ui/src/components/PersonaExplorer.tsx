import { useState } from "react";
import { Persona } from "../types";
import { Search, MapPin } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

export default function PersonaExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVulnerability, setSelectedVulnerability] = useState<string>("all");

  const storePersonas = useDecisionTwinStore((s) => s.personas);
  const personas = storePersonas;

  const [selectedExplorerPersonaId, setSelectedExplorerPersonaId] = useState<string>("");
  const selectedExplorerPersona = personas.find((p) => p.id === selectedExplorerPersonaId) || personas[0];

  const filteredPersonas = personas.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = selectedGender === "all" || p.gender === selectedGender;
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesVuln = selectedVulnerability === "all" || p.vulnerability === selectedVulnerability;

    return matchesSearch && matchesGender && matchesCategory && matchesVuln;
  });

  return (
    <div className="space-y-6" id="persona-explorer-view">
      {/* Header */}
      <div className="p-6 rounded border p-border p-bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 fill-current p-text-accent opacity-5 pointer-events-none" />
        <div>
          <span className="text-[9px] font-mono p-text-accent uppercase tracking-widest font-bold">Stochastic Cohort Explorer</span>
          <h2 className="text-2xl font-serif font-bold p-text-main mt-1">Persona Explorer</h2>
          <p className="text-xs p-text-muted mt-0.5">Search simulated profiles to expose differential algorithmic treatment across cohorts.</p>
        </div>
      </div>

      {/* Filter Ribbon bar controls */}
      <div className="p-4 rounded border p-border p-bg-card grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 p-text-muted" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-1.5 p-bg-secondary border p-border rounded text-xs p-text-main placeholder-neutral-500 focus:outline-none focus:p-border-active"
            placeholder="Search name, region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] p-text-muted font-mono uppercase tracking-wider shrink-0 font-bold">Gender</span>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full p-bg-secondary border p-border rounded px-2.5 py-1.5 text-xs p-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] p-text-muted font-mono uppercase tracking-wider shrink-0 font-bold">Flow</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-bg-secondary border p-border rounded px-2.5 py-1.5 text-xs p-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="credit">Micro Credit Rating</option>
            <option value="education">Scholarship Grants</option>
            <option value="employment">Recruitment & Hiring</option>
          </select>
        </div>

        {/* Vulnerability Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] p-text-muted font-mono uppercase tracking-wider shrink-0 font-bold">Risk</span>
          <select
            value={selectedVulnerability}
            onChange={(e) => setSelectedVulnerability(e.target.value)}
            className="w-full p-bg-secondary border p-border rounded px-2.5 py-1.5 text-xs p-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">All Exposure Risks</option>
            <option value="Critical">Critical Vulnerability</option>
            <option value="High">High Vulnerability</option>
            <option value="Medium">Medium Vulnerability</option>
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive list of cards matched */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-[10px] p-text-muted font-mono uppercase tracking-widest font-bold block">
            COHORTS MATCHED: {filteredPersonas.length} PROFILES
          </span>

          {filteredPersonas.length === 0 ? (
            <div className="p-8 rounded border p-border p-bg-card text-center text-xs p-text-muted">
              No simulated portfolios match selected filter nodes.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredPersonas.map((p) => {
                const isSelected = selectedExplorerPersona?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedExplorerPersonaId(p.id)}
                    className={`p-4 rounded border cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 shadow-sm ${
                      isSelected 
                        ? "p-bg-card p-border-active shadow-md" 
                        : "p-bg-card p-border opacity-85 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover border p-border"
                      />
                      <div>
                        <h4 className="text-xs font-bold p-text-main leading-normal">{p.name}</h4>
                        <p className="text-[10px] p-text-accent font-mono uppercase tracking-wider">{p.role}</p>
                        <p className="text-[9px] p-text-muted">{p.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="text-[9px] p-text-muted block">Approval Prob</span>
                        <span className={`text-xs font-bold ${p.approvalProbability < 45 ? "text-red-500 font-normal" : "p-text-success"}`}>
                          {p.approvalProbability}%
                        </span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 border rounded uppercase font-bold tracking-wide ${
                        p.vulnerability === "Critical" 
                          ? "text-red-500 bg-red-500/10 border-red-500/20" 
                          : p.vulnerability === "High"
                          ? "p-text-warning p-bg-warning-muted border-amber-500/10"
                          : "text-blue-500 bg-blue-500/10 border-blue-500/15"
                      }`}>
                        {p.vulnerability}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Explorer deep inspection file card drawer */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded border p-border p-bg-card space-y-6 shadow-sm">
            <div className="flex justify-between items-start border-b p-border pb-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono p-text-accent block uppercase tracking-widest font-bold">COHORT PROFILE DOSSIER</span>
                <h3 className="text-xl font-serif font-bold p-text-main leading-tight">{selectedExplorerPersona.name}</h3>
                <p className="text-xs p-text-muted leading-tight">{selectedExplorerPersona.role}</p>
              </div>
              <span className="text-[10px] font-mono p-bg-secondary p-1 px-2 border p-border rounded p-text-accent font-bold uppercase tracking-wide">
                Active Cohort
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Profile Details Grid */}
              <div className="p-4 p-bg-secondary border p-border rounded space-y-2.5 shadow-inner">
                <span className="text-[9px] font-mono p-text-muted block uppercase tracking-wider font-bold">Personal Attributes File</span>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 p-text-main font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="p-text-muted font-sans">Gender:</span>
                    <span>{selectedExplorerPersona.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="p-text-muted font-sans">Credit Score:</span>
                    <span className="font-bold p-text-accent">{selectedExplorerPersona.creditScore || 700}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="p-text-muted font-sans">Disability:</span>
                    <span className="line-clamp-1">{selectedExplorerPersona.disability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="p-text-muted font-sans">Income:</span>
                    <span>{selectedExplorerPersona.income}</span>
                  </div>
                  <div className="col-span-2 border-t p-border pt-2.5 flex items-start gap-1 text-[10px]">
                    <MapPin className="w-3.5 h-3.5 p-text-muted shrink-0" />
                    <span className="p-text-muted leading-tight">{selectedExplorerPersona.location}</span>
                  </div>
                </div>
              </div>

              {/* Prediction history */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono p-text-muted block uppercase tracking-wider font-bold">Algorithmic Audits Trail</span>
                <div className="p-3.5 p-bg-secondary border p-border text-xs leading-relaxed p-text-main rounded font-sans shadow-sm">
                  <p>{selectedExplorerPersona.vulnerabilityDetail}</p>
                </div>
              </div>

              {/* Dynamic trajectory projection bar */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[9px] font-mono p-text-muted uppercase tracking-wider font-bold">Cohort Bias Severity index</span>
                  <span className="text-xs font-bold p-text-warning font-mono">{selectedExplorerPersona.riskScore}% severity</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full p-bg-accent rounded-full transition-all duration-300" 
                    style={{ width: `${selectedExplorerPersona.riskScore}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
