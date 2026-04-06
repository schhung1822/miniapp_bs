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
    <div className="beauty-shell relative h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.2),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-48 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.12),_transparent_60%)]" />
      {children}
      {loading ? (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#090913]/78 backdrop-blur-sm">
          <div className="flex min-w-[11rem] flex-col items-center gap-3 rounded-[1.4rem] border border-white/10 bg-[#151624]/92 px-6 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="beauty-spinner h-9 w-9 rounded-full border-[3px] border-white/15 border-t-[#f59e0b]" />
            <div className="text-center text-sm font-medium text-zinc-200">{loadingLabel}</div>
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
