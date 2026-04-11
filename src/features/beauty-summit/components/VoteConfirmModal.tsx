import React from 'react';

import { CloseIcon, VoteIcon } from '@/features/beauty-summit/icons';
import type { VoteBrand, VoteCategory } from '@/features/beauty-summit/types';

interface VoteConfirmModalProps {
  open: boolean;
  brand: VoteBrand | null;
  category: VoteCategory | null;
  voted: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VoteConfirmModal: React.FC<VoteConfirmModalProps> = ({
  open,
  brand,
  category,
  voted,
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!open || !brand || !category) {
    return null;
  }

  const displayTitle = brand.product || brand.name;
  const confirmLabel = voted ? 'Xác nhận hủy' : 'Xác nhận vote';
  const description = voted
    ? `Bạn có chắc chắn muốn hủy vote cho "${displayTitle}" trong hạng mục "${category.title}" không?`
    : `Bạn có chắc chắn muốn vote cho "${displayTitle}" trong hạng mục "${category.title}" không?`;

  return (
    <div className="absolute inset-0 z-[70] bg-black/55 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[1.6rem] border border-[#eadfd2] bg-[#fffdf9] p-5 shadow-[0_24px_60px_rgba(36,22,41,0.24)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] text-white shadow-[0_10px_24px_rgba(36,22,41,0.12)]"
              style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)` }}
            >
              <VoteIcon color="#fff" />
            </div>
            <div className="min-w-0">
              <div className="text-[0.95rem] font-black text-[#241629]">
                {voted ? 'Xác nhận hủy vote' : 'Xác nhận bình chọn'}
              </div>
              <div className="mt-1 text-[12px] font-medium text-[#8a7e8b]">{category.title}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-[#eadfd2] bg-white p-2 text-[#8a7e8b] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Đóng xác nhận vote"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="rounded-[1.15rem] border border-[#eadfd2] bg-white px-4 py-4">
          <div className="text-[1.05rem] font-black text-[#241629]">{displayTitle}</div>
          <p className="mt-2 text-sm leading-6 text-[#5b5360]">{description}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-[1rem] border border-[#eadfd2] bg-white px-4 py-3 text-sm font-bold text-[#5f5662] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-[1rem] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)` }}
          >
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmModal;
