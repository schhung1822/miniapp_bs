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
    renderIcon: (active) => <MissionIcon size={15} color={active ? '#fff' : '#71717a'} />,
  },
  {
    key: 'vouchers',
    label: 'Voucher',
    renderIcon: (active) => <VoucherIcon size={15} color={active ? '#fff' : '#71717a'} />,
  },
  {
    key: 'vote',
    label: 'Vote',
    renderIcon: (active) => <VoteIcon size={15} color={active ? '#fff' : '#71717a'} />,
  },
  {
    key: 'policy',
    label: 'Chính sách',
    renderIcon: (active) => <PolicyIcon size={15} color={active ? '#fff' : '#71717a'} />,
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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-[linear-gradient(180deg,transparent_0%,rgba(8,9,17,0.78)_18%,rgba(8,9,17,0.98)_100%)] px-3 pb-2 pt-2">
      <div className="pointer-events-auto grid grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          const isMissionTab = tab.key === 'missions';

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`relative flex h-[54px] items-center justify-center rounded-[0.95rem] border px-1.5 py-1 text-center transition ${
                active
                  ? 'border-[#8b175f] bg-[linear-gradient(180deg,rgba(69,22,58,0.96),rgba(28,18,37,0.96))] text-white shadow-[0_10px_24px_rgba(135,24,95,0.14)]'
                  : 'border-white/8 bg-[#13141d]/96 text-zinc-500'
              }`}
            >
              {isMissionTab ? (
                <div className="flex flex-col items-center justify-center gap-0">
                  <div
                    className={`min-w-[26px] items-center rounded-full justify-center px-1.5 text-[8px] font-black ${
                      active ? 'bg-[#7d235c] text-[#ff87d0]' : 'bg-white/6 text-zinc-500'
                    }`}
                  >
                    {completedCount}/{totalCount}
                  </div>
                  <div className="mt-0.5 flex items-center justify-center gap-1">
                    {tab.renderIcon(active)}
                    <span
                      className={`whitespace-nowrap text-[10px] font-semibold leading-none ${
                        active ? 'text-white' : 'text-zinc-500'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  {tab.renderIcon(active)}
                  <span
                    className={`whitespace-nowrap text-[10px] font-semibold leading-none ${
                      active ? 'text-white' : 'text-zinc-500'
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InternalTabBar;
