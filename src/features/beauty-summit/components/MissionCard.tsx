import React from 'react';

import type { Mission } from '@/features/beauty-summit/types';
import {
  CameraIcon,
  ChevronRightIcon,
  LinkIcon,
  MissionIcon,
  QrIcon,
  StarIcon,
  VoteIcon,
} from '@/features/beauty-summit/icons';

interface MissionCardProps {
  mission: Mission;
  completed: boolean;
  accentColor: string;
  delay: number;
  onOpen: (mission: Mission) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  completed,
  accentColor,
  delay,
  onOpen,
}) => {
  const actionLabel =
    mission.auto || mission.checkin
      ? 'Tự động'
      : mission.proofType === 'vote'
        ? 'Vote'
        : mission.proofType === 'image'
          ? 'Upload'
          : mission.proofType === 'survey'
            ? 'Khảo sát'
            : 'Gửi bằng chứng';

  const renderIcon = (): React.ReactNode => {
    if (completed) {
      return <MissionIcon size={22} color="#fff" />;
    }

    if (mission.checkin || mission.proofType === 'scan') {
      return <QrIcon size={22} color={accentColor} />;
    }

    if (mission.proofType === 'image') {
      return <CameraIcon size={22} color={accentColor} />;
    }

    if (mission.proofType === 'link') {
      return <LinkIcon size={22} color={accentColor} />;
    }

    if (mission.proofType === 'referral') {
      return <StarIcon size={20} color={accentColor} />;
    }

    if (mission.proofType === 'vote') {
      return <VoteIcon size={22} color={accentColor} />;
    }

    return <MissionIcon size={22} color={accentColor} />;
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (!completed) {
          onOpen(mission);
        }
      }}
      className={`beauty-slide-up flex w-full items-center gap-3 rounded-[1.25rem] border px-3.5 py-3 text-left shadow-[0_16px_30px_rgba(68,6,109,0.22)] transition ${
        completed
          ? 'border-[#c58fff] bg-[linear-gradient(135deg,rgba(114,18,157,0.96),rgba(83,11,125,0.96))]'
          : 'border-[#ff73c8] bg-[linear-gradient(135deg,rgba(129,21,165,0.96),rgba(92,12,143,0.96))] hover:border-[#ffc4f2] hover:bg-[linear-gradient(135deg,rgba(139,25,178,0.98),rgba(100,16,156,0.98))]'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] ${
          completed ? 'bg-[linear-gradient(135deg,#ff69c6,#8c63ff)]' : ''
        }`}
        style={
          completed
            ? undefined
            : {
                background: `linear-gradient(135deg, ${accentColor}36, rgba(255,255,255,0.08))`,
                border: '1px solid rgba(255,255,255,0.18)',
              }
        }
      >
        {renderIcon()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <div
            className={`min-w-0 truncate text-[13px] font-bold ${
              completed ? 'text-[#ffe8ff]' : 'text-[#ffffff]'
            }`}
          >
            {mission.title}
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              completed
                ? 'bg-[rgba(255,255,255,0.12)] text-[#f7d8ff]'
                : 'bg-[rgba(110,16,139,0.88)] text-[#ffd8ff]'
            }`}
          >
            {completed ? 'Đã xong' : actionLabel}
          </span>
        </div>
        <div className="truncate text-[11px] font-normal text-[#f2d4ff]">{mission.desc}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-[0.5rem] text-[1.02rem] leading-none tracking-[-0.03em] ${
            completed
              ? 'border border-white/14 bg-[rgba(255,255,255,0.5)] text-[#ffffff]'
              : 'border border-white/18 bg-[linear-gradient(180deg,rgba(168,36,199,0.3)_0%,rgba(113,15,145,0.9)_100%)] text-[#ffffff] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
          }`}
        >
          +{mission.points}
        </div>
        {!completed ? <ChevronRightIcon color="#f3c9ff" /> : null}
      </div>
    </button>
  );
};

export default MissionCard;
