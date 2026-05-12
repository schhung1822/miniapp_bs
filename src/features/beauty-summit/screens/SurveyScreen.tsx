import React from 'react';
import { ClipboardCheck, SendHorizonal } from 'lucide-react';

interface SurveyScreenProps {
  missionTitle: string;
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const SurveyScreen: React.FC<SurveyScreenProps> = ({
  missionTitle,
  value,
  loading,
  onChange,
  onSubmit,
}) => {
  const trimmedValue = value.trim();
  const disabled = loading || trimmedValue.length === 0;

  return (
    <div className="relative h-full overflow-y-auto bg-[linear-gradient(180deg,#5816b7_0%,#8916b1_38%,#bf118f_100%)] px-4 pb-8 pt-6 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="relative z-[1] mx-auto flex min-h-full max-w-[26rem] flex-col">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/18 bg-[#142132]">
            <ClipboardCheck className="h-6 w-6 text-white" strokeWidth={2.25} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/72">Khảo sát</div>
            <h1 className="mt-1 text-[1.45rem] font-black leading-tight text-white">{missionTitle}</h1>
          </div>
        </div>

        <div className="rounded-[14px] border border-white/14 bg-white/[0.08] p-4 shadow-[0_18px_44px_rgba(44,5,84,0.26)]">
          <label htmlFor="event-feedback" className="block text-sm font-bold text-[#142132]">
            Cảm nhận về sự kiện
          </label>
          <textarea
            id="event-feedback"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={8}
            maxLength={1200}
            placeholder="Chia sẻ ngắn gọn cảm nhận của bạn về trải nghiệm tại Beauty Summit 2026."
            className="mt-3 min-h-[13rem] w-full resize-none rounded-[12px] border border-white/16 bg-white px-4 py-3 text-[15px] leading-6 text-[#2D0658] outline-none placeholder:text-[#7e6298] focus:border-[#ff9bd7] focus:ring-2 focus:ring-[#ff9bd7]/40"
          />
          <div className="mt-2 text-right text-xs font-medium text-white/62">{value.length}/1200</div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[30px] bg-[#ED37A1] px-4 py-4 text-base font-black text-[#fff] shadow-[0_16px_36px_rgba(44,5,84,0.22)] transition disabled:cursor-not-allowed disabled:bg-white disabled:text-[#142132]"
        >
          <SendHorizonal className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
          Gửi khảo sát
        </button>
      </div>
    </div>
  );
};

export default SurveyScreen;
