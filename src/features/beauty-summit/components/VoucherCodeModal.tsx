import React from 'react';

import VoucherLogoBadge from '@/features/beauty-summit/components/VoucherLogoBadge';
import { CloseIcon, CopyIcon } from '@/features/beauty-summit/icons';
import type { Voucher } from '@/features/beauty-summit/types';

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
    <div
      className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[1.7rem] border border-[#ff96da]/18 bg-[#f9f9f9] p-5 text-white shadow-[0_24px_80px_rgba(15,11,31,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#2D0658]">Voucher đã nhận</div>
            <div className="flex items-center gap-3">
              <VoucherLogoBadge
                logo={voucher.logo}
                brand={voucher.brand}
                color={voucher.color}
                className="h-11 w-11 shrink-0"
              />
              <div className="min-w-0">
                <div className="truncate text-lg font-bold text-[#1a1a2e]">{voucher.brand}</div>
                <div className="mt-1 text-xs font-medium" style={{ color: voucher.color }}>
                  {voucher.discount}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm leading-6 text-[#2D0658]">{voucher.desc}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/12 bg-white/[0.06] p-2 text-black"
            aria-label="Đóng voucher"
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <div
          className="mb-5 rounded-[1.25rem] border px-4 py-5"
          style={{
            borderColor: `${voucher.color}33`,
            background: `linear-gradient(145deg, ${voucher.color}1c, rgba(255,255,255,0.04))`,
          }}
        >
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1a2e]">Mã voucher</div>
          <div
            className="rounded-[1rem] border border-white/10 bg-[rgba(18,16,32,0.74)] px-4 py-4 text-center text-[1.05rem] font-black tracking-[0.24em]"
            style={{ color: voucher.code ? '#ffffff' : '#ffd970' }}
          >
            {voucher.code ?? 'GRAND PRIZE'}
          </div>
          <div className="mt-3 text-xs leading-5 text-[#1a1a2e]">
            {voucher.code ? (
              <>
                Xuất trình mã này tại quầy <b className="font-bold text-[#1a1a2e]">{voucher.brand}</b> để nhận ưu đãi.
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
            className="flex items-center justify-center text-black gap-2 rounded-[1rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:text-white/34"
          >
            <CopyIcon color='#000' size={16} />
            {copied ? 'Đã copy' : 'Copy mã'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 text-sm font-semibold text-white/90"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCodeModal;
