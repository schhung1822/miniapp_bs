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
    <div
      className="absolute inset-0 z-[70] bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[1.7rem] border border-[#ff96da]/18 bg-[#f9f9f9] p-5 text-white shadow-[0_24px_60px_rgba(15,11,31,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
              style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)` }}
            >
              <VoteIcon color="#fff" />
            </div>
            <div className="min-w-0">
              <div className="text-[0.98rem] font-black text-white">
                {voted ? 'Xác nhận hủy vote' : 'Xác nhận bình chọn'}
              </div>
              <div className="mt-1 text-[12px] font-medium text-white/56">{category.title}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-white/12 bg-white/[0.06] text-black p-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Đóng xác nhận vote"
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <div className="rounded-[1.15rem] border border-white/10 px-4 py-4">
          <div className="text-[1.05rem] font-black text-white">{displayTitle}</div>
          <p className="mt-2 text-sm leading-6 text-white/72">{description}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-[1rem] border border-white/10 px-4 py-3 text-sm font-bold text-white/84 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-[1rem] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#ff4fb6 0%,#a53cff 100%)' }}
          >
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmModal;
