import React from 'react';
import { chooseImage } from 'zmp-sdk/apis';

import { CameraIcon, CloseIcon, LinkIcon, QrIcon, VoteIcon } from '@/features/beauty-summit/icons';
import type { Mission } from '@/features/beauty-summit/types';

interface MissionDrawerProps {
  mission: Mission | null;
  accentColor: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onOpenSurvey: () => void;
  onSubmit: () => void;
  onGoVote: () => void;
}

const MissionDrawer: React.FC<MissionDrawerProps> = ({
  mission,
  accentColor,
  value,
  onChange,
  onClose,
  onOpenSurvey,
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
  const disableSubmit = (showInput || isSurveyAction || isReferralAction) && value.trim().length === 0;
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

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
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
    <div
      className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[1.85rem] border-t border-[#ff96da]/18 bg-[#f9f9f9] px-4 pb-7 pt-3 text-white shadow-[0_-24px_60px_rgba(15,11,31,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/14" />

        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              style={{
                background: `linear-gradient(135deg, ${accentColor}22, rgba(255,255,255,0.04))`,
                borderColor: `${accentColor}44`,
              }}
            >
              {renderMissionIcon()}
            </div>
            <div className="min-w-0">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2D0658]">
                Chi tiết nhiệm vụ
              </div>
              <div className="text-[1.02rem] font-black text-[#2D0658]">{mission.title}</div>
              <div className="mt-1 text-sm leading-6 text-[#2D0658]">{mission.desc}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/12 bg-white/[0.06] p-2 text-black"
            aria-label="Đóng nhiệm vụ"
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <div className="mb-4 rounded-[1rem] border border-white/10 bg-[#fff] p-4 shadow-[0_18px_34px_rgba(8,7,18,0.2)] text-black">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] ">Cách thực hiện</div>
          <div className="space-y-3">
            {mission.steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                  style={{
                    background: `${accentColor}1f`,
                    border: `1px solid ${accentColor}44`,
                    color: accentColor,
                  }}
                >
                  {index + 1}
                </div>
                <div className="text-sm leading-6">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {showInput ? (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-[#142132]">{mission.proofLabel}</label>
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={mission.proofPlaceholder ?? mission.proofLabel}
              className="w-full rounded-[1rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/28"
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
              className="mb-4 flex w-full flex-col items-center rounded-[16px] border border-dashed px-4 py-5 text-center"
              style={{ borderColor: `${accentColor}3d`, background: `${accentColor}12` }}
            >
              {hasUploadedImage ? (
                <>
                  <img
                    src={value}
                    alt="Mission proof"
                    className="h-24 w-24 rounded-[1rem] object-cover shadow-[0_10px_22px_rgba(0,0,0,0.24)]"
                  />
                  <div className="mt-3 text-xs text-white/62">Nhấn để chọn lại ảnh khác.</div>
                </>
              ) : (
                <>
                  <CameraIcon color={accentColor} size={26} />
                  <div className="mt-3 text-sm font-semibold text-[#1a1a2e]">{mission.proofLabel}</div>
                  <div className="mt-1 text-xs text-[#2D0658]">Chọn ảnh từ thư viện hoặc máy của bạn.</div>
                </>
              )}
            </button>
          </>
        ) : null}

        {isVoteAction ? (
          <button
            type="button"
            onClick={onGoVote}
            className="mb-4 flex w-full text-[#2D0658] items-center justify-center gap-2 rounded-[1rem] border px-4 py-3 text-sm font-semibold"
            style={{
              borderColor: `${accentColor}35`,
              background: `${accentColor}16`,
              color: '#2D0658',
            }}
          >
            <VoteIcon color='#2D0658' />
            Chuyển sang tab Vote
          </button>
        ) : null}

        {isSurveyAction ? (
          <button
            type="button"
            onClick={onOpenSurvey}
            className="mb-4 flex w-full items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-[#2D0658]"
          >
            Mở khảo sát
          </button>
        ) : null}

        {isReferralAction ? (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText('abc').catch(() => {});
              onChange('abc');
            }}
            className="mb-4 flex w-full items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-[#2D0658]"
          >
            {value === 'abc' ? 'Đã sao chép link' : 'Sao chép link giới thiệu'}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={disableSubmit}
          className="w-full rounded-[1rem] px-4 py-3 text-sm text-[#2D0658] transition disabled:cursor-not-allowed disabled:bg-[#ccc] disabled:text-[#142132]"
          style={
            disableSubmit
              ? undefined
              : { background: 'linear-gradient(135deg, #ff4fb6 0%, #a53cff 100%); color: #fff' }
          }
        >
          Xác nhận hoàn thành
        </button>
      </div>
    </div>
  );
};

export default MissionDrawer;
