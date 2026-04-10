import React from 'react';

interface OaWidgetModalProps {
  open: boolean;
  widgetId: string;
  onSkip: () => void;
}

const OaWidgetModal: React.FC<OaWidgetModalProps> = ({ open, widgetId, onSkip }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm">
      <div className="w-full max-w-[24rem] overflow-hidden rounded-[1.4rem] bg-white text-center shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
        <div className="bg-white px-5 py-4">
          <div id={widgetId} className="min-h-[82px] w-full" />
        </div>
        <div className="px-5 pb-4 pt-2 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-center text-lg">🔔</span>
              <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-[#374151]">
                Nhận thông báo check-in & nhiệm vụ realtime
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-center text-lg">🎁</span>
              <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-[#374151]">
                Voucher & ưu đãi gửi trực tiếp qua Zalo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-center text-lg">🗓️</span>
              <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-[#374151]">
                Cập nhật lịch trình & thay đổi sự kiện
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-center text-lg">📸</span>
              <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-[#374151]">
                Thông báo phần thưởng & hình ảnh sự kiện
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="w-full border-t border-[#eef0f4] bg-white px-4 py-4 text-[15px] font-bold text-[#ef4444]"
        >
          Để sau
        </button>
      </div>
    </div>
  );
};

export default OaWidgetModal;
