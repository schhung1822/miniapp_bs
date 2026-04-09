import React from 'react';

import type { Voucher } from '@/features/beauty-summit/types';
import { CloseIcon, CopyIcon } from '@/features/beauty-summit/icons';
import VoucherLogoBadge from '@/features/beauty-summit/components/VoucherLogoBadge';

interface VoucherCodeModalProps {
  voucher: Voucher | null;
  onClose: () => void;
}

const VoucherCodeModal: React.FC<VoucherCodeModalProps> = ({ voucher, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setCopied(false);
  }, [voucher]);

  if (!voucher) {
    return null;
  }

  const handleCopy = async (): Promise<void> => {
    if (!voucher.code) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(voucher.code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = voucher.code;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/55 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[1.6rem] border border-[#eadfd2] bg-[#fffdf9] p-5 shadow-[0_24px_80px_rgba(36,22,41,0.22)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8f9d]">
              Voucher đã nhận
            </div>
            <div className="flex items-center gap-3">
              <VoucherLogoBadge
                logo={voucher.logo}
                brand={voucher.brand}
                color={voucher.color}
                className="h-11 w-11 shrink-0"
              />
              <div className="min-w-0">
                <div className="truncate text-lg font-bold text-[#241629]">{voucher.brand}</div>
                <div className="mt-1 text-xs font-medium" style={{ color: voucher.color }}>
                  {voucher.discount}
                </div>
              </div>
            </div>
            <div className="mt-1 text-sm leading-6 text-[#7a7280]">{voucher.desc}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#eadfd2] bg-white p-2 text-[#8a7e8b]"
          >
            <CloseIcon />
          </button>
        </div>

        <div
          className="mb-5 rounded-[1.25rem] border px-4 py-5"
          style={{
            borderColor: `${voucher.color}33`,
            background: `linear-gradient(145deg, ${voucher.color}12, rgba(255,255,255,0.96))`,
          }}
        >
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b7b8e]">
            Mã voucher
          </div>
          <div
            className="rounded-2xl border border-[#eadfd2] bg-white px-4 py-4 text-center text-[1.05rem] font-black tracking-[0.24em]"
            style={{ color: voucher.code ? '#241629' : '#b8860b' }}
          >
            {voucher.code ?? 'GRAND PRIZE'}
          </div>
          <div className="mt-3 text-xs leading-5 text-[#7a7280]">
            {voucher.code ? (
              <>
                Xuất trình mã này tại quầy <b className="font-bold text-black">{voucher.brand}</b> nhận hàng để nhận ưu đãi.
              </>
            ) : (
              'Grand prize chỉ mở khóa khi đạt 100% nhiệm vụ.'
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!voucher.code}
            className="flex items-center justify-center gap-2 rounded-full border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold text-[#241629] disabled:cursor-not-allowed disabled:text-[#a69ba8]"
          >
            <CopyIcon color={voucher.code ? '#241629' : '#a69ba8'} size={16} />
            {copied ? 'Đã copy' : 'Copy mã'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[linear-gradient(135deg,#ec4899,#f59e0b)] px-4 py-3 text-sm font-semibold !text-white"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCodeModal;
