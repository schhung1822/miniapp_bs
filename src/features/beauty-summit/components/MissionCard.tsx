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
      className={`beauty-slide-up flex w-full items-center gap-3 rounded-[1.4rem] border px-4 py-3.5 text-left transition ${
        completed
          ? 'border-[#1d5b45] bg-[#0d211a]'
          : 'border-white/8 bg-[#15161f] hover:border-white/12 hover:bg-[#191a24]'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] ${
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
        <div
          className={`text-[13px] font-bold ${
            completed ? 'text-[#4ddd87] line-through decoration-[#4ddd87]/80 decoration-[1.5px]' : 'text-white'
          }`}
        >
          {mission.title}
        </div>
        <div className="mt-0.5 truncate text-[11px] font-normal text-zinc-500">{mission.desc}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div
          className={`rounded-[0.75rem] px-2.5 py-1.5 text-[11px] font-black leading-none ${
            completed ? 'bg-[#163a29] text-[#4ddd87]' : 'bg-[#2c2510] text-[#ffd44d]'
          }`}
        >
          +{mission.points}
        </div>
        {!completed ? <ChevronRightIcon color="#4f5059" /> : null}
      </div>
    </button>
  );
};

export default MissionCard;
