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
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[22.5rem]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center text-[#7a7280]"
          aria-label="Close QR"
        >
          <CloseIcon size={16} color="currentColor" />
        </button>

        <div className="beauty-crisp-edge rounded-[1.8rem] bg-white p-2.5 shadow-[0_18px_44px_rgba(15,23,42,0.18)]">
          <div className="rounded-[1.55rem] bg-[linear-gradient(180deg,#fff9fc_0%,#fdf2f7_100%)] px-3.5 pb-3.5 pt-4">
            <div className="mb-3 text-center">
              <div className="mx-auto max-w-[15.5rem] truncate text-[0.95rem] font-black tracking-[0.03em] text-[#241629]">
                {userName}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="beauty-crisp-edge w-full rounded-[1.35rem] bg-white px-3.5 pb-4 pt-4 shadow-[0_12px_22px_rgba(182,127,148,0.12)]">
                <div className="mb-4 flex items-center justify-center gap-2 text-center">
                  <img src={beautySummitIcon} alt="Beauty Summit" className="h-7 w-7 rounded-full object-cover" />
                  <div className="whitespace-nowrap text-[10px] font-black tracking-[0.04em] text-[#b2477d]">
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
                className="flex w-full items-center justify-center gap-2 rounded-[0.95rem] bg-white px-4 py-3 text-sm font-bold text-[#b2477d] shadow-[0_10px_18px_rgba(182,127,148,0.08)]"
              >
                <QrIcon size={17} color="#b2477d" />
                Đổi vé
              </button>
            </div>

            <div className="mt-3 px-1 text-center text-[11px] font-medium leading-5 text-[#8a7480]">
              Bạn có thể chụp màn hình lưu lại mã QR phòng trường hợp không có internet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPreviewModal;
