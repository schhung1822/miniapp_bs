import React from 'react';

import { CloseIcon, VoteIcon } from '@/features/beauty-summit/icons';
import type { VoteBrand, VoteCategory } from '@/features/beauty-summit/types';

interface BrandDetailDrawerProps {
  brand: VoteBrand | null;
  category: VoteCategory | null;
  overallVoteCount: number;
  voted: boolean;
  onClose: () => void;
  onVote: () => void;
}

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

  return (
    <div
      className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-[1.85rem] border-t border-[#ff96da]/18 bg-[linear-gradient(180deg,#241f3c_0%,#19172c_100%)] px-4 pb-7 pt-3 text-white shadow-[0_-24px_60px_rgba(15,11,31,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/14" />

        <div className="beauty-scroll min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              {brand.logo || brand.link ? (
                <img
                  src={brand.logo || brand.link}
                  alt={displayTitle}
                  className="h-16 w-16 shrink-0 rounded-[1rem] object-cover shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
                />
              ) : (
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] text-lg font-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
                  style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}bb)` }}
                >
                  {displayTitle
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join('')}
                </div>
              )}
              <div className="min-w-0">
                <div
                  className="mb-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold"
                  style={{
                    borderColor: `${category.color}44`,
                    color: category.color,
                    background: `${category.color}18`,
                  }}
                >
                  {category.title}
                </div>
                <div className="truncate text-[1.15rem] font-black text-white">{displayTitle}</div>
                <div className="mt-1 text-[12px] font-medium text-white/56">Đã đồng bộ dữ liệu</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/12 bg-white/[0.06] p-2 text-white/70"
              aria-label="Đóng chi tiết bình chọn"
            >
              <CloseIcon color="currentColor" />
            </button>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3.5 text-center">
              <div className="text-lg font-black" style={{ color: category.color }}>
                {voteCount}
              </div>
              <div className="mt-1 text-[11px] text-white/52">Lượt vote</div>
            </div>
            <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3.5 text-center">
              <div className="text-lg font-black text-white">#{rank}</div>
              <div className="mt-1 text-[11px] text-white/52">Xếp hạng</div>
            </div>
            <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3.5 text-center">
              <div className="text-lg font-black text-[#ffd970]">{category.brands.length}</div>
              <div className="mt-1 text-[11px] text-white/52">Ứng viên</div>
            </div>
          </div>

          <div className="mb-5 rounded-[1.15rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_34px_rgba(8,7,18,0.16)]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/48">Tóm tắt</div>
            <div className="beauty-scroll max-h-[9.5rem] overflow-y-auto pr-1">
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/74">{summary}</p>
            </div>
            <div className="mb-2 mt-4 flex items-center justify-between text-xs">
              <span className="text-white/48">Tỷ lệ vote</span>
              <span className="font-semibold" style={{ color: category.color }}>
                {percentage}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${category.color}, ${category.color}bb)`,
                }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onVote}
          className={`mt-1 flex w-full items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-sm font-bold ${
            voted ? 'border border-white/10 bg-white/[0.05] text-white/82' : 'text-white'
          }`}
          style={voted ? undefined : { background: 'linear-gradient(135deg,#ff4fb6 0%,#a53cff 100%)' }}
        >
          <VoteIcon color={voted ? '#ffffff' : '#fff'} />
          {voted ? 'Bỏ chọn mục này' : `Vote cho ${displayTitle}`}
        </button>
      </div>
    </div>
  );
};

export default BrandDetailDrawer;
