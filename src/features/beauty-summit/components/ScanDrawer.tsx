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
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-white/8 bg-[#121320] px-5 pb-8 pt-3 shadow-[0_-24px_60px_rgba(0,0,0,0.45)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/12" />
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <QrIcon color="#34d399" />
              Quét mã check-in
            </div>
            <div className="mt-1 text-sm leading-6 text-zinc-400">
              Bản tạm cho demo. Sau này chỉ tài khoản role lễ tân mới được sử dụng tính năng này.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/6 p-2 text-zinc-400"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="rounded-[1.2rem] border border-emerald-400/14 bg-[linear-gradient(145deg,rgba(8,34,30,0.96),rgba(10,22,27,0.96))] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-emerald-300">Role hiện tại</div>
              <div className="mt-1 text-[14px] font-bold text-white">
                {userRole === 'receptionist' ? 'Lễ tân' : 'Khách tham dự'}
              </div>
            </div>
            <div className="rounded-full bg-emerald-400/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
              Demo
            </div>
          </div>
          <div className="mt-3 text-[12px] leading-6 text-zinc-300">
            Bấm nút bên dưới để mở trình quét QR của Zalo. Nếu đang ở môi trường web/dev, API có thể không mở camera.
          </div>
        </div>

        <button
          type="button"
          onClick={onScan}
          disabled={isLoading}
          className="mt-4 w-full rounded-[1.15rem] bg-[linear-gradient(135deg,#0ea5e9,#34d399)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Đang mở trình quét...' : result ? 'Quét lại mã' : 'Bắt đầu quét'}
        </button>

        <div className="mt-4 rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Kết quả gần nhất</div>
          <div className="mt-2 break-all rounded-[0.95rem] bg-[#0b0d14] px-3 py-3 text-[12px] leading-6 text-zinc-200">
            {result || 'Chưa có dữ liệu quét. Sau khi quét thành công, nội dung mã sẽ hiển thị tại đây.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanDrawer;
