import React from 'react';

import type { Milestone } from '@/features/beauty-summit/types';
import { CloseIcon, TrophyIcon } from '@/features/beauty-summit/icons';

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
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[1.6rem] border border-white/8 bg-[#141626] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${milestone.color}24, rgba(255,255,255,0.04))`,
                border: `1px solid ${milestone.color}33`,
              }}
            >
              <TrophyIcon size={26} color={milestone.color} />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{milestone.title}</div>
              <div className="text-sm text-zinc-400">{milestone.brand}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/6 p-2 text-zinc-400">
            <CloseIcon />
          </button>
        </div>

        <p className="mb-5 text-sm leading-6 text-zinc-300">{milestone.desc}</p>

        <div className="mb-5 rounded-[1.15rem] border border-white/6 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Tiến độ hiện tại</span>
            <span className="font-semibold" style={{ color: milestone.color }}>
              {progress}% / {milestone.pct}%
            </span>
          </div>
          <div className="mb-3 h-2 rounded-full bg-white/8">
            <div
              className="h-2 rounded-full"
              style={{ width: `${ratio}%`, background: `linear-gradient(90deg, ${milestone.color}, ${milestone.color}bb)` }}
            />
          </div>
          <div className="text-xs text-zinc-400">
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
          className="w-full rounded-2xl px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-zinc-500"
          style={unlocked && !claimed ? { background: `linear-gradient(135deg, ${milestone.color}, ${milestone.color}cc)` } : undefined}
        >
          {claimed ? 'Đã nhận' : unlocked ? 'Nhận phần quà' : 'Tiếp tục làm nhiệm vụ'}
        </button>
      </div>
    </div>
  );
};

export default MilestoneModal;
