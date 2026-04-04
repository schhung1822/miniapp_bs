import React from 'react';

import '@/css/beauty-summit.css';

interface BeautyShellProps {
  children: React.ReactNode;
  toast?: string | null;
}

const BeautyShell: React.FC<BeautyShellProps> = ({ children, toast }) => {
  return (
    <div className="beauty-shell relative h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.2),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-48 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.12),_transparent_60%)]" />
      {children}
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
