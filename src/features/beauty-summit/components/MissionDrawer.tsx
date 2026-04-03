import React from 'react';

import type { Mission } from '@/features/beauty-summit/types';
import { CameraIcon, CloseIcon, LinkIcon, QrIcon, VoteIcon } from '@/features/beauty-summit/icons';

interface MissionDrawerProps {
  mission: Mission | null;
  accentColor: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  onGoVote: () => void;
}

const MissionDrawer: React.FC<MissionDrawerProps> = ({
  mission,
  accentColor,
  value,
  onChange,
  onClose,
  onSubmit,
  onGoVote,
}) => {
  if (!mission) {
    return null;
  }

  const showInput = mission.proofType === 'link' || mission.proofType === 'code';
  const showUpload = mission.proofType === 'image';
  const isVoteAction = mission.proofType === 'vote';
  const isSurveyAction = mission.proofType === 'survey';
  const isReferralAction = mission.proofType === 'referral';

  const renderMissionIcon = (): React.ReactNode => {
    if (mission.proofType === 'image') {
      return <CameraIcon color={accentColor} size={24} />;
    }
    if (mission.proofType === 'link' || mission.proofType === 'referral') {
      return <LinkIcon color={accentColor} size={24} />;
    }
    if (mission.proofType === 'vote') {
      return <VoteIcon color={accentColor} size={24} />;
    }
    return <QrIcon color={accentColor} size={24} />;
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/55 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-white/8 bg-[#121320] px-5 pb-8 pt-3 shadow-[0_-24px_60px_rgba(0,0,0,0.45)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/12" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}2d, rgba(255,255,255,0.04))`,
                border: `1px solid ${accentColor}33`,
              }}
            >
              {renderMissionIcon()}
            </div>
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Chi tiết nhiệm vụ
              </div>
              <div className="text-lg font-bold text-white">{mission.title}</div>
              <div className="mt-1 max-w-[18rem] text-sm text-zinc-400">{mission.desc}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/6 p-2 text-zinc-400">
            <CloseIcon />
          </button>
        </div>

        <div className="mb-5 rounded-[1.15rem] border border-white/6 bg-white/[0.03] p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Cách thực hiện
          </div>
          <div className="space-y-3">
            {mission.steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: `${accentColor}2d`,
                    border: `1px solid ${accentColor}38`,
                    color: accentColor,
                  }}
                >
                  {index + 1}
                </div>
                <div className="text-sm leading-6 text-zinc-300">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {showInput ? (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-zinc-300">{mission.proofLabel}</label>
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={mission.proofPlaceholder ?? mission.proofLabel}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-500"
            />
          </div>
        ) : null}

        {showUpload ? (
          <button
            type="button"
            onClick={() => onChange('uploaded')}
            className="mb-4 flex w-full flex-col items-center rounded-[1.15rem] border border-dashed px-4 py-6 text-center"
            style={{ borderColor: `${accentColor}38`, background: `${accentColor}0d` }}
          >
            <CameraIcon color={accentColor} size={26} />
            <div className="mt-3 text-sm font-semibold text-white">{mission.proofLabel}</div>
            <div className="mt-1 text-xs text-zinc-400">
              {value ? 'Ảnh giả lập đã được gắn sẵn. Bấm xác nhận để hoàn thành.' : 'Nhấn để giả lập upload ảnh.'}
            </div>
          </button>
        ) : null}

        {isVoteAction ? (
          <button
            type="button"
            onClick={onGoVote}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-300/10 px-4 py-3 text-sm font-semibold text-violet-200"
          >
            <VoteIcon color="#d8b4fe" />
            Chuyển sang tab Vote
          </button>
        ) : null}

        {isSurveyAction ? (
          <button
            type="button"
            onClick={() => onChange('survey')}
            className="mb-4 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white"
          >
            Mở khảo sát giả lập
          </button>
        ) : null}

        {isReferralAction ? (
          <button
            type="button"
            onClick={() => onChange('https://beautysummit.vn/ref/invite')}
            className="mb-4 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white"
          >
            Sao chép link giới thiệu
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={showInput && value.trim().length === 0}
          className="w-full rounded-2xl px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-zinc-500"
          style={{
            background:
              showInput && value.trim().length === 0
                ? undefined
                : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
          }}
        >
          Xác nhận hoàn thành
        </button>
      </div>
    </div>
  );
};

export default MissionDrawer;
