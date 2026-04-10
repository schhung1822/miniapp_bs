import React from 'react';

import type { VoteBrand, VoteCategory } from '@/features/beauty-summit/types';
import { CloseIcon, VoteIcon } from '@/features/beauty-summit/icons';

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
    `${displayTitle} dang duoc de cu trong hang muc "${category.title}". Ban co the chon hoac huy binh chon ngay tai day.`;
  const voteCount = brand.voteCount ?? 0;
  const rank = brand.rank ?? Math.max(category.brands.findIndex((item) => item.id === brand.id) + 1, 1);
  const percentage = overallVoteCount > 0 ? Math.round((voteCount / overallVoteCount) * 100) : 0;

  return (
    <div className="absolute inset-0 z-40 bg-black/55 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-[#eadfd2] bg-[#fffdf9] px-4 pb-7 pt-3 shadow-[0_-24px_60px_rgba(36,22,41,0.18)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e3d8df]" />

        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {brand.logo || brand.link ? (
              <img
                src={brand.logo || brand.link}
                alt={displayTitle}
                className="h-16 w-16 shrink-0 rounded-[1rem] object-cover shadow-[0_10px_24px_rgba(36,22,41,0.12)]"
              />
            ) : (
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] text-lg font-black text-white shadow-[0_10px_24px_rgba(36,22,41,0.12)]"
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
                borderColor: `${category.color}33`,
                color: category.color,
                background: `${category.color}12`,
              }}
            >
              {category.title}
            </div>
            <div className="truncate text-[1.2rem] font-black text-[#241629]">{displayTitle}</div>
            <div className="mt-1 text-[12px] font-medium text-[#8a7e8b]">Đã đồng bộ dữ liệu</div>
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

        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-[1rem] border border-[#eadfd2] bg-white px-3 py-3.5 text-center">
            <div className="text-lg font-black" style={{ color: category.color }}>
              {voteCount}
            </div>
            <div className="mt-1 text-[11px] text-[#8a7e8b]">Lượt vote</div>
          </div>
          <div className="rounded-[1rem] border border-[#eadfd2] bg-white px-3 py-3.5 text-center">
            <div className="text-lg font-black text-[#241629]">
              #{rank}
            </div>
            <div className="mt-1 text-[11px] text-[#8a7e8b]">Xếp hạng</div>
          </div>
          <div className="rounded-[1rem] border border-[#eadfd2] bg-white px-3 py-3.5 text-center">
            <div className="text-lg font-black text-[#b8860b]">{category.brands.length}</div>
            <div className="mt-1 text-[11px] text-[#8a7e8b]">Ứng viên</div>
          </div>
        </div>

        <div className="mb-5 rounded-[1.1rem] border border-[#eadfd2] bg-white p-4 shadow-[0_10px_22px_rgba(184,134,11,0.06)]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8f9d]">
            Tóm tắt
          </div>
          <p className="text-sm leading-6 text-[#5b5360]">{summary}</p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-[#8a7e8b]">Tỷ lệ vote</span>
            <span className="font-semibold" style={{ color: category.color }}>
              {percentage}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#efe8f0]">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${category.color}, ${category.color}bb)`,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onVote}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
            voted ? 'border border-[#eadfd2] bg-white text-[#5f5662]' : '!text-white'
          }`}
          style={
            voted
              ? undefined
              : { background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)` }
          }
        >
          <VoteIcon color={voted ? '#5f5662' : '#fff'} />
          {voted ? 'Bỏ chọn mục này' : `Vote cho ${displayTitle}`}
        </button>
      </div>
    </div>
  );
};

export default BrandDetailDrawer;
