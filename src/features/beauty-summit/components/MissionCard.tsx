import React from 'react';

import type { Mission } from '@/features/beauty-summit/types';
import { CameraIcon, LinkIcon, MissionIcon, QrIcon, VoteIcon } from '@/features/beauty-summit/icons';

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
      return <MissionIcon color="#fff" />;
    }

    if (mission.checkin || mission.proofType === 'scan') {
      return <QrIcon color={accentColor} />;
    }

    if (mission.proofType === 'image') {
      return <CameraIcon color={accentColor} />;
    }

    if (mission.proofType === 'link' || mission.proofType === 'referral') {
      return <LinkIcon color={accentColor} />;
    }

    if (mission.proofType === 'vote') {
      return <VoteIcon color={accentColor} />;
    }

    return <MissionIcon color={accentColor} />;
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (!completed) {
          onOpen(mission);
        }
      }}
      className={`beauty-slide-up flex w-full items-center gap-3 rounded-[1.1rem] border p-4 text-left transition ${
        completed
          ? 'border-emerald-400/20 bg-emerald-400/8'
          : 'border-white/6 bg-white/[0.03] hover:border-white/12 hover:bg-white/[0.045]'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          completed ? 'bg-[linear-gradient(135deg,#22c55e,#4ade80)]' : ''
        }`}
        style={
          completed
            ? undefined
            : {
                background: `linear-gradient(135deg, ${accentColor}2b, rgba(255,255,255,0.03))`,
                border: `1px solid ${accentColor}33`,
              }
        }
      >
        {renderIcon()}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`text-sm font-semibold ${completed ? 'text-emerald-300 line-through opacity-80' : 'text-white'}`}
        >
          {mission.title}
        </div>
        <div className="mt-1 truncate text-[12px] font-normal text-zinc-400">{mission.desc}</div>
      </div>
      <div className="shrink-0 text-right">
        <div
          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
            completed ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-300/10 text-amber-200'
          }`}
        >
          +{mission.points} BP
        </div>
      </div>
    </button>
  );
};

export default MissionCard;
