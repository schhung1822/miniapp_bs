import React from 'react';

import { TrophyIcon } from '@/features/beauty-summit/icons';
import type { TierKey } from '@/features/beauty-summit/types';

interface RewardCompletionScreenProps {
  tier: TierKey;
  orderCode: string;
  totalPoints: number;
  onBack: () => void;
}

const SPARKLES = [
  { left: '10%', top: '7%', size: 10, color: '#f6a8a1', delay: '0s', duration: '1.8s' },
  { left: '37%', top: '10%', size: 6, color: '#bb79b8', delay: '0.5s', duration: '2.1s' },
  { left: '78%', top: '24%', size: 11, color: '#f3c6a5', delay: '1.1s', duration: '1.9s' },
  { left: '6%', top: '55%', size: 8, color: '#f2c3d5', delay: '0.4s', duration: '2.3s' },
  { left: '66%', top: '61%', size: 5, color: '#d5a8ff', delay: '1.5s', duration: '1.7s' },
  { left: '89%', top: '78%', size: 9, color: '#f5c49f', delay: '0.9s', duration: '2.2s' },
] as const;

const displayFontClass = "font-['Playfair_Display',serif]";
const bodyFontClass = "font-['Be_Vietnam_Pro',sans-serif]";

const RewardCompletionScreen: React.FC<RewardCompletionScreenProps> = ({
  tier,
  orderCode,
  totalPoints,
  onBack,
}) => {
  const title = 'CH\u00daC M\u1eeaNG!';
  const subtitle = `100% nhi\u1ec7m v\u1ee5 ho\u00e0n th\u00e0nh \u2022 ${totalPoints} BPoint`;
  const grandPrizeTitle = '\u2605 GRAND PRIZE \u2605';
  const rewardHeadingTop = 'B\u1ea1n \u0111\u00e3 \u0111\u1ee7 \u0111i\u1ec1u ki\u1ec7n';
  const rewardHeadingMiddle = 'tr\u00fang th\u01b0\u1edfng';
  const rewardDescription =
    'Xu\u1ea5t tr\u00ecnh m\u00e0n h\u00ecnh n\u00e0y t\u1ea1i s\u00e2n kh\u1ea5u ch\u00ednh \u0111\u1ec3 tham gia b\u1ed1c th\u0103m tr\u00fang xe VinFast VF3 tri gia 315 trieu dong';
  const rewardCodeLabel = 'M\u00e3 tham gia b\u1ed1c th\u0103m';
  const backLabel = '\u2190 Quay l\u1ea1i';
  const rewardCode = `VF3-${tier.substring(0, 1)}-${orderCode.slice(-4) || '0000'}-WIN`;

  return (
    <div className="beauty-reward-screen-modal relative h-full overflow-hidden px-6 pb-10 pt-[70px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(196,30,127,0.25)_0%,transparent_60%)]" />

      {SPARKLES.map((particle, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="beauty-reward-sparkle absolute rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        <div className="beauty-reward-slide-up beauty-reward-float">
          <div className="mb-3 flex justify-center [filter:drop-shadow(0_0_30px_rgba(255,215,0,0.4))]">
            <TrophyIcon size={64} color="#FFD700" />
          </div>

          <h1
            className={`${displayFontClass} mb-1.5 inline-block bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] bg-clip-text pb-1 pt-1 text-[30px] font-black leading-[1.2] text-transparent`}
          >
            {title}
          </h1>

          <p className={`${bodyFontClass} text-sm font-semibold text-[#FFB6D9]`}>{subtitle}</p>
        </div>

        <div
          className="beauty-reward-slide-up beauty-reward-card-glow mt-8 rounded-[22px] border-2 border-[rgba(255,111,181,0.25)] bg-[linear-gradient(145deg,rgba(196,30,127,0.15),rgba(255,111,181,0.08))] p-7"
          style={{ animationDelay: '0.3s' }}
        >
          <div
            className={`${bodyFontClass} mb-3.5 text-xs font-semibold tracking-[0.33em] text-[#4ade80]`}
          >
            {grandPrizeTitle}
          </div>

          <div className="beauty-reward-float mb-3.5 flex justify-center" style={{ animationDuration: '2s' }}>
            <TrophyIcon size={56} color="#FFD700" />
          </div>

          <h2
            className={`${displayFontClass} mb-2.5 text-[20px] font-black leading-[1.3] text-[#fff6db]`}
          >
            {rewardHeadingTop}
            <br />
            {rewardHeadingMiddle}
            <br />
            <span className="inline-block bg-gradient-to-r from-[#22c55e] to-[#4ade80] bg-clip-text text-[26px] text-transparent">
              VinFast VF3
            </span>
          </h2>

          <p className={`${bodyFontClass} mb-5 text-xs font-light leading-[1.6] text-[#aaa]`}>
            {rewardDescription}
          </p>

          <div className="inline-block rounded-[10px] bg-[rgba(255,255,255,0.07)] px-[18px] py-[10px]">
            <div className={`${bodyFontClass} mb-[3px] text-[10px] text-[#777]`}>
              {rewardCodeLabel}
            </div>
            <div
              className={`${bodyFontClass} text-[18px] font-bold tracking-[0.25em] text-[#4ade80]`}
            >
              {rewardCode}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className={`${bodyFontClass} mt-[22px] w-full cursor-pointer rounded-[13px] border border-[rgba(255,255,255,0.12)] bg-transparent px-4 py-[14px] text-[13px] text-[#bbb]`}
        >
          {backLabel}
        </button>
      </div>
    </div>
  );
};

export default RewardCompletionScreen;
