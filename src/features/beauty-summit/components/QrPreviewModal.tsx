import React from 'react';

import { QRCodeCanvas } from 'qrcode.react';

import beautySummitIcon from '@/assets/icon.png';
import { CloseIcon, DownloadIcon, QrIcon } from '@/features/beauty-summit/icons';

interface QrPreviewModalProps {
  open: boolean;
  userName: string;
  orderCode: string;
  qrValue: string;
  onClose: () => void;
  onChangeTicket: () => void;
}

const QrPreviewModal: React.FC<QrPreviewModalProps> = ({
  open,
  userName,
  orderCode,
  qrValue,
  onClose,
  onChangeTicket,
}) => {
  const qrFrameRef = React.useRef<HTMLDivElement | null>(null);

  if (!open) {
    return null;
  }

  const handleDownload = (): void => {
    const canvas = qrFrameRef.current?.querySelector('canvas');
    if (!canvas) {
      return;
    }

    const link = document.createElement('a');
    link.download = `beauty-summit-${orderCode || 'check-in'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[23rem] rounded-[2rem] bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
        <div className="rounded-[1.65rem] bg-[linear-gradient(180deg,#fff9fc_0%,#fdf2f7_100%)] p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-[1.1rem] font-black uppercase tracking-[0.03em] text-[#241629]">
                {userName}
              </div>
              <div className="mt-1 text-xs font-semibold tracking-[0.18em] text-[#9b7a86]">
                {orderCode}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#7a7280] shadow-[0_10px_24px_rgba(164,120,143,0.14)]"
              aria-label="Đóng QR"
            >
              <CloseIcon size={16} color="currentColor" />
            </button>
          </div>

          <div className="rounded-[1.65rem] bg-[#f8dfe9] px-4 py-5 shadow-inner shadow-white/50">
            <div className="rounded-[1.5rem] bg-white px-4 pb-4 pt-5 shadow-[0_18px_40px_rgba(182,127,148,0.18)]">
              <div className="mb-4 flex items-center justify-center gap-2 text-center">
                <img src={beautySummitIcon} alt="Beauty Summit" className="h-7 w-7 rounded-full object-cover" />
                <div className="text-[13px] font-black tracking-[0.08em] text-[#b2477d]">
                  BEAUTY SUMMIT | CHECK-IN
                </div>
              </div>

              <div ref={qrFrameRef} className="relative mx-auto w-fit">
                <QRCodeCanvas
                  value={qrValue}
                  size={232}
                  level="H"
                  marginSize={2}
                  bgColor="#ffffff"
                  fgColor="#111111"
                  imageSettings={{
                    src: beautySummitIcon,
                    height: 28,
                    width: 28,
                    excavate: true,
                  }}
                />
              </div>

              <div className="mt-4 rounded-[1.1rem] bg-[#fff7fb] px-3 py-2.5 text-center text-[11px] font-medium text-[#8a7480]">
                Đưa mã này cho staff để quét check-in tại sự kiện.
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-[1rem] bg-white px-4 py-3 text-sm font-bold text-[#241629] shadow-[0_12px_28px_rgba(182,127,148,0.12)]"
              >
                <DownloadIcon size={17} color="#241629" />
                Tải xuống
              </button>
              <button
                type="button"
                onClick={onChangeTicket}
                className="flex items-center justify-center gap-2 rounded-[1rem] bg-white px-4 py-3 text-sm font-bold text-[#b2477d] shadow-[0_12px_28px_rgba(182,127,148,0.12)]"
              >
                <QrIcon size={17} color="#b2477d" />
                Đổi vé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPreviewModal;
