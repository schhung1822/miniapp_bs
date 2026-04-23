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
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] px-5 backdrop-blur-sm">
      <div className="w-full max-w-[21rem] rounded-[1.6rem] border border-[#ff96da]/18 bg-[linear-gradient(180deg,#241f3c_0%,#19172c_100%)] px-4 py-7 text-center text-white shadow-[0_24px_70px_rgba(15,11,31,0.5)]">
        <div className="mb-4 flex justify-center">
          <div className="rounded-[1rem] border border-white/12 bg-white/[0.06] p-3">
            <BrandMark size={36} />
          </div>
        </div>
        <div className="whitespace-pre-line text-[1.45rem] font-black leading-tight text-white">
          {'Chào mừng bạn đến với\nBeauty Summit'}
        </div>
        <div className="mt-6 space-y-3 text-left">
          {[
            ['📱', 'Tạo mã QR để check-in nhanh chóng'],
            ['🎁', 'Làm nhiệm vụ tích điểm nhận voucher'],
            ['🪪', 'Định danh khách hàng xuyên suốt sự kiện'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-base">
                {icon}
              </div>
              <div className="whitespace-nowrap text-[13px] font-medium leading-5 text-white/84">{text}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 text-left text-[13px] leading-6 text-white/74">
          Vui lòng đồng ý chia sẻ số điện thoại để liên kết với tài khoản của bạn trên hệ thống Beauty Summit.
        </div>
        <div className="mt-7 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onApprove}
            disabled={loading}
            className={`relative w-full rounded-[1rem] bg-[linear-gradient(135deg,#ff4fb6 0%,#a53cff 100%)] px-4 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(255,79,182,0.24)] disabled:cursor-wait disabled:opacity-70 ${
              loading ? 'text-transparent' : ''
            }`}
          >
            Liên kết số điện thoại
          </button>
          <button
            type="button"
            onClick={onDeny}
            disabled={loading}
            className="px-4 py-1 text-base font-bold text-[#ff7da7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Từ chối và Thoát
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionNoticeModal;
