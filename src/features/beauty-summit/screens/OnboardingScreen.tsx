import React from 'react';

import type { OnboardingSlide } from '@/features/beauty-summit/types';

interface OnboardingScreenProps {
  slides: OnboardingSlide[];
  slideIndex: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onSkip: () => void;
}

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
    <div className="relative flex h-full flex-col px-6 pb-8 pt-6">
      <div className="mb-6 flex items-center justify-center">
        <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-1 text-xs font-semibold text-amber-200">
          {current.badge}
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="absolute right-6 rounded-full px-3 py-1 text-xs font-medium text-zinc-500"
        >
          Bỏ qua
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div
          className="beauty-slide-up beauty-glow relative mb-8 flex h-60 w-60 items-center justify-center rounded-[2rem] border border-white/8 bg-white/[0.03]"
          style={{ boxShadow: `0 20px 60px ${current.accent}22` }}
        >
          <div
            className="absolute inset-6 rounded-[1.6rem]"
            style={{ background: `radial-gradient(circle at top, ${current.accent}24, transparent 65%)` }}
          />
          <div className="relative flex flex-col items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-[1.4rem] text-3xl font-black"
              style={{
                background: `linear-gradient(135deg, ${current.accent}, rgba(255,255,255,0.25))`,
                color: '#120916',
              }}
            >
              {slideIndex + 1}
            </div>
            <div className="max-w-[11rem] text-balance font-serif text-2xl font-black text-white">
              {current.title}
            </div>
          </div>
        </div>

        <p className="beauty-slide-up max-w-[18rem] text-pretty text-sm leading-7 text-zinc-300" style={{ animationDelay: '120ms' }}>
          {current.desc}
        </p>
      </div>

      <div className="pt-4">
        <div className="mb-6 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => onSelect(index)}
              className="h-2.5 rounded-full transition"
              style={{
                width: index === slideIndex ? 30 : 10,
                background:
                  index === slideIndex
                    ? 'linear-gradient(90deg, #f59e0b, #ec4899)'
                    : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onNext}
          className={`beauty-press w-full rounded-[1.15rem] px-4 py-4 text-sm font-bold ${
            isLast ? 'text-[#160c1d]' : 'text-white'
          }`}
          style={{
            background: isLast
              ? 'linear-gradient(135deg, #f59e0b, #ffd970)'
              : 'rgba(255,255,255,0.08)',
          }}
        >
          {isLast ? 'Bắt đầu ngay' : 'Tiếp theo'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
