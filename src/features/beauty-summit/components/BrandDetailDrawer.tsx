import React from 'react';

import type { VoteBrand, VoteCategory } from '@/features/beauty-summit/types';
import { CloseIcon, VoteIcon } from '@/features/beauty-summit/icons';

interface BrandDetailDrawerProps {
  brand: VoteBrand | null;
  category: VoteCategory | null;
  voted: boolean;
  onClose: () => void;
  onVote: () => void;
}

const BrandDetailDrawer: React.FC<BrandDetailDrawerProps> = ({
  brand,
  category,
  voted,
  onClose,
  onVote,
}) => {
  if (!brand || !category) {
    return null;
  }

  const seed = brand.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const voteCount = (seed % 800) + 120 + (voted ? 1 : 0);
  const percentage = Math.min(98, Math.round((voteCount / (voteCount + 220)) * 100));

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-white/8 bg-[#121320] px-5 pb-8 pt-3 shadow-[0_-24px_60px_rgba(0,0,0,0.45)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/12" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ borderColor: `${category.color}33`, color: category.color }}>
              {category.title}
            </div>
            <div className="text-2xl font-black text-white">{brand.name}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/6 p-2 text-zinc-400">
            <CloseIcon />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-[1.1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
            <div className="text-xl font-black" style={{ color: category.color }}>
              {voteCount}
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">lượt vote</div>
          </div>
          <div className="rounded-[1.1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
            <div className="text-xl font-black text-white">#{Math.floor(voteCount / 100) + 1}</div>
            <div className="mt-1 text-[11px] text-zinc-400">xếp hạng</div>
          </div>
          <div className="rounded-[1.1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
            <div className="text-xl font-black text-amber-200">{category.brands.length}</div>
            <div className="mt-1 text-[11px] text-zinc-400">ứng viên</div>
          </div>
        </div>

        <div className="mb-5 rounded-[1.1rem] border border-white/6 bg-white/[0.03] p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Giới thiệu
          </div>
          <p className="text-sm leading-6 text-zinc-300">
            {brand.name} đang được đề cử trong hạng mục "{category.title}" tại Beauty Summit 2026.
            Mở khóa lượt vote của bạn để ủng hộ thương hiệu hoặc sản phẩm này ngay trong app.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Tỷ lệ bình chọn</span>
            <span className="font-semibold" style={{ color: category.color }}>
              {percentage}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/8">
            <div
              className="h-2 rounded-full"
              style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${category.color}, ${category.color}bb)` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onVote}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
            voted ? 'bg-white/8 text-zinc-300' : 'text-white'
          }`}
          style={voted ? undefined : { background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)` }}
        >
          <VoteIcon color={voted ? '#d4d4d8' : '#fff'} />
          {voted ? 'Đã vote - bấm để hủy' : `Vote cho ${brand.name}`}
        </button>
      </div>
    </div>
  );
};

export default BrandDetailDrawer;
