import React, { useState, useEffect } from "react";
import { Shield, Loader2, Upload, Database, X, AlertCircle } from "lucide-react";
import { useDecisionTwinStore } from "../store/useDecisionTwinStore";

interface DataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DataIngestionModal({
  isOpen,
  onClose,
  onSuccess,
}: DataIngestionModalProps) {
  const { session, uploadCustomData, initSession } = useDecisionTwinStore();

  const [useMock, setUseMock] = useState(true);
  const [domain, setDomain] = useState("lending");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [targetOutcome, setTargetOutcome] = useState("approved");
  const [protectedAttribute, setProtectedAttribute] = useState("gender");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // If session is null, it's a forced open state (no close option)
  const isForceOpen = !session;

  // Reset inputs when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (useMock) {
        // Map backend domain to UI domain first so initSession sets selectedUiDomain correctly
        const domainMap: Record<string, string> = {
          lending: "credit",
          scholarship: "education",
          hiring: "employment",
        };
        const uiDomain = domainMap[domain] ?? "credit";
        await initSession(uiDomain);
      } else {
        if (!csvFile || !modelFile) {
          throw new Error("Both dataset (.csv) and AI model (.pkl, .onnx) are required for custom uploads.");
        }
        await uploadCustomData({
          domain,
          protectedAttribute,
          targetOutcome,
          useMock: false,
          file: csvFile,
          modelFile: modelFile,
        });
      }

      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setLocalError(err instanceof Error ? err.message : "Failed to initialize session");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity" 
        onClick={() => {
          if (!isForceOpen && !isSubmitting) onClose();
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg p-bg-card border p-border rounded-lg shadow-2xl z-10 overflow-hidden transition-all duration-300 font-sans">
        
        {/* Close Button (only if not forced) */}
        {!isForceOpen && !isSubmitting && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded p-bg-secondary border p-border hover:p-border-active cursor-pointer transition-colors p-text-muted hover:p-text-main"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-8 h-8 rounded border p-border flex items-center justify-center p-bg-secondary shadow-sm">
              <Shield className="w-4 h-4 p-text-accent" />
            </div>
            <div>
              <span className="text-base tracking-widest font-serif block leading-none font-bold uppercase p-text-main">
                Decision<span className="p-text-accent">Twin</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest uppercase opacity-70 block mt-1 p-text-muted">
                INITIALIZE SIMULATION DATA ENVIRONMENT
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold p-text-main leading-tight">
              Ingest Custom Model & Dataset
            </h3>
            <p className="text-xs p-text-muted">
              Configure data source, model parameters, and target outcome tags to launch the audit console.
            </p>
          </div>

          {localError && (
            <div className="flex items-start gap-2.5 p-3 rounded border p-bg-warning-muted border-red-500/20 text-xs text-red-500 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Source Toggle Selector */}
            <div className="grid grid-cols-2 p-1 p-bg-secondary rounded border p-border shadow-sm">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setUseMock(true)}
                className={`py-2 text-xs font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                  useMock
                    ? "p-bg-accent text-white shadow-sm"
                    : "p-text-muted hover:p-text-main opacity-80"
                }`}
              >
                Pre-built Mock Pack
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setUseMock(false)}
                className={`py-2 text-xs font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                  !useMock
                    ? "p-bg-accent text-white shadow-sm"
                    : "p-text-muted hover:p-text-main opacity-80"
                }`}
              >
                Custom Upload
              </button>
            </div>

            {/* Domain Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono p-text-muted uppercase tracking-wider block font-bold">
                Target Domain
              </label>
              <select
                disabled={isSubmitting}
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-bg-secondary border p-border rounded px-3 py-2 text-xs p-text-main focus:outline-none focus:p-border-active cursor-pointer font-sans"
              >
                <option value="lending">Lending (Finance & Credit Rating)</option>
                <option value="hiring">Hiring (Enterprise Recruitment ATS)</option>
                <option value="scholarship">Scholarship (Academic Grants & Loans)</option>
              </select>
            </div>

            {/* Custom file fields */}
            {!useMock && (
              <div className="space-y-4 border-t p-border pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload 1 */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono p-text-muted uppercase tracking-wider block font-bold">
                      Dataset CSV File
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".csv"
                        disabled={isSubmitting}
                        onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                        className="w-full text-xs p-text-main file:mr-3 file:py-1.5 file:px-2.5 file:rounded file:border file:p-border file:text-[10px] file:font-mono file:font-bold file:p-bg-secondary file:p-text-main hover:file:p-bg-main cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  {/* File Upload 2 */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono p-text-muted uppercase tracking-wider block font-bold">
                      AI Model File (.pkl, .onnx)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pkl,.onnx"
                        disabled={isSubmitting}
                        onChange={(e) => setModelFile(e.target.files?.[0] || null)}
                        className="w-full text-xs p-text-main file:mr-3 file:py-1.5 file:px-2.5 file:rounded file:border file:p-border file:text-[10px] file:font-mono file:font-bold file:p-bg-secondary file:p-text-main hover:file:p-bg-main cursor-pointer"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Target & Protected Attributes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono p-text-muted uppercase tracking-wider block font-bold">
                      Target Outcome Column
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={targetOutcome}
                      onChange={(e) => setTargetOutcome(e.target.value)}
                      placeholder="e.g., approved"
                      className="w-full px-3 py-2 text-xs premium-input p-bg-secondary border p-border rounded focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono p-text-muted uppercase tracking-wider block font-bold">
                      Protected Attribute
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={protectedAttribute}
                      onChange={(e) => setProtectedAttribute(e.target.value)}
                      placeholder="e.g., gender"
                      className="w-full px-3 py-2 text-xs premium-input p-bg-secondary border p-border rounded focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 p-bg-accent text-white hover:p-bg-accent-hover font-mono text-xs font-bold uppercase rounded flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SYNCHRONIZING ENVIRONMENT...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Initialize DecisionTwin</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[9px] p-text-muted text-center leading-relaxed font-mono">
            {useMock 
              ? "Loading pre-computed RBI compliance matrices and synthetic demographics."
              : "Uploading custom weights, calculating continuous policy drifts, and parsing columns."}
          </p>
        </div>
      </div>
    </div>
  );
}
