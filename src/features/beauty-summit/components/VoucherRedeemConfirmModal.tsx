import React from 'react';

import VoucherLogoBadge from '@/features/beauty-summit/components/VoucherLogoBadge';
import { CloseIcon, GiftIcon } from '@/features/beauty-summit/icons';
import type { Voucher } from '@/features/beauty-summit/types';

interface VoucherRedeemConfirmModalProps {
  voucher: Voucher | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VoucherRedeemConfirmModal: React.FC<VoucherRedeemConfirmModalProps> = ({
  voucher,
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!voucher) {
    return null;
  }

  const cost = voucher.cost ?? 0;

  return (
    <div
      className="absolute inset-0 z-[70] bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[1.7rem] border border-[#ff96da]/18 bg-[linear-gradient(180deg,#241f3c_0%,#19172c_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,11,31,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
              style={{ background: `linear-gradient(135deg, ${voucher.color}, ${voucher.color}cc)` }}
            >
              <GiftIcon color="#fff" />
            </div>
            <div className="min-w-0">
              <div className="text-[0.98rem] font-black text-white">Xác nhận đổi voucher</div>
              <div className="mt-1 text-[12px] font-medium text-white/56">{cost} BP</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-white/12 bg-white/[0.06] p-2 text-black disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Đóng xác nhận đổi voucher"
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <div className="rounded-[1.15rem] border border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <VoucherLogoBadge
              logo={voucher.logo}
              brand={voucher.brand}
              color={voucher.color}
              className="h-11 w-11 shrink-0"
              grandPrize={voucher.isGrand}
            />
            <div className="min-w-0">
              <div className="truncate text-[1.05rem] font-black text-white">{voucher.discount}</div>
              <div className="mt-1 truncate text-sm text-white/62">{voucher.desc}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/72">
            Bạn có chắc chắn muốn đổi voucher này không? BPoint đã đổi sẽ không hoàn lại.
          </p>
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
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherRedeemConfirmModal;
