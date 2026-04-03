import React from 'react';

import type { Voucher } from '@/features/beauty-summit/types';
import { CloseIcon } from '@/features/beauty-summit/icons';

interface VoucherCodeModalProps {
  voucher: Voucher | null;
  onClose: () => void;
}

const VoucherCodeModal: React.FC<VoucherCodeModalProps> = ({ voucher, onClose }) => {
  if (!voucher) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[1.6rem] border border-white/8 bg-[#141626] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Voucher đã nhận
            </div>
            <div className="text-lg font-bold text-white">{voucher.brand}</div>
            <div className="mt-1 text-sm text-zinc-400">{voucher.desc}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/6 p-2 text-zinc-400">
            <CloseIcon />
          </button>
        </div>

        <div
          className="mb-5 rounded-[1.25rem] border px-4 py-5 text-center"
          style={{
            borderColor: `${voucher.color}33`,
            background: `linear-gradient(145deg, ${voucher.color}22, rgba(255,255,255,0.03))`,
          }}
        >
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
            Mã voucher
          </div>
          <div
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-lg font-black tracking-[0.3em] text-white"
            style={{ color: voucher.code ? '#fff' : '#ffd700' }}
          >
            {voucher.code ?? 'GRAND PRIZE'}
          </div>
          <div className="mt-3 text-xs text-zinc-400">
            {voucher.code
              ? 'Xuất trình mã này tại quầy nhãn hàng để nhận ưu đãi.'
              : 'Grand prize chỉ mở khóa khi đạt 100% nhiệm vụ.'}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm font-semibold text-white"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default VoucherCodeModal;
