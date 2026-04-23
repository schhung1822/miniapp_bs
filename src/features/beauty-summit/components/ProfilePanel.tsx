import React from 'react';

import { ChevronRightIcon, PolicyIcon, ProfileIcon, StarIcon } from '@/features/beauty-summit/icons';
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
  onOpenDeveloperInfo: () => void;
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
  onOpenDeveloperInfo,
  onLogout,
}) => {
  const roleLabel = userRole === 'receptionist' ? 'Lễ tân' : 'Khách tham dự';

  return (
    <div className="space-y-4">
      <div className="rounded-[1.4rem] border border-[#ffb4eb]/45 bg-[linear-gradient(135deg,rgba(150,25,178,0.98)_0%,rgba(122,16,171,0.98)_52%,rgba(208,24,122,0.94)_100%)] p-4 shadow-[0_20px_40px_rgba(92,7,120,0.24)]">
        <div className="flex items-start gap-3">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-14 w-14 shrink-0 rounded-[1.1rem] border border-white/20 object-cover shadow-[0_10px_20px_rgba(42,7,63,0.26)]"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem] border border-white/16 bg-[linear-gradient(135deg,#ff4ec2,#8f3cff)] text-lg font-black !text-white shadow-[0_10px_20px_rgba(53,8,89,0.3)]">
              {getInitials(userName)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[15px] font-bold text-white/90">{userName}</div>
              <div className="rounded-full border border-white/18 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ">
                {roleLabel}
              </div>
            </div>

            <div className="mt-1 text-[12px] text-white/72">{userPhone}</div>

            <div className="mt-3 grid grid-cols-[1.15fr_0.92fr_0.92fr] gap-2">
              <div className="flex min-w-0 flex-col items-center justify-center rounded-[0.95rem] border border-white/16 bg-white/10 px-3 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="text-[10px] uppercase tracking-[0.12em] font-bold">Hạng vé</div>
                <div className="mt-1 w-full whitespace-nowrap text-center text-[12px] font-semibold">
                  {ticketLabel}
                </div>
              </div>

              <div className="flex min-w-0 flex-col items-center justify-center rounded-[0.95rem] border border-white/16 bg-white/10 px-3 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="whitespace-nowrap text-[10px] uppercase tracking-[0.08em] font-bold">
                  Nhiệm vụ
                </div>
                <div className="mt-1 text-[12px] font-semibold">
                  {completedCount}/{totalMissionCount}
                </div>
              </div>

              <div className="flex min-w-0 flex-col items-center justify-center rounded-[0.95rem] border border-white/16 bg-white/10 px-3 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="text-[10px] uppercase tracking-[0.12em] font-bold">BPoint</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold">
                  <StarIcon size={12} color="#000" />
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
        className="flex w-full items-center gap-3 rounded-[1.2rem] border border-[#ffb4eb]/40 bg-[linear-gradient(135deg,rgba(145,23,181,0.96)_0%,rgba(121,16,171,0.96)_58%,rgba(189,17,125,0.92)_100%)] px-4 py-4 text-left shadow-[0_16px_28px_rgba(77,5,110,0.2)]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-white/16 bg-[linear-gradient(135deg,rgba(255,84,196,0.34)_0%,rgba(151,36,212,0.42)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <PolicyIcon size={21} color="#ffffff" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-white/90">Chính sách ứng dụng</div>
          <div className="mt-1 text-[11px] leading-5 text-white/72">
            Xem quy định chung và quy định nhiệm vụ áp dụng cho Beauty Summit.
          </div>
        </div>
        <div className="shrink-0 text-white/72">
          <ChevronRightIcon size={16} color="currentColor" />
        </div>
      </button>

      <button
        type="button"
        onClick={onOpenDeveloperInfo}
        className="flex w-full items-center gap-3 rounded-[1.2rem] border border-[#ffb4eb]/30 bg-[linear-gradient(135deg,rgba(115,17,167,0.94)_0%,rgba(96,14,151,0.96)_100%)] px-4 py-4 text-left shadow-[0_16px_28px_rgba(64,5,98,0.18)]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-white/16 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.06)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <ProfileIcon size={21} color="#ffffff" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-white/90">Thông tin nhà phát triển</div>
          <div className="mt-1 text-[11px] leading-5 text-white/72">
            Xem mã số doanh nghiệp, số điện thoại hỗ trợ và phiên bản Mini App hiện tại.
          </div>
        </div>
        <div className="shrink-0 text-white/72">
          <ChevronRightIcon size={16} color="currentColor" />
        </div>
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="w-full rounded-full border border-[#ff95cf]/42 bg-[linear-gradient(135deg,rgba(183,20,121,0.92)_0%,rgba(134,14,91,0.94)_100%)] px-4 py-4 text-center text-[15px] font-bold text-white/90 shadow-[0_16px_28px_rgba(110,7,74,0.18)]"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default ProfilePanel;
