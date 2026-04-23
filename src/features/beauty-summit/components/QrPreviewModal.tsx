import React from 'react';

import beautySummitIcon from '@/assets/icon.png';
import BeautyQrCode from '@/features/beauty-summit/components/BeautyQrCode';
import { CloseIcon, QrIcon } from '@/features/beauty-summit/icons';

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
  orderCode: _orderCode,
  qrValue,
  onClose,
  onChangeTicket,
}) => {
  const qrFrameRef = React.useRef<HTMLDivElement | null>(null);

  if (!open) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-[linear-gradient(180deg,rgba(39,23,62,0.36)_0%,rgba(12,11,24,0.88)_100%)] px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative w-full max-w-[22.5rem]" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06]"
          aria-label="Đóng QR"
        >
          <CloseIcon size={16} color="currentColor" />
        </button>

        <div className="beauty-crisp-edge rounded-[1.8rem] border border-[#ff96da]/18 bg-[linear-gradient(180deg,rgba(255,53,170,0.45)_0%,rgba(88,28,135,0.9)_100%)] p-2.5 shadow-[0_24px_60px_rgba(15,11,31,0.5)]">
          <div className="rounded-[1.55rem] px-3.5 pb-3.5 pt-4">
            <div className="mb-3 text-center">
              <div className="uppercase mx-auto max-w-[15.5rem] truncate text-[1rem] leading-[1.5em] font-black tracking-[0.03em] text-white/90">
                {userName}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="beauty-crisp-edge w-full rounded-[1.35rem] bg-white px-3.5 pb-4 pt-4 shadow-[0_12px_22px_rgba(0,0,0,0.18)]">
                <div className="mb-4 flex items-center justify-center gap-2 text-center">
                  <img src={beautySummitIcon} alt="Beauty Summit" className="h-7 w-7 rounded-full object-cover" />
                  <div className="whitespace-nowrap text-[12px] font-black tracking-[0.04em] text-[#b2477d]">
                    BEAUTY SUMMIT | CHECK-IN
                  </div>
                </div>

                <div className="flex w-full justify-center">
                  <BeautyQrCode
                    ref={qrFrameRef}
                    value={qrValue}
                    size={232}
                    wrapperClassName="w-fit"
                    logoSize={24}
                    logoRingClassName="bg-[#f8dfe9] shadow-[0_8px_18px_rgba(178,71,125,0.16)]"
                  />
                </div>

                <div className="mt-4 rounded-[1rem] bg-[#fff7fb] px-3 py-2.5 text-center text-[11px] font-medium text-[#8a7480]">
                  Vui lòng đưa mã QR này cho nhân viên để check-in tại sự kiện.
                </div>
              </div>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={onChangeTicket}
                className="flex w-full items-center justify-center gap-2 rounded-[0.95rem] border border-white/10 bg-[#fff] px-4 py-3 font-bold"
              >
                <QrIcon size={17} color="#000" />
                Đổi vé
              </button>
            </div>

            <div className="mt-3 px-1 text-center text-[12px] font-medium leading-5 text-white/72">
              Lên chụp màn hình lưu lại mã QR phòng trường hợp không có internet hoặc server quá tải.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPreviewModal;
