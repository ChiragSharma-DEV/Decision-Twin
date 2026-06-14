import type { ReactNode } from "react";

interface ComingSoonOverlayProps {
  children: ReactNode;
}

export default function ComingSoonOverlay({ children }: ComingSoonOverlayProps) {
  return (
    <div className="relative min-h-[480px]">
      <div className="pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] pointer-events-auto">
        <div className="px-6 py-3 rounded border border-white/20 bg-black/70 shadow-lg">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white">
            Enterprise Feature / Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}
