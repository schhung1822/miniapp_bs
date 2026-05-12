import React from 'react';

import { CloseIcon, QrIcon } from '@/features/beauty-summit/icons';
import type { BeautyUserRole } from '@/features/beauty-summit/types';

interface ScanDrawerProps {
  open: boolean;
  userRole: BeautyUserRole;
  isLoading: boolean;
  result: string | null;
  onClose: () => void;
  onScan: () => void;
}

const ScanDrawer: React.FC<ScanDrawerProps> = ({
  open,
  userRole,
  isLoading,
  result,
  onClose,
  onScan,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[1.85rem] border-t border-[#ff96da]/18 bg-[#f9f9f9] px-5 pb-8 pt-3 text-white shadow-[0_-24px_60px_rgba(15,11,31,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/14" />
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <QrIcon color="#ff83d0" />
              Quét mã check-in
            </div>
            <div className="mt-1 text-sm leading-6 text-white/62">
              Bản tạm cho demo. Sau này chỉ tài khoản role lễ tân mới được sử dụng tính năng này.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/12 bg-white/[0.06] p-2 text-white/70"
            aria-label="Đóng quét mã"
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#ff8cd5]">Role hiện tại</div>
              <div className="mt-1 text-[14px] font-bold text-white">{userRole === 'receptionist' ? 'Lễ tân' : 'Khách tham dự'}</div>
            </div>
            <div className="rounded-full bg-[#ff4fb61a] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff8cd5]">
              Demo
            </div>
          </div>
          <div className="mt-3 text-[12px] leading-6 text-white/68">
            Bấm nút bên dưới để mở trình quét QR của Zalo. Nếu đang ở môi trường web/dev, API có thể không mở camera.
          </div>
        </div>

        <button
          type="button"
          onClick={onScan}
          disabled={isLoading}
          className="mt-4 w-full rounded-[1rem] bg-[linear-gradient(135deg,#ff4fb6 0%,#a53cff 100%)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Đang mở trình quét...' : result ? 'Quét lại mã' : 'Bắt đầu quét'}
        </button>

        <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/48">Kết quả gần nhất</div>
          <div className="mt-2 break-all rounded-[0.95rem] bg-[rgba(12,10,22,0.74)] px-3 py-3 text-[12px] leading-6 text-white/78">
            {result || 'Chưa có dữ liệu quét. Sau khi quét thành công, nội dung mã sẽ hiển thị tại đây.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanDrawer;
