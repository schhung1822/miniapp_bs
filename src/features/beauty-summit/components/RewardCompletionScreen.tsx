import React from 'react';

import type { TierKey } from '@/features/beauty-summit/types';
import { TrophyIcon } from '@/features/beauty-summit/icons';

interface RewardCompletionScreenProps {
  tier: TierKey;
  orderCode: string;
  onBack: () => void;
}

const RewardCompletionScreen: React.FC<RewardCompletionScreenProps> = ({
  tier,
  orderCode,
  onBack,
}) => (
  <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
    <div className="beauty-float mb-5 rounded-full border border-amber-300/25 bg-amber-300/10 p-5">
      <TrophyIcon size={52} color="#ffd970" />
    </div>
    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
      100% nhiệm vụ hoàn thành
    </div>
    <h2 className="bg-[linear-gradient(135deg,#fff,#ffd970,#f59e0b)] bg-clip-text font-serif text-4xl font-black leading-tight text-transparent">
      Chúc mừng
    </h2>
    <p className="mt-4 max-w-[18rem] text-sm leading-7 text-zinc-300">
      Bạn đã đủ điều kiện tham gia bốc thăm grand prize VinFast VF3 và mở khóa toàn bộ quyền lợi Beauty Summit 2026.
    </p>
    <div className="mt-8 w-full rounded-[1.4rem] border border-pink-400/20 bg-[linear-gradient(145deg,rgba(236,72,153,0.16),rgba(245,158,11,0.08))] p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Mã tham gia</div>
      <div className="mt-3 text-xl font-black tracking-[0.3em] text-emerald-200">
        VF3-{tier[0]}-{orderCode.slice(-4) || '0000'}
      </div>
    </div>
    <button
      type="button"
      onClick={onBack}
      className="mt-8 rounded-[1.15rem] bg-white/8 px-5 py-3 text-sm font-semibold text-white"
    >
      Quay lại dashboard
    </button>
  </div>
);

export default RewardCompletionScreen;
