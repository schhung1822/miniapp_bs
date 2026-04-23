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
    <div
      className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(39,23,62,0.4)_0%,rgba(12,11,24,0.88)_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[1.85rem] border-t border-[#ff96da]/18 bg-[linear-gradient(180deg,#241f3c_0%,#19172c_100%)] px-5 pb-8 pt-3 text-white shadow-[0_-24px_60px_rgba(15,11,31,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/14" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-black text-white/90">Tìm mã vé ở đâu?</div>
            <div className="mt-1 text-sm text-white/82">Hai tình huống nhận mã phổ biến.</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/12 bg-white/[0.06] p-2 text-black"
            aria-label="Đóng hướng dẫn mã vé"
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-[1.1rem] border border-[#f4d37a]/24 bg-[rgba(255,221,87,0.08)] p-4">
            <div className="mb-2 text-sm font-bold text-white/90">1. Khách mua vé trực tiếp</div>
            <div className="text-sm leading-6 text-white/70">
              Mã vé được gửi qua email hoặc tin nhắn Zalo tại thời điểm thanh toán thành công.
            </div>
          </div>
          <div className="rounded-[1.1rem] border border-[#ff8dda]/20 bg-[rgba(255,79,182,0.08)] p-4">
            <div className="mb-2 text-sm font-bold text-white/90">2. Khách nhận vé từ đối tác</div>
            <div className="text-sm leading-6 text-white/70">
              Mã vé sẽ được chuyển qua nhãn hàng hoặc đối tác mời tham dự. Bạn có thể liên hệ trực tiếp đầu mối đã gửi thư mời.
            </div>
          </div>
          <div className="rounded-[1.1rem] border border-white/10 bg-white p-4 text-sm leading-6 text-black">
            Vẫn chưa tìm thấy mã? Liên hệ hotline hoặc nhắn{' '}
            <button
              type="button"
              onClick={onOpenSupportChat}
              className="font-semibold text-[#FF45CA] underline underline-offset-2"
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
