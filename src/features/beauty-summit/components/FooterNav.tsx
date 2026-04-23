import React from 'react';
import { NavLink } from 'react-router-dom';

import { MissionIcon, ProfileIcon, QrIcon, VoucherIcon, VoteIcon } from '@/features/beauty-summit/icons';
import FooterWave from '@/features/beauty-summit/components/FooterWave';
import type { BeautyTab } from '@/features/beauty-summit/types';

const ACTIVE_NAV_COLOR = '#ffffff';
const INACTIVE_NAV_COLOR = '#b7b0c3';

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
    label: 'Nhiệm vụ',
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
    label: 'Award',
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
          filter: 'drop-shadow(0px 8px 24px rgba(73, 5, 105, 0.28))',
        }}
      />
      <div className="pointer-events-auto relative z-20 grid w-full grid-cols-[1fr_1fr_1fr_1fr_1fr] justify-center bg-[linear-gradient(180deg,rgba(122,16,164,0.92)_0%,rgba(92,8,131,0.98)_100%)] px-4 pb-[var(--safe-bottom)] pt-2 text-[11px] leading-4">
          {tabs.slice(0, 2).map((tab) => {
            const active = tab.key === activeTab;

            return (
              <NavLink
                key={tab.key}
                to={`/?tab=${tab.key}`}
                onClick={() => onChange(tab.key)}
                className="flex flex-col items-center space-y-0.5 p-1 active:scale-105"
              >
                <div className="flex h-6 w-6 items-center justify-center">{tab.renderIcon(active)}</div>
                <span
                  className={`max-w-[72px] text-center whitespace-pre-line text-[12px] leading-4 ${
                    active ? 'text-[#ffffff]' : 'text-[#b7b0c3]'
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
            <span className="footer-qr-scan -mt-4 flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full border border-[#ffb4d8] bg-[linear-gradient(135deg,#DF2757_20%,#612C8F_80%)] shadow-lg shadow-[#ff4b9766]">
              <QrIcon
                size={30}
                color="#ffffff"
                className="drop-shadow-[0_1px_4px_rgba(255,255,255,0.28)]"
              />
            </span>
          </button>

          {tabs.slice(2).map((tab) => {
            const active = tab.key === activeTab;

            return (
              <NavLink
                key={tab.key}
                to={`/?tab=${tab.key}`}
                onClick={() => onChange(tab.key)}
                className="flex flex-col items-center space-y-0.5 p-1 active:scale-105"
              >
                <div className="flex h-6 w-6 items-center justify-center">{tab.renderIcon(active)}</div>
                <span
                  className={`text-center line-clamp-2 text-[12px] leading-4 ${
                    active ? 'text-[#ffffff]' : 'text-[#b7b0c3]'
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
