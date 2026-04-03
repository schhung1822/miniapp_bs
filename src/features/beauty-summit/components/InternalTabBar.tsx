import React from 'react';

import type { BeautyTab } from '@/features/beauty-summit/types';
import { MissionIcon, PolicyIcon, VoucherIcon, VoteIcon } from '@/features/beauty-summit/icons';

interface InternalTabBarProps {
  activeTab: BeautyTab;
  completedCount: number;
  totalCount: number;
  onChange: (tab: BeautyTab) => void;
  hidden?: boolean;
}

const tabs: Array<{
  key: BeautyTab;
  label: string;
  renderIcon: (active: boolean) => React.ReactNode;
}> = [
  {
    key: 'missions',
    label: 'Nhiệm vụ',
    renderIcon: (active) => <MissionIcon color={active ? '#fff' : '#71717a'} />,
  },
  {
    key: 'vouchers',
    label: 'Voucher',
    renderIcon: (active) => <VoucherIcon color={active ? '#fff' : '#71717a'} />,
  },
  {
    key: 'vote',
    label: 'Vote',
    renderIcon: (active) => <VoteIcon color={active ? '#fff' : '#71717a'} />,
  },
  {
    key: 'policy',
    label: 'Chính sách',
    renderIcon: (active) => <PolicyIcon color={active ? '#fff' : '#71717a'} />,
  },
];

const InternalTabBar: React.FC<InternalTabBarProps> = ({
  activeTab,
  completedCount,
  totalCount,
  onChange,
  hidden,
}) => {
  if (hidden) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-[linear-gradient(180deg,transparent_0%,rgba(7,8,15,0.88)_18%,rgba(7,8,15,0.98)_100%)] px-3 pb-4 pt-5">
      <div className="pointer-events-auto grid grid-cols-4 gap-2 rounded-[1.1rem] border border-white/5 bg-black/35 p-2 backdrop-blur-xl">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`rounded-2xl border px-2 py-2 text-center transition ${
                active
                  ? 'border-pink-400/35 bg-[linear-gradient(145deg,rgba(236,72,153,0.2),rgba(245,158,11,0.08))] text-white'
                  : 'border-white/6 bg-white/[0.03] text-zinc-500'
              }`}
            >
              {tab.key === 'missions' ? (
                <div
                  className={`mx-auto mb-1 inline-flex min-w-10 justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    active ? 'bg-pink-400/15 text-pink-200' : 'bg-white/6 text-zinc-500'
                  }`}
                >
                  {completedCount}/{totalCount}
                </div>
              ) : (
                <div className="mb-1 h-5" />
              )}
              <div className="flex items-center justify-center gap-1">
                {tab.renderIcon(active)}
                <span className={`text-[11px] font-medium ${active ? 'text-white' : 'text-zinc-500'}`}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InternalTabBar;
