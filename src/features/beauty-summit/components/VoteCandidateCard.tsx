import React from 'react';

import type { VoteBrand, VoteCategory } from '@/features/beauty-summit/types';
import { ThumbsUpIcon } from '@/features/beauty-summit/icons';
import { apiConfig } from '@/lib/api-client';

interface VoteCandidateCardProps {
  category: VoteCategory;
  brand: VoteBrand;
  selected: boolean;
  voteCount: number;
  highlight?: boolean;
  medalNumber?: number;
  onOpenBrand: (category: VoteCategory, brand: VoteBrand) => void;
  onToggleVote: (category: VoteCategory, brand: VoteBrand) => void;
}

const VOTE_IMAGE_PATTERN = /^(data:image\/|https?:\/\/|\/?(avatars|images|public)\/)/i;

const isVoteImage = (value?: string): boolean => VOTE_IMAGE_PATTERN.test(String(value ?? '').trim());

const getAbsoluteImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^(https?:\/\/|data:image\/)/i.test(trimmed)) return trimmed;
  // If it's a relative path starting with avatars/ or images/, give it a slash
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  // For dev environment and API resolution
  return `${apiConfig.baseURL}${path}`;
};

const buildVoteFallback = (value: string): string =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

const VoteCandidateCard: React.FC<VoteCandidateCardProps> = ({
  category,
  brand,
  selected,
  voteCount,
  highlight = false,
  medalNumber,
  onOpenBrand,
  onToggleVote,
}) => {
  const title = brand.product || brand.name;

  return (
    <div className="relative">
      {medalNumber ? (
        <div
          className={`!text-white absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-lg font-black shadow-[0_10px_20px_rgba(36,22,41,0.2)] ${
            medalNumber === 1
              ? 'bg-[linear-gradient(135deg,#f5b700,#d68b00)]'
              : medalNumber === 2
                ? 'bg-[linear-gradient(135deg,#cdd4e3,#8e99b0)]'
                : 'bg-[linear-gradient(135deg,#d97706,#92400e)]'
          }`}
        >
          {medalNumber}
        </div>
      ) : null}

      <div
        className={`overflow-hidden rounded-[1.2rem] border bg-white shadow ${
          highlight ? 'border-[#f0c648]' : 'border-[#eadfd2]'
        }`}
      >
        <div className="flex items-center gap-3 px-2.5 py-2.5">
          <button
            type="button"
            onClick={() => onOpenBrand(category, brand)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            {isVoteImage(brand.logo || brand.link) ? (
              <img
                src={getAbsoluteImageUrl(brand.logo || brand.link)}
                alt={title}
                className="h-[58px] w-[58px] shrink-0 rounded-[0.9rem] object-cover shadow-[0_6px_14px_rgba(36,22,41,0.1)]"
              />
            ) : (
              <div
                className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[0.9rem] text-[1.2rem] font-black text-white shadow-[0_6px_14px_rgba(36,22,41,0.1)]"
                style={{
                  background: `linear-gradient(135deg, ${category.color}, ${category.color}bb)`,
                }}
              >
                {buildVoteFallback(title || 'VT')}
              </div>
            )}

            <div className="min-w-0">
              <div className="mt-1 truncate text-[0.95rem] font-black text-[#1f2937]">{title}</div>
              <div className="inline-flex max-w-full rounded bg-[#f4e8ff] px-1.5 py-0.5 text-[11px] font-semibold text-[#8b34ff]">
                <span className="truncate">{category.title}</span>
              </div>
            </div>
          </button>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-baseline gap-1 text-right">
              <span className="text-[0.95rem] font-bold text-[#111827]">{voteCount}</span>
              <span className="text-[11px] text-[#8a7e8b]">vote</span>
            </div>
            <button
              type="button"
              onClick={() => onToggleVote(category, brand)}
              className={`inline-flex min-w-[82px] items-center justify-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all shadow-sm ${
                selected
                  ? 'bg-gradient-to-r from-[#a855f7] to-[#ec4899] !text-white'
                  : 'border border-[#ece7f2] bg-[#faf8fc] text-[#4a5568]'
              }`}
            >
              <ThumbsUpIcon size={12} color={selected ? '#ffffff' : '#4a5568'} />
              <span>{selected ? 'Voted' : 'Vote'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteCandidateCard;
