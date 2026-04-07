import React from 'react';
import { NavLink } from 'react-router-dom';

import { MissionIcon, ProfileIcon, QrIcon, VoucherIcon, VoteIcon } from '@/features/beauty-summit/icons';
import FooterWave from '@/features/beauty-summit/components/FooterWave';
import type { BeautyTab } from '@/features/beauty-summit/types';

const ACTIVE_NAV_COLOR = '#241629';
const INACTIVE_NAV_COLOR = '#c7ad62';

interface FooterNavProps {
  activeTab: BeautyTab;
  onChange: (tab: BeautyTab) => void;
  onQrClick: () => void;
  hidden?: boolean;
}

const tabs: Array<{
  key: BeautyTab;
  label: string;
  renderIcon: (active: boolean) => React.ReactNode;
}> = [
  {
    key: 'missions',
    label: 'Trang chủ',
    renderIcon: (active) => <MissionIcon size={24} color={active ? ACTIVE_NAV_COLOR : INACTIVE_NAV_COLOR} />,
  },
  {
    key: 'profile',
    label: 'Cá nhân',
    renderIcon: (active) => <ProfileIcon size={24} color={active ? ACTIVE_NAV_COLOR : INACTIVE_NAV_COLOR} />,
  },
  {
    key: 'vouchers',
    label: 'Voucher',
    renderIcon: (active) => <VoucherIcon size={24} color={active ? ACTIVE_NAV_COLOR : INACTIVE_NAV_COLOR} />,
  },
  {
    key: 'vote',
    label: 'Vote',
    renderIcon: (active) => <VoteIcon size={24} color={active ? ACTIVE_NAV_COLOR : INACTIVE_NAV_COLOR} />,
  },
];

const FooterNav: React.FC<FooterNavProps> = ({ activeTab, onChange, onQrClick, hidden }) => {
  if (hidden) {
    return null;
  }

  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-30 w-full">
      <FooterWave
        className="absolute inset-x-0 bottom-[var(--safe-bottom)] z-10 -mb-6 h-24"
        style={{
          filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.08))',
        }}
      />
      <div className="pointer-events-auto relative z-20 grid w-full grid-cols-[1fr_1fr_1fr_1fr_1fr] justify-center bg-white px-4 pb-[var(--safe-bottom)] pt-2 text-[11px] leading-4">
          {tabs.slice(0, 2).map((tab) => {
            const active = tab.key === activeTab;

            return (
              <NavLink
                key={tab.key}
                to={`/?tab=${tab.key}`}
                onClick={() => onChange(tab.key)}
                viewTransition
                className="flex flex-col items-center space-y-0.5 p-1 active:scale-105"
              >
                <div className="flex h-6 w-6 items-center justify-center">{tab.renderIcon(active)}</div>
                <span
                  className={`truncate text-[12px] leading-4 ${
                    active ? 'text-[#241629]' : 'text-[#c7ad62]'
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={onQrClick}
            className="flex flex-col items-center p-1 active:scale-105"
            aria-label="Mở mã QR"
          >
            <span className="footer-qr-scan -mt-4 flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#ffd54a,#d9a400)] shadow-lg shadow-[#f5c84b4d]">
              <QrIcon size={30} color="#ffffff" />
            </span>
          </button>

          {tabs.slice(2).map((tab) => {
            const active = tab.key === activeTab;

            return (
              <NavLink
                key={tab.key}
                to={`/?tab=${tab.key}`}
                onClick={() => onChange(tab.key)}
                viewTransition
                className="flex flex-col items-center space-y-0.5 p-1 active:scale-105"
              >
                <div className="flex h-6 w-6 items-center justify-center">{tab.renderIcon(active)}</div>
                <span
                  className={`truncate text-[12px] leading-4 ${
                    active ? 'text-[#241629]' : 'text-[#c7ad62]'
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
      </div>
    </footer>
  );
};

export default FooterNav;
