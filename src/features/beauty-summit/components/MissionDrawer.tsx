import React from 'react';
import { chooseImage } from 'zmp-sdk/apis';

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

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const showInput = mission.proofType === 'link' || mission.proofType === 'code';
  const showUpload = mission.proofType === 'image';
  const isVoteAction = mission.proofType === 'vote';
  const isSurveyAction = mission.proofType === 'survey';
  const isReferralAction = mission.proofType === 'referral';
  const disableSubmit = showInput && value.trim().length === 0;
  const hasUploadedImage = showUpload && value.trim().length > 0;

  const handleChooseImage = async (): Promise<void> => {
    try {
      const result = await chooseImage({
        sourceType: ['album'],
        count: 1,
      });
      const selectedImage = result.filePaths?.[0];
      if (selectedImage) {
        onChange(selectedImage);
        return;
      }
    } catch {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    if (value.startsWith('blob:')) {
      URL.revokeObjectURL(value);
    }

    onChange(URL.createObjectURL(selectedFile));
    event.target.value = '';
  };

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
      <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-[#eadfd2] bg-[#fffdf9] px-4 pb-7 pt-3 shadow-[0_-24px_60px_rgba(36,22,41,0.18)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e3d8df]" />

        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}1e, #ffffff)`,
                border: `1px solid ${accentColor}33`,
              }}
            >
              {renderMissionIcon()}
            </div>
            <div className="min-w-0">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a8f9d]">
                Chi tiết nhiệm vụ
              </div>
              <div className="text-[1.05rem] font-bold text-[#241629]">{mission.title}</div>
              <div className="mt-1 text-sm leading-6 text-[#7a7280]">{mission.desc}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#eadfd2] bg-white p-2 text-[#8a7e8b]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mb-4 rounded-[1.15rem] border border-[#eadfd2] bg-white p-4 shadow-[0_10px_22px_rgba(184,134,11,0.06)]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8f9d]">
            Cách thực hiện
          </div>
          <div className="space-y-3">
            {mission.steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: `${accentColor}1c`,
                    border: `1px solid ${accentColor}38`,
                    color: accentColor,
                  }}
                >
                  {index + 1}
                </div>
                <div className="text-sm leading-6 text-[#534a56]">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {showInput ? (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-[#5f5662]">
              {mission.proofLabel}
            </label>
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={mission.proofPlaceholder ?? mission.proofLabel}
              className="w-full rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm text-[#241629] placeholder:text-[#a69ba8]"
            />
          </div>
        ) : null}

        {showUpload ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void handleFileInputChange(event);
              }}
            />
            <button
              type="button"
              onClick={() => {
                void handleChooseImage();
              }}
              className="mb-4 flex w-full flex-col items-center rounded-[1.15rem] border border-dashed px-4 py-5 text-center"
              style={{ borderColor: `${accentColor}38`, background: `${accentColor}0d` }}
            >
              {hasUploadedImage ? (
                <>
                  <img
                    src={value}
                    alt="Mission proof"
                    className="h-24 w-24 rounded-[1rem] object-cover shadow-[0_10px_22px_rgba(184,134,11,0.14)]"
                  />
                  <div className="mt-3 text-xs text-[#7a7280]">Nhấn để chọn lại ảnh khác.</div>
                </>
              ) : (
                <>
                  <CameraIcon color={accentColor} size={26} />
                  <div className="mt-3 text-sm font-semibold text-[#241629]">{mission.proofLabel}</div>
                  <div className="mt-1 text-xs text-[#7a7280]">
                    Chọn ảnh từ thư viện hoặc máy của bạn.
                  </div>
                </>
              )}
            </button>
          </>
        ) : null}

        {isVoteAction ? (
          <button
            type="button"
            onClick={onGoVote}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold"
            style={{
              borderColor: `${accentColor}2e`,
              background: `${accentColor}12`,
              color: accentColor,
            }}
          >
            <VoteIcon color={accentColor} />
            Chuyển sang tab Vote
          </button>
        ) : null}

        {isSurveyAction ? (
          <button
            type="button"
            onClick={() => onChange('survey')}
            className="mb-4 flex w-full items-center justify-center rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold text-[#241629]"
          >
            Mở khảo sát
          </button>
        ) : null}

        {isReferralAction ? (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText("abc").catch(() => {});
              onChange("abc");
            }}
            className="mb-4 flex w-full items-center justify-center rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold text-[#241629]"
          >
            {value === "abc" ? "Đã sao chép link" : "Sao chép link giới thiệu"}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={disableSubmit}
          className="w-full rounded-2xl px-4 py-3 text-sm font-bold !text-white transition disabled:cursor-not-allowed disabled:bg-[#ece7ec] disabled:!text-[#a69ba8]"
          style={{
            background: disableSubmit
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
