import React from 'react';

import { CloseIcon } from '@/features/beauty-summit/icons';

interface TicketHelpModalProps {
  open: boolean;
  onClose: () => void;
  onOpenSupportChat: () => void;
}

const TicketHelpModal: React.FC<TicketHelpModalProps> = ({ open, onClose, onOpenSupportChat }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-[#eadfd2] bg-white px-5 pb-8 pt-3 shadow-[0_-24px_60px_rgba(15,23,42,0.16)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d6d3d9]" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-[#111827]">Tìm mã vé ở đâu?</div>
            <div className="mt-1 text-sm text-[#4b5563]">Hai tình huống nhận mã phổ biến.</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#f3f4f6] p-2 text-[#374151]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-[1.1rem] border border-[#f4d37a] bg-[#fff8e1] p-4">
            <div className="mb-2 text-sm font-bold text-[#111827]">1. Khách mua vé trực tiếp</div>
            <div className="text-sm leading-6 text-[#374151]">
              Mã vé được gửi qua email hoặc tin nhắn Zalo tại thời điểm thanh toán thành công.
            </div>
          </div>
          <div className="rounded-[1.1rem] border border-[#ddc2f6] bg-[#f8f1ff] p-4">
            <div className="mb-2 text-sm font-bold text-[#111827]">2. Khách nhận vé từ đối tác</div>
            <div className="text-sm leading-6 text-[#374151]">
              Mã vé sẽ được chuyển qua nhãn hàng hoặc đối tác mời tham dự. Bạn có thể liên hệ trực tiếp đầu mối đã gửi thư mời.
            </div>
          </div>
          <div className="rounded-[1.1rem] border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm leading-6 text-[#374151]">
            Vẫn chưa tìm thấy mã? Liên hệ hotline hoặc nhắn{' '}
            <button
              type="button"
              onClick={onOpenSupportChat}
              className="font-semibold text-[#0d7cff] underline underline-offset-2"
            >
              Zalo OA Beauty Summit Vietnam
            </button>{' '}
            để được hỗ trợ.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketHelpModal;
