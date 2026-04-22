import React from 'react';

import logoOnboarding from '@/assets/logo-onboarding.png';
import giftIllustration from '@/assets/qua.svg';
import type { OnboardingSlide } from '@/features/beauty-summit/types';

interface OnboardingScreenProps {
  slides: OnboardingSlide[];
  slideIndex: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onSkip: () => void;
}

const QrPattern: React.FC = () => {
  const cells = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 1],
  ];

  return (
    <div className="grid grid-cols-7 gap-[2px] rounded-[0.78rem] bg-[#ffffff] p-[9px] shadow-[0_10px_20px_rgba(37,11,71,0.16)]">
      {cells.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <div
            key={`${rowIndex}-${columnIndex}`}
            className={`h-[6px] w-[6px] rounded-[1.5px] ${cell ? 'bg-[#140a28]' : 'bg-transparent'}`}
          />
        )),
      )}
    </div>
  );
};

const HoangTuWordmark: React.FC = () => (
  <div className="text-center">
    <div className="text-[12px] p-0 font-black uppercase tracking-[0.09em] text-[#ffffff]">HOANG TU</div>
    <p className="text-[5px] leading-none font-medium tracking-[0.32em] text-[#f1dcff]">HOLDINGS</p>
  </div>
);

const OnboardingBrandStrip: React.FC = () => (
  <div className="w-full px-2">
    <div className="flex items-center justify-center gap-2.5">
      <img
        src={logoOnboarding}
        alt="Beauty Summit"
        className="h-[25px] w-auto max-w-[86px] object-contain"
      />
      <div className="h-5 w-px bg-[#ffffff]/30" />
      <HoangTuWordmark />
    </div>
    <div className="mt-3 h-px w-full bg-[#ffffff]/70" />
  </div>
);

const VisualPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`relative mx-auto w-[238px] max-w-full overflow-hidden rounded-[2rem] border border-[#3c0d6d] bg-[linear-gradient(180deg,#6213b9_0%,#6f12b4_50%,#8d169a_100%)] px-4 pb-4 pt-4 shadow-[0_20px_42px_rgba(56,0,99,0.26),inset_0_1px_0_rgba(255,255,255,0.08)] ${className}`}
  >
    <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_72%)]" />
    {children}
  </div>
);

const StepOneVisual: React.FC = () => (
  <VisualPanel className="pb-5">
    <OnboardingBrandStrip />
    <div className="mt-5 flex items-center justify-center">
      <div className="w-[162px] rounded-[1.55rem] border border-[#ffffff] bg-[rgba(62,9,101,0.34)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="mx-auto inline-flex whitespace-nowrap rounded-[0.62rem] bg-[linear-gradient(135deg,#ef3ba4_0%,#a62097_100%)] px-3 py-1.5 text-[7px] font-extrabold uppercase tracking-[0.04em] text-[#ffffff]">
          TẠO MÃ QR CHECK IN
        </div>
        <div className="mt-3 whitespace-nowrap rounded-[0.68rem] bg-[#ffffff] px-2.5 py-2.5 text-center text-[8px] font-black text-[#21102c] shadow-[0_8px_18px_rgba(16,6,33,0.12)]">
          BS12354-GOLD-1234
        </div>
        <div className="mt-3 flex justify-center">
          <div className="rounded-[0.62rem] bg-[linear-gradient(135deg,#ef3ba4_0%,#a62097_100%)] px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.04em] text-[#ffffff]">
            {'TẠO MÃ QR ➜'}
          </div>
        </div>
        <div className="relative mt-3 flex justify-center">
          <QrPattern />
          <div className="absolute right-[8px] top-[8px] flex h-7 w-7 items-center justify-center rounded-full bg-[#1fc316] shadow-[0_10px_20px_rgba(31,195,22,0.28)]">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path
                d="M4.2 9.2l2.8 2.8 6.8-7"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </VisualPanel>
);

const TaskRow: React.FC<{
  tone: 'done' | 'reward' | 'idle';
  label?: string;
}> = ({ tone, label }) => {
  const isDone = tone === 'done';
  const isReward = tone === 'reward';

  return (
    <div
      className={`flex items-center gap-2 rounded-[0.55rem] border px-2 py-1.5 ${
        isDone
          ? 'border-[#22c55e]/80 bg-[rgba(31,117,52,0.16)]'
          : isReward
            ? 'border-[#f4d22f]/55 bg-[rgba(118,79,0,0.16)]'
            : 'border-[#ffffff]/18 bg-[rgba(255,255,255,0.06)]'
      }`}
    >
      <div
        className={`flex h-4.5 w-4.5 items-center justify-center rounded-[0.26rem] ${
          isDone ? 'bg-[#57cb2e]' : isReward ? 'bg-[#d2b503]' : 'bg-[#75618f]'
        }`}
      >
        {isDone ? (
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7.3l2.4 2.4 5-5.2"
              stroke="#ffffff"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`h-[4px] rounded-full ${
            isDone ? 'bg-[#2bc857]' : isReward ? 'bg-[#ffffff]/86' : 'bg-[#9f93b0]'
          }`}
        />
        <div
          className={`mt-1.5 h-[3px] w-2/5 rounded-full ${
            isDone ? 'bg-[#b28fd4]' : isReward ? 'bg-[#b28fd4]' : 'bg-[#7d7091]'
          }`}
        />
      </div>
      {label ? (
        <div className="text-[7px] font-black text-[#f6db3a]">{label}</div>
      ) : isDone ? (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.3 6.2l2.1 2.1L9.7 3"
            stroke="#57cb2e"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  );
};

const StepTwoVisual: React.FC = () => (
  <VisualPanel className="pb-4">
    <OnboardingBrandStrip />
    <div className="mt-4 flex items-center justify-center">
      <div className="w-[150px] rounded-[1.5rem] border border-[#ffffff] bg-[rgba(55,8,91,0.24)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="relative mx-auto h-[5px] w-[96px] rounded-full bg-[#ffffff]/80">
          <div className="h-full w-[40px] rounded-full bg-[linear-gradient(90deg,#e13aa4_0%,#be31ac_100%)]" />
          <div className="absolute left-[49px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-[3px] bg-[#d8d8d8]" />
        </div>
        <div className="mt-2.5 space-y-1.5">
          <TaskRow tone="done" />
          <TaskRow tone="done" />
          <TaskRow tone="done" />
          <TaskRow tone="reward" label="+15" />
          <TaskRow tone="reward" label="+15" />
          <TaskRow tone="idle" />
        </div>
      </div>
    </div>
  </VisualPanel>
);

const StepThreeVisual: React.FC = () => (
  <VisualPanel className="pb-5">
    <OnboardingBrandStrip />
    <div className="relative mt-3 flex items-center justify-center">
      <img
        src={giftIllustration}
        alt="Voucher illustration"
        className="h-auto w-[146px] max-w-full object-contain drop-shadow-[0_16px_30px_rgba(255,255,255,0.06)]"
      />
    </div>
  </VisualPanel>
);

const OnboardingVisual: React.FC<{ index: number }> = ({ index }) => {
  if (index === 1) {
    return <StepTwoVisual />;
  }

  if (index === 2) {
    return <StepThreeVisual />;
  }

  return <StepOneVisual />;
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
  const titleLines = current.title.split('\n');

  return (
    <div className="relative z-[1] flex h-full min-h-full flex-col overflow-hidden px-6 pb-5 pt-7">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#5611b9_0%,#690fb8_42%,#c80f96_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[-6rem] -z-10 h-52 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_62%)]" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-[-6rem] -z-10 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(255,151,220,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-[-4rem] right-[-5rem] -z-10 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,118,203,0.16),transparent_72%)]" />

      <div className="relative mb-3 flex items-center justify-center">
        <div className="rounded-[0.78rem] border border-[#ff7cd5]/60 bg-[linear-gradient(180deg,#eb43ae_0%,#a62097_100%)] px-3.5 py-1.5 shadow-[0_14px_24px_rgba(255,51,170,0.2)]">
          <span className="text-[13px] font-extrabold text-[#ffffff]">
            {`B\u01b0\u1edbc ${slideIndex + 1}/${slides.length}`}
          </span>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="beauty-press absolute right-0 rounded-full px-0 py-1 text-[13px] font-normal text-[#f4dfff]"
        >
          {'B\u1ecf qua \u2192'}
        </button>
      </div>

      <div key={current.id} className="flex min-h-0 flex-1 flex-col items-center justify-center text-center beauty-fade-in">
        <div className="beauty-slide-up mb-5 flex w-full max-w-[27rem] items-center justify-center">
          <OnboardingVisual index={slideIndex} />
        </div>

        <h2
          className="beauty-slide-up max-w-[18rem] text-balance text-[21px] font-black leading-[1.14] text-[#ffffff]"
          style={{ animationDelay: '100ms' }}
        >
          {titleLines.map((line, index) => (
            <span
              key={`${current.id}-${index}`}
              className="block"
              style={current.id === 'mission' && index === 1 ? { marginTop: '0.32rem' } : undefined}
            >
              {line}
            </span>
          ))}
        </h2>

        <p
          className="beauty-slide-up mt-3 max-w-[290px] text-pretty text-[13px] font-medium leading-[1.58] text-[#fff3fb]"
          style={{ animationDelay: '200ms' }}
        >
          {current.desc}
        </p>
      </div>

      <div className="pt-4">
        <div className="mb-4 flex justify-center gap-2.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Chuy\u1ec3n \u0111\u1ebfn b\u01b0\u1edbc ${index + 1}`}
              onClick={() => onSelect(index)}
              className="beauty-press h-2.5 rounded-full transition-[width,background] duration-300"
              style={{
                width: index === slideIndex ? 42 : 10,
                background: index === slideIndex ? '#ffffff' : 'rgba(255,255,255,0.76)',
                opacity: index === slideIndex ? 1 : 0.85,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="beauty-press w-full rounded-[1.15rem] border-none px-4 py-[15px] text-[16px] font-extrabold"
          style={
            isLast
              ? {
                  color: '#ffffff',
                  background: 'linear-gradient(90deg, #612C8F 0%, #DF2757 58%, #5E2F8E 100%)',
                  boxShadow: '0 0 0 1px rgba(255,239,130,0.92), 0 0 20px rgba(255,234,128,0.2)',
                }
              : {
                  color: '#eb1493',
                  background: '#ffffff',
                  boxShadow: '0 14px 24px rgba(73,0,113,0.14)',
                }
          }
        >
          {isLast ? 'B\u1eaft \u0111\u1ea7u ngay \u2192' : 'Ti\u1ebfp theo \u2192'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
