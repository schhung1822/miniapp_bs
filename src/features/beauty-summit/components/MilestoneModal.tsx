import React from 'react';

import { CloseIcon, TrophyIcon } from '@/features/beauty-summit/icons';
import type { Milestone } from '@/features/beauty-summit/types';

interface MilestoneModalProps {
  milestone: Milestone | null;
  progress: number;
  claimed: boolean;
  onClose: () => void;
  onClaim: () => void;
}

const MilestoneModal: React.FC<MilestoneModalProps> = ({
  milestone,
  progress,
  claimed,
  onClose,
  onClaim,
}) => {
  if (!milestone) {
    return null;
  }

  const unlocked = progress >= milestone.pct;
  const ratio = Math.min(100, Math.round((progress / milestone.pct) * 100));

  return (
    <div
      className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[1.7rem] border border-[#ff96da]/18 bg-[linear-gradient(180deg,#241f3c_0%,#19172c_100%)] p-6 text-white shadow-[0_24px_80px_rgba(15,11,31,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border"
              style={{
                background: `linear-gradient(135deg, ${milestone.color}24, rgba(255,255,255,0.04))`,
                borderColor: `${milestone.color}33`,
              }}
            >
              <TrophyIcon size={26} color={milestone.color} />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{milestone.title}</div>
              <div className="text-sm text-white/56">{milestone.brand}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/12 bg-white/[0.06] p-2 text-white/70"
            aria-label="Đóng mốc quà"
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <p className="mb-5 text-sm leading-6 text-white/72">{milestone.desc}</p>

        <div className="mb-5 rounded-[1.15rem] border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-white/48">Tiến độ hiện tại</span>
            <span className="font-semibold" style={{ color: milestone.color }}>
              {progress}% / {milestone.pct}%
            </span>
          </div>
          <div className="mb-3 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full"
              style={{ width: `${ratio}%`, background: `linear-gradient(90deg, ${milestone.color}, ${milestone.color}bb)` }}
            />
          </div>
          <div className="text-xs text-white/56">
            {claimed
              ? 'Bạn đã nhận mốc quà này.'
              : unlocked
                ? 'Mốc quà đã mở khóa. Bạn có thể nhận ngay.'
                : `Cần thêm ${Math.max(0, milestone.pct - progress)}% tiến độ để mở khóa.`}
          </div>
        </div>

        <button
          type="button"
          onClick={onClaim}
          disabled={!unlocked || claimed}
          className="w-full rounded-[1rem] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/36"
          style={unlocked && !claimed ? { background: 'linear-gradient(135deg,#ff4fb6 0%,#a53cff 100%)' } : undefined}
        >
          {claimed ? 'Đã nhận' : unlocked ? 'Nhận phần quà' : 'Tiếp tục làm nhiệm vụ'}
        </button>
      </div>
    </div>
  );
};

export default MilestoneModal;
