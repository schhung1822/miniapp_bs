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
            : 'Gửi bảng chứng';

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
      className={`beauty-slide-up flex w-full items-center gap-3 rounded-[1.25rem] border px-3.5 py-3 text-left shadow-[0_10px_22px_rgba(184,134,11,0.06)] transition ${
        completed
          ? 'border-[#bce8cb] bg-[#effdf5]'
          : 'border-[#eadfd2] bg-white hover:border-[#e0c79b] hover:bg-[#fffaf2]'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] ${
          completed ? 'bg-[linear-gradient(135deg,#2fd36f,#30c96f)]' : ''
        }`}
        style={
          completed
            ? undefined
            : {
                background: `linear-gradient(135deg, ${accentColor}24, rgba(255,255,255,0.03))`,
                border: `1px solid ${accentColor}26`,
              }
        }
      >
        {renderIcon()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <div
            className={`min-w-0 truncate text-[13px] font-bold ${
              completed ? 'text-[#16a05d]' : 'text-[#2f2433]'
            }`}
          >
            {mission.title}
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              completed ? 'bg-[#dff8e9] text-[#16a05d]' : 'bg-[#f7f0f7] text-[#8c7990]'
            }`}
          >
            {completed ? 'Đã xong' : actionLabel}
          </span>
        </div>
        <div className="truncate text-[11px] font-normal text-[#7a7280]">{mission.desc}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div
          className={`rounded-[0.75rem] px-2.5 py-1.5 text-[11px] font-black leading-none ${
            completed ? 'bg-[#dff8e9] text-[#16a05d]' : 'bg-[#fff2cc] text-[#b8860b]'
          }`}
        >
          +{mission.points}
        </div>
        {!completed ? <ChevronRightIcon color="#a69ba8" /> : null}
      </div>
    </button>
  );
};

export default MissionCard;
