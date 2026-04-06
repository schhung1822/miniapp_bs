import React from 'react';

import { ChevronRightIcon, PolicyIcon, QrIcon, StarIcon } from '@/features/beauty-summit/icons';
import type { BeautyUserRole, TierMeta } from '@/features/beauty-summit/types';

interface ProfilePanelProps {
  userName: string;
  userAvatar: string;
  userPhone: string;
  tier: TierMeta;
  availablePoints: number;
  completedCount: number;
  totalMissionCount: number;
  userRole: BeautyUserRole;
  onOpenPolicy: () => void;
  onOpenScanner: () => void;
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
  tier,
  availablePoints,
  completedCount,
  totalMissionCount,
  userRole,
  onOpenPolicy,
  onOpenScanner,
}) => {
  const roleLabel = userRole === 'receptionist' ? 'Lễ tân' : 'Khách tham dự';

  return (
    <div className="space-y-4">
      <div className="rounded-[1.35rem] border border-white/8 bg-[linear-gradient(145deg,rgba(20,21,34,0.98),rgba(12,14,24,0.98))] p-4 shadow-[0_18px_38px_rgba(0,0,0,0.18)]">
        <div className="flex items-start gap-3">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-14 w-14 shrink-0 rounded-[1.1rem] border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#ec4899,#f59e0b)] text-lg font-black text-white">
              {getInitials(userName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[15px] font-bold text-white">{userName}</div>
              <div className="rounded-full bg-white/6 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                {roleLabel}
              </div>
            </div>
            <div className="mt-1 text-[12px] text-zinc-400">{userPhone}</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-[0.95rem] border border-white/6 bg-white/[0.03] px-3 py-2">
                <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">Hạng vé</div>
                <div className="mt-1 text-[12px] font-semibold text-white">{tier.name}</div>
              </div>
              <div className="rounded-[0.95rem] border border-white/6 bg-white/[0.03] px-3 py-2">
                <div className="whitespace-nowrap text-[10px] uppercase tracking-[0.08em] text-zinc-500">
                  Nhiệm vụ
                </div>
                <div className="mt-1 text-[12px] font-semibold text-white">
                  {completedCount}/{totalMissionCount}
                </div>
              </div>
              <div className="rounded-[0.95rem] border border-white/6 bg-white/[0.03] px-3 py-2">
                <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">BPoint</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-white">
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
        onClick={onOpenScanner}
        className="flex w-full items-center gap-3 rounded-[1.2rem] border border-emerald-400/14 bg-[linear-gradient(145deg,rgba(8,34,30,0.96),rgba(10,22,27,0.96))] px-4 py-4 text-left shadow-[0_16px_32px_rgba(0,0,0,0.16)]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-emerald-400/14 text-emerald-300">
          <QrIcon size={22} color="currentColor" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-bold text-white">Quét mã check-in</div>
            <div className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
              Tạm mở
            </div>
          </div>
          <div className="mt-1 text-[11px] leading-5 text-zinc-400">
            Bản tạm để demo. Sau này chỉ tài khoản role lễ tân mới được phép sử dụng.
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={onOpenPolicy}
        className="flex w-full items-center gap-3 rounded-[1.2rem] border border-white/8 bg-[#12141d]/96 px-4 py-4 text-left"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-white/6 text-zinc-200">
          <PolicyIcon size={21} color="currentColor" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-white">Chính sách ứng dụng</div>
          <div className="mt-1 text-[11px] leading-5 text-zinc-400">
            Xem quy định sự kiện, BPoint, voucher và chính sách dữ liệu cá nhân.
          </div>
        </div>
        <div className="shrink-0 text-zinc-500">
          <ChevronRightIcon size={16} color="currentColor" />
        </div>
      </button>
    </div>
  );
};

export default ProfilePanel;
