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

const RewardCompletionScreen: React.FC<RewardCompletionScreenProps> = ({
  tier,
  orderCode,
  totalPoints,
  onBack,
}) => {
  const title = 'CHÚC MỪNG!';
  const subtitle = `100% nhiệm vụ hoàn thành \u2022 ${totalPoints} BPoint`;
  const grandPrizeTitle = '\u2605 GRAND PRIZE \u2605';
  const rewardHeadingTop = 'Bạn đã đủ điều kiện';
  const rewardHeadingMiddle = 'trúng thưởng';
  const rewardDescription =
    'Xuất trình màn hình này tại sân khấu chính để tham gia bốc thăm trúng thưởng xe VinFast VF3 trị giá 315 triệu đồng';
  const rewardCodeLabel = 'Mã tham gia bốc thăm';
  const backLabel = '\u2190 Quay lại';
  const rewardCode = `VF3-${tier.substring(0, 1)}-${orderCode.slice(-4) || '0000'}-WIN`;

  return (
    <div
      className="beauty-reward-screen-modal relative h-full overflow-hidden"
      style={{ padding: '70px 24px 40px' }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 30%, rgba(196,30,127,0.25) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {SPARKLES.map((particle, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="beauty-reward-sparkle"
          style={{
            position: 'absolute',
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: '50%',
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <div className="beauty-reward-slide-up beauty-reward-float">
          <div
            style={{
              marginBottom: 12,
              filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.4))',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TrophyIcon size={64} color="#FFD700" />
          </div>

          <h1
            style={{
              fontSize: 30,
              fontWeight: 900,
              marginBottom: 6,
              background: 'linear-gradient(135deg, #FFD700, #FFF, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Playfair Display", Georgia, serif',
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: 14,
              color: '#FFB6D9',
              fontWeight: 600,
              fontFamily: '"Be Vietnam Pro", sans-serif',
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          className="beauty-reward-slide-up beauty-reward-card-glow"
          style={{
            background: 'linear-gradient(145deg, rgba(196,30,127,0.15), rgba(255,111,181,0.08))',
            borderRadius: 22,
            padding: 28,
            border: '2px solid rgba(255,111,181,0.25)',
            marginTop: 32,
            animationDelay: '0.3s',
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              color: '#4ade80',
              marginBottom: 14,
              fontWeight: 600,
              fontFamily: '"Be Vietnam Pro", sans-serif',
            }}
          >
            {grandPrizeTitle}
          </div>

          <div
            className="beauty-reward-float"
            style={{
              marginBottom: 14,
              display: 'flex',
              justifyContent: 'center',
              animationDuration: '2s',
            }}
          >
            <TrophyIcon size={56} color="#FFD700" />
          </div>

          <h2
            style={{
              fontSize: 20,
              fontWeight: 900,
              marginBottom: 10,
              lineHeight: 1.3,
              color: '#fff6db',
              fontFamily: '"Playfair Display", Georgia, serif',
            }}
          >
            {rewardHeadingTop}
            <br />
            {rewardHeadingMiddle}
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: 26,
              }}
            >
              VinFast VF3
            </span>
          </h2>

          <p
            style={{
              fontSize: 12,
              color: '#aaa',
              lineHeight: 1.6,
              fontWeight: 300,
              marginBottom: 20,
              fontFamily: '"Be Vietnam Pro", sans-serif',
            }}
          >
            {rewardDescription}
          </p>

          <div
            style={{
              background: 'rgba(255,255,255,0.07)',
              borderRadius: 10,
              padding: '10px 18px',
              display: 'inline-block',
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: '#777',
                marginBottom: 3,
                fontFamily: '"Be Vietnam Pro", sans-serif',
              }}
            >
              {rewardCodeLabel}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 4,
                color: '#4ade80',
                fontFamily: '"Be Vietnam Pro", sans-serif',
              }}
            >
              {rewardCode}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 13,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent',
            color: '#bbb',
            fontSize: 13,
            cursor: 'pointer',
            marginTop: 22,
            fontFamily: '"Be Vietnam Pro", sans-serif',
          }}
        >
          {backLabel}
        </button>
      </div>
    </div>
  );
};

export default RewardCompletionScreen;
