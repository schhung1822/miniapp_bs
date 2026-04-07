import React from 'react';

import '@/css/beauty-summit.css';

interface BeautyShellProps {
  children: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  toast?: string | null;
}

const BeautyShell: React.FC<BeautyShellProps> = ({
  children,
  loading = false,
  loadingLabel = 'Loading...',
  toast,
}) => {
  return (
    <div className="beauty-shell beauty-light relative h-full overflow-hidden text-[#241629]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,236,200,0.92),_transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-48 bg-[radial-gradient(circle_at_center,_rgba(255,198,220,0.46),_transparent_62%)]" />
      {children}
      {loading ? (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/72 backdrop-blur-sm">
          <div className="flex min-w-[11rem] flex-col items-center gap-3 rounded-[1.4rem] border border-[#eadfd2] bg-white/95 px-6 py-5 shadow-[0_24px_60px_rgba(184,134,11,0.16)]">
            <div className="beauty-spinner h-9 w-9 rounded-full border-[3px] border-[#eadfd2] border-t-[#b8860b]" />
            <div className="text-center text-sm font-medium text-[#241629]">{loadingLabel}</div>
          </div>
        </div>
      ) : null}
      {toast ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-50 flex justify-center px-4">
          <div className="beauty-toast rounded-full bg-emerald-500 px-4 py-2 text-center text-xs font-semibold text-white shadow-[0_14px_36px_rgba(16,185,129,0.35)]">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BeautyShell;
