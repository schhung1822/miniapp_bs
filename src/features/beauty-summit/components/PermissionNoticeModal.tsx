import React from 'react';

import { BrandMark } from '@/features/beauty-summit/icons';

interface PermissionNoticeModalProps {
  open: boolean;
  loading: boolean;
  onApprove: () => void;
  onDeny: () => void;
}

const PermissionNoticeModal: React.FC<PermissionNoticeModalProps> = ({
  open,
  loading,
  onApprove,
  onDeny,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm">
      <div className="w-full max-w-[21rem] rounded-[1.5rem] bg-white px-4 py-7 text-center shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="mb-4 flex justify-center">
          <BrandMark size={36} />
        </div>
        <div className="whitespace-pre-line text-[1.45rem] font-black leading-tight text-[#111827]">
          {'Chào mừng bạn đến với\nBeauty Summit'}
        </div>
        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-lg text-[#0d7cff]">📱</div>
            <div className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#2f3137]">
              Tạo mã QR để check-in nhanh chóng
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-lg text-[#0d7cff]">🎁</div>
            <div className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#2f3137]">
              Làm nhiệm vụ tích điểm nhận voucher
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-lg text-[#0d7cff]">🪪</div>
            <div className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#2f3137]">
              Định danh khách hàng xuyên suốt sự kiện
            </div>
          </div>
        </div>
        <div className="mt-5 text-left text-[13px] leading-5 text-[#2f3137]">
          Vui lòng đồng ý chia sẻ số điện thoại để liên kết với tài khoản của bạn trên hệ thống
          Beauty Summit.
        </div>
        <div className="mt-7 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onApprove}
            disabled={loading}
            className={`relative w-full rounded-full bg-[#0d7cff] px-4 py-4 text-base font-bold !text-white shadow-[0_12px_30px_rgba(13,124,255,0.25)] disabled:cursor-wait disabled:opacity-70 ${
              loading ? 'text-transparent' : ''
            }`}
          >
            Liên kết số điện thoại
          </button>
          <button
            type="button"
            onClick={onDeny}
            disabled={loading}
            className="px-4 py-1 text-base font-bold text-[#ef4444] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Từ chối và Thoát
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionNoticeModal;
