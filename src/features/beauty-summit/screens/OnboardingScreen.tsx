import React from 'react';

import type { OnboardingSlide } from '@/features/beauty-summit/types';

interface OnboardingScreenProps {
  slides: OnboardingSlide[];
  slideIndex: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingVisual: React.FC<{ index: number }> = ({ index }) => {
  if (index === 1) {
    return (
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
        <rect x="35" y="10" width="110" height="160" rx="16" fill="#1a1a2e" stroke="#B8860B" strokeWidth="2" />
        <rect x="41" y="22" width="98" height="136" rx="8" fill="#0a0a12" />
        <rect x="50" y="30" width="80" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
        <rect x="50" y="30" width="32" height="6" rx="3" fill="#B8860B" opacity="0.7" />
        <rect x="78" y="27" width="10" height="10" rx="3" fill="rgba(255,255,255,0.1)" stroke="#B8860B" strokeWidth="0.8" />

        <rect x="48" y="44" width="84" height="28" rx="6" fill="rgba(74,222,128,0.06)" stroke="rgba(74,222,128,0.2)" strokeWidth="1" />
        <rect x="54" y="51" width="14" height="14" rx="4" fill="#22c55e" />
        <polyline points="58,58 60,60 64,55" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="73" y="53" width="40" height="4" rx="2" fill="rgba(74,222,128,0.2)" />
        <rect x="73" y="60" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
        <text x="124" y="60" textAnchor="middle" fontSize="6" fill="#22c55e" fontWeight="700" fontFamily="Arial">✓</text>

        <rect x="48" y="78" width="84" height="28" rx="6" fill="rgba(184,134,11,0.06)" stroke="#B8860B" strokeWidth="1.5" />
        <rect x="54" y="85" width="14" height="14" rx="4" fill="#B8860B" opacity="0.2" stroke="#B8860B" strokeWidth="1" />
        <rect x="73" y="87" width="44" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
        <rect x="73" y="94" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
        <rect x="113" y="84" width="16" height="10" rx="4" fill="#FFD700" opacity="0.15" />
        <text x="121" y="92" textAnchor="middle" fontSize="5" fill="#FFD700" fontWeight="700" fontFamily="Arial">+15</text>
        <circle cx="75" cy="92" r="18" fill="#B8860B" opacity="0.05" />

        <rect x="48" y="112" width="84" height="28" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <rect x="54" y="119" width="14" height="14" rx="4" fill="rgba(255,255,255,0.05)" />
        <rect x="73" y="121" width="38" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
        <rect x="73" y="128" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.03)" />

        <rect x="115" y="145" width="28" height="14" rx="7" fill="#FFD700" opacity="0.15" stroke="#FFD700" strokeWidth="0.8" />
        <text x="129" y="155" textAnchor="middle" fontSize="6" fill="#FFD700" fontWeight="800" fontFamily="Arial">BP</text>
        <circle cx="25" cy="60" r="3" fill="#FFD700" opacity="0.4" />
        <circle cx="160" cy="80" r="2.5" fill="#FF6FB5" opacity="0.4" />
        <circle cx="155" cy="150" r="2" fill="#5BC8D8" opacity="0.3" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
        <defs>
          <radialGradient id="giftGlow" cx="50%" cy="46%" r="50%">
            <stop offset="0%" stopColor="#FFEBA3" stopOpacity="0.88" />
            <stop offset="58%" stopColor="#FFD700" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="giftBody" x1="42" y1="58" x2="138" y2="142">
            <stop offset="0%" stopColor="#FFF1A6" />
            <stop offset="45%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="giftRibbon" x1="51" y1="47" x2="128" y2="128">
            <stop offset="0%" stopColor="#FF8AC8" />
            <stop offset="100%" stopColor="#C41E7F" />
          </linearGradient>
          <linearGradient id="voucherGradient" x1="48" y1="25" x2="116" y2="66">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFE8F4" />
          </linearGradient>
        </defs>

        <circle cx="90" cy="89" r="76" fill="url(#giftGlow)" />
        <path d="M30 84C35 78 40 74 46 72" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        <path d="M150 83C145 77 140 74 134 71" stroke="#FF6FB5" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        <path d="M40 130C48 136 56 139 66 140" stroke="#5BC8D8" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

        <rect x="56" y="35" width="62" height="30" rx="9" fill="url(#voucherGradient)" stroke="#C41E7F" strokeWidth="1.4" transform="rotate(-10 87 50)" />
        <circle cx="66" cy="48" r="4" fill="#FFD700" opacity="0.7" />
        <rect x="77" y="42" width="31" height="4" rx="2" fill="#C41E7F" opacity="0.28" transform="rotate(-10 92.5 44)" />
        <rect x="76" y="51" width="23" height="3.5" rx="1.75" fill="#B8860B" opacity="0.34" transform="rotate(-10 87.5 52.75)" />
        <text x="91" y="57" textAnchor="middle" fontSize="7" fill="#C41E7F" fontWeight="800" fontFamily="Arial" transform="rotate(-10 91 57)">VOUCHER</text>

        <ellipse cx="90" cy="145" rx="51" ry="10" fill="#B8860B" opacity="0.16" />
        <rect x="47" y="74" width="86" height="64" rx="14" fill="url(#giftBody)" stroke="#9F6B00" strokeWidth="1.6" />
        <rect x="45" y="60" width="90" height="24" rx="10" fill="url(#giftRibbon)" stroke="#9F0F64" strokeWidth="1.3" />
        <rect x="81" y="60" width="18" height="78" fill="url(#giftRibbon)" opacity="0.96" />
        <rect x="47" y="83" width="86" height="4" fill="#FFFFFF" opacity="0.24" />
        <rect x="55" y="93" width="18" height="31" rx="7" fill="#FFFFFF" opacity="0.18" />

        <path d="M88 59C78 45 62 43 58 54C55 63 70 66 86 62" fill="#FFE4F3" stroke="#C41E7F" strokeWidth="2" strokeLinecap="round" />
        <path d="M92 59C102 45 118 43 122 54C125 63 110 66 94 62" fill="#FFE4F3" stroke="#C41E7F" strokeWidth="2" strokeLinecap="round" />
        <circle cx="90" cy="62" r="7" fill="#C41E7F" />
        <circle cx="90" cy="62" r="3" fill="#FFD700" />

        <path d="M138 33L142 43L153 45L144 52L146 63L138 57L128 63L131 52L122 45L133 43L138 33Z" fill="#FFD700" opacity="0.9" />
        <path d="M41 47L44 54L52 56L45 61L47 69L41 65L34 69L36 61L29 56L38 54L41 47Z" fill="#FF6FB5" opacity="0.72" />
        <circle cx="139" cy="116" r="4" fill="#5BC8D8" opacity="0.65" />
        <circle cx="34" cy="111" r="3" fill="#FFD700" opacity="0.76" />
        <circle cx="104" cy="24" r="3" fill="#22c55e" opacity="0.58" />

        <rect x="59" y="144" width="62" height="24" rx="12" fill="#22c55e" opacity="0.12" stroke="#22c55e" strokeWidth="1.1" />
        <text x="90" y="159" textAnchor="middle" fontSize="9" fill="#15803D" fontWeight="900" fontFamily="Arial">VF3 GRAND PRIZE</text>
      </svg>
    );
  }

  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
      <rect x="35" y="10" width="110" height="160" rx="16" fill="#1a1a2e" stroke="#B8860B" strokeWidth="2" />
      <rect x="41" y="22" width="98" height="136" rx="8" fill="#0a0a12" />
      <rect x="50" y="32" width="80" height="8" rx="3" fill="#B8860B" opacity="0.3" />
      <text x="90" y="39" textAnchor="middle" fontSize="5.5" fill="#B8860B" fontWeight="700" fontFamily="Arial" opacity="0.8">TẠO MÃ QR CHECK-IN</text>
      <rect x="50" y="48" width="80" height="22" rx="6" fill="rgba(255,255,255,0.05)" stroke="#B8860B" strokeWidth="1" strokeDasharray="3 2" />
      <text x="90" y="62" textAnchor="middle" fontSize="7" fill="#B8860B" fontWeight="600" fontFamily="Arial" opacity="0.5">DHMN4S154</text>
      <rect x="55" y="76" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
      <rect x="55" y="82" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.04)" />
      <path d="M90 92 L90 102" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="86,102 90,108 94,102" fill="#22c55e" opacity="0.6" />
      <rect x="65" y="112" width="50" height="40" rx="6" fill="#fff" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((column) => {
          const visible = (row < 2 && column < 2) || (row + column) % 2 === 0;
          return visible ? (
            <rect
              key={`${row}-${column}`}
              x={70 + column * 9}
              y={117 + row * 9}
              width="7"
              height="7"
              rx="1.5"
              fill="#1E1656"
              opacity="0.7"
            />
          ) : null;
        }),
      )}
      <circle cx="130" cy="118" r="12" fill="#22c55e" />
      <polyline points="125,118 129,122 136,114" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="55" y="88" width="70" height="12" rx="4" fill="#B8860B" opacity="0.7" />
      <text x="90" y="96" textAnchor="middle" fontSize="5.5" fill="#fff" fontWeight="700" fontFamily="Arial">TẠO MÃ QR →</text>
      <circle cx="25" cy="50" r="3" fill="#FFD700" opacity="0.4" />
      <circle cx="160" cy="40" r="2.5" fill="#22c55e" opacity="0.5" />
      <circle cx="155" cy="140" r="2" fill="#5BC8D8" opacity="0.4" />
    </svg>
  );
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  slides,
  slideIndex,
  onSelect,
  onNext,
  onSkip,
}) => {
  const current = slides[slideIndex];
  const isLast = slideIndex === slides.length - 1;

  return (
    <div className="relative z-[1] flex h-full min-h-full flex-col px-6 pb-6 pt-10">
      <div className="relative mb-4 flex items-center justify-center">
        <div className="rounded-[0.65rem] border border-[#b8860b]/20 bg-[#b8860b]/10 px-3.5 py-1.5">
          <span className="text-xs font-bold text-[#b8860b]">
            Bước {slideIndex + 1}/{slides.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="beauty-press absolute right-0 rounded-full px-0 py-1.5 text-xs font-medium text-[#666]"
        >
          Bỏ qua →
        </button>
      </div>

      <div key={current.id} className="flex flex-1 flex-col items-center justify-center text-center beauty-fade-in">
        <div className="beauty-slide-up mb-8 flex h-[220px] w-[220px] items-center justify-center rounded-[2.75rem] border border-[#b8860b]/10 bg-[#b8860b]/[0.04]">
          <OnboardingVisual index={slideIndex} />
        </div>

        <h2 className="beauty-slide-up max-w-[19rem] text-balance text-[26px] font-black leading-[1.2] text-[#1a1a2e]" style={{ animationDelay: '100ms' }}>
          {current.title}
        </h2>

        <p className="beauty-slide-up mt-3 max-w-[300px] text-pretty text-[15px] font-normal leading-[1.7] text-[#777]" style={{ animationDelay: '200ms' }}>
          {current.desc}
        </p>
      </div>

      <div className="pb-4 pt-6">
        <div className="mb-5 flex justify-center gap-2.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Chuyển đến bước ${index + 1}`}
              onClick={() => onSelect(index)}
              className="beauty-press h-2.5 rounded-full transition-[width,background] duration-300"
              style={{
                width: index === slideIndex ? 28 : 10,
                background:
                  index === slideIndex
                    ? 'linear-gradient(90deg, #B8860B, #FFD700)'
                    : 'rgba(184,134,11,0.18)',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          className={`beauty-press w-full rounded-2xl border-none px-4 py-[18px] text-[17px] font-extrabold ${
            isLast ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]'
          }`}
          style={{
            background: 'linear-gradient(90deg, #B8860B 0%, #F2C94C 54%, #FFD700 100%)',
            boxShadow: '0 12px 26px rgba(184,134,11,0.22)',
          }}
        >
          {isLast ? 'Bắt đầu ngay →' : 'Tiếp theo →'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
