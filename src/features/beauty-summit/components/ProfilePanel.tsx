import React from 'react';

import { ChevronRightIcon, PolicyIcon, StarIcon } from '@/features/beauty-summit/icons';
import type { BeautyUserRole } from '@/features/beauty-summit/types';

interface ProfilePanelProps {
  userName: string;
  userAvatar: string;
  userPhone: string;
  ticketLabel: string;
  availablePoints: number;
  completedCount: number;
  totalMissionCount: number;
  userRole: BeautyUserRole;
  onOpenPolicy: () => void;
  onLogout: () => void;
}

const getInitials = (value: string): string =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  userName,
  userAvatar,
  userPhone,
  ticketLabel,
  availablePoints,
  completedCount,
  totalMissionCount,
  userRole,
  onOpenPolicy,
  onLogout,
}) => {
  const roleLabel = userRole === 'receptionist' ? 'Lễ tân' : 'Khách tham dự';

  return (
    <div className="space-y-4">
      <div className="rounded-[1.35rem] border border-[#eadfd2] bg-white p-4 shadow-[0_18px_38px_rgba(184,134,11,0.08)]">
        <div className="flex items-start gap-3">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-14 w-14 shrink-0 rounded-[1.1rem] border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#ec4899,#f59e0b)] text-lg font-black !text-white">
              {getInitials(userName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[15px] font-bold text-[#241629]">{userName}</div>
              <div className="rounded-full bg-[#f4edf2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a7280]">
                {roleLabel}
              </div>
            </div>
            <div className="mt-1 text-[12px] text-zinc-400">{userPhone}</div>
            <div className="mt-3 grid grid-cols-[1.15fr_0.92fr_0.92fr] gap-2">
              <div className="flex min-w-0 flex-col items-center justify-center rounded-[0.95rem] border border-[#eadfd2] bg-[#fffaf2] px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-[0.12em] text-[#8b8790]">Hạng vé</div>
                <div className="mt-1 w-full whitespace-nowrap text-center text-[12px] font-semibold text-[#241629]">
                  {ticketLabel}
                </div>
              </div>
              <div className="flex min-w-0 flex-col items-center justify-center rounded-[0.95rem] border border-[#eadfd2] bg-[#fffaf2] px-3 py-2 text-center">
                <div className="whitespace-nowrap text-[10px] uppercase tracking-[0.08em] text-[#8b8790]">
                  Nhiệm vụ
                </div>
                <div className="mt-1 text-[12px] font-semibold text-[#241629]">
                  {completedCount}/{totalMissionCount}
                </div>
              </div>
              <div className="flex min-w-0 flex-col items-center justify-center rounded-[0.95rem] border border-[#eadfd2] bg-[#fffaf2] px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-[0.12em] text-[#8b8790]">BPoint</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#241629]">
                  <StarIcon size={12} color="#ffd23f" />
                  {availablePoints}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenPolicy}
        className="flex w-full items-center gap-3 rounded-[1.2rem] border border-[#eadfd2] bg-white px-4 py-4 text-left shadow-[0_10px_24px_rgba(184,134,11,0.06)]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-[#fff2cc] text-[#b8860b]">
          <PolicyIcon size={21} color="#b8860b" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-[#241629]">Chính sách ứng dụng</div>
          <div className="mt-1 text-[11px] leading-5 text-[#7a7280]">
            Xem quy định sự kiện, BPoint, voucher và chính sách dữ liệu cá nhân.
          </div>
        </div>
        <div className="shrink-0 text-zinc-500">
          <ChevronRightIcon size={16} color="currentColor" />
        </div>
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="w-full rounded-[1.2rem] border border-[#fecaca] bg-[#fff1f2] px-4 py-4 text-center text-[13px] font-bold text-[#dc2626] shadow-[0_10px_24px_rgba(220,38,38,0.06)]"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default ProfilePanel;
