import React from 'react';

import { CloseIcon, VoteIcon } from '@/features/beauty-summit/icons';
import type { VoteBrand, VoteCategory } from '@/features/beauty-summit/types';
import { apiConfig } from '@/lib/api-client';

interface BrandDetailDrawerProps {
  brand: VoteBrand | null;
  category: VoteCategory | null;
  overallVoteCount: number;
  voted: boolean;
  onClose: () => void;
  onVote: () => void;
}

const VOTE_IMAGE_PATTERN = /^(data:image\/|https?:\/\/|\/?(avatars|images|public)\/)/i;

const isVoteImage = (value?: string): boolean => VOTE_IMAGE_PATTERN.test(String(value ?? '').trim());

const getAbsoluteImageUrl = (url?: string): string | undefined => {
  if (!url) {
    return undefined;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^(https?:\/\/|data:image\/)/i.test(trimmed)) {
    return trimmed;
  }

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${apiConfig.baseURL}${path}`;
};

const buildVoteFallback = (value: string): string =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

const BrandDetailDrawer: React.FC<BrandDetailDrawerProps> = ({
  brand,
  category,
  overallVoteCount,
  voted,
  onClose,
  onVote,
}) => {
  if (!brand || !category) {
    return null;
  }

  const displayTitle = brand.product || brand.name;
  const summary =
    brand.summary ||
    `${displayTitle} đang được đề cử trong hạng mục "${category.title}". Bạn có thể chọn hoặc hủy bình chọn ngay tại đây.`;
  const voteCount = brand.voteCount ?? 0;
  const rank = brand.rank ?? Math.max(category.brands.findIndex((item) => item.id === brand.id) + 1, 1);
  const percentage = overallVoteCount > 0 ? Math.round((voteCount / overallVoteCount) * 100) : 0;
  const headerImageUrl = getAbsoluteImageUrl(brand.logo || brand.productImage || brand.link);
  const detailImageUrl = getAbsoluteImageUrl(brand.productImage || brand.logo || brand.link);

  return (
    <div
      className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(78,4,98,0.14)_0%,rgba(38,3,51,0.76)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col overflow-hidden rounded-t-[2rem] border-t border-white/20 bg-[linear-gradient(180deg,#cf41b2_0%,#ba28b7_28%,#a116bc_62%,#8e10bf_100%)] px-5 pb-6 pt-3 text-white shadow-[0_-24px_60px_rgba(92,4,89,0.34)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/28" />

        <div className="beauty-scroll min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              {headerImageUrl && isVoteImage(brand.logo || brand.productImage || brand.link) ? (
                <img
                  src={headerImageUrl}
                  alt={displayTitle}
                  className="h-[4.75rem] w-[4.75rem] shrink-0 rounded-[1rem] bg-white object-contain p-2.5 shadow-[0_14px_30px_rgba(106,9,108,0.22)]"
                />
              ) : (
                <div
                  className="flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-[1rem] border border-white/28 bg-white/12 text-[1.35rem] font-black text-white shadow-[0_14px_30px_rgba(106,9,108,0.22)]"
                  style={{ background: `linear-gradient(135deg, ${category.color}, #ff5cbc)` }}
                >
                  {buildVoteFallback(displayTitle || 'VT') || 'V'}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="rounded-full truncate border border-white/24 bg-[#e45fa7] py-1 text-center text-[0.82rem] font-semibold text-white shadow-[0_10px_20px_rgba(131,4,124,0.18)]">
                  {category.title}
                </div>
                <div className="text-[1.2rem] line-clamp-2 font-black leading-tight text-white mt-1">
                  {displayTitle}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-white/26 bg-white/10 p-2 text-black shadow-[0_10px_20px_rgba(88,8,102,0.18)]"
              aria-label="Đóng chi tiết bình chọn"
            >
              <CloseIcon color="currentColor" />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-3 gap-3">
            <div className="rounded-[1rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,78,194,0.28)_0%,rgba(157,19,183,0.24)_100%)] px-3 py-3 text-center shadow-[0_14px_26px_rgba(104,7,113,0.18)]">
              <div className="text-[1.2rem] font-black leading-none text-white">{voteCount}</div>
              <div className="mt-1 text-[0.86rem] font-semibold text-white/88">Lượt vote</div>
            </div>
            <div className="rounded-[1rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,78,194,0.28)_0%,rgba(157,19,183,0.24)_100%)] px-3 py-3 text-center shadow-[0_14px_26px_rgba(104,7,113,0.18)]">
              <div className="text-[1.2rem] font-black leading-none text-white">#{rank}</div>
              <div className="mt-1 text-[0.86rem] font-semibold text-white/88">Xếp hạng</div>
            </div>
            <div className="rounded-[1rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,78,194,0.28)_0%,rgba(157,19,183,0.24)_100%)] px-3 py-3 text-center shadow-[0_14px_26px_rgba(104,7,113,0.18)]">
              <div className="text-[1.2rem] font-black leading-none text-white">{category.brands.length}</div>
              <div className="mt-1 text-[0.86rem] font-semibold text-white/88">Ứng viên</div>
            </div>
          </div>

          <div className="mb-5 rounded-[1.25rem] border border-white/18 bg-[linear-gradient(180deg,rgba(250,24,147,0.2)_0%,rgba(122,8,182,0.2)_100%)] p-4 shadow-[0_18px_34px_rgba(99,6,107,0.18)]">
            <div className="grid grid-cols-[104px_minmax(0,1fr)] items-start gap-4">
              <div className="flex min-h-[7.25rem] items-center justify-center rounded-[1rem] bg-white/10 px-2">
                {detailImageUrl && isVoteImage(brand.productImage || brand.logo || brand.link) ? (
                  <img
                    src={detailImageUrl}
                    alt={displayTitle}
                    className="h-[6.5rem] w-full object-contain"
                  />
                ) : (
                  <div
                    className="flex h-[5.75rem] w-[5.75rem] items-center justify-center rounded-[1rem] border border-white/24 text-[1.25rem] font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${category.color}, #ff5cbc)` }}
                  >
                    {buildVoteFallback(displayTitle || 'VT') || 'V'}
                  </div>
                )}
              </div>

              <div className="border-[#fff] border-l-1 pl-3">
                <div className="mb-1 text-[1rem] font-bold text-white">Giới thiệu</div>
                <div className="beauty-scroll max-h-[8.75rem] overflow-y-auto pr-1">
                  <p className="whitespace-pre-wrap break-words text-[0.9rem] leading-5 text-white/92">{summary}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between text-[0.92rem] font-semibold text-white/92">
            <span>Tỷ lệ bình chọn</span>
            <span>{percentage}%</span>
          </div>
          <div className="mb-6 h-2.5 rounded-full bg-white/28">
            <div
              className="h-2.5 rounded-full bg-[linear-gradient(90deg,#ffffff_0%,#ffd8f3_34%,#ffffff_100%)] shadow-[0_6px_12px_rgba(255,255,255,0.26)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onVote}
          className={`mt-1 truncate flex w-full items-center justify-center gap-2 rounded-[0.5rem] border px-4 py-3.5 text-[1rem] font-bold shadow-[0_14px_26px_rgba(111,5,110,0.22)] ${
            voted
              ? 'border-white/26 bg-white/14 text-white'
              : 'border-white/40 bg-[linear-gradient(180deg,#ff1d8c_0%,#f1127e_100%)] text-white'
          }`}
        >
          <VoteIcon color="currentColor" />
          {voted ? 'Bỏ chọn mục này' : `Vote cho ${displayTitle}`}
        </button>
      </div>
    </div>
  );
};

export default BrandDetailDrawer;
