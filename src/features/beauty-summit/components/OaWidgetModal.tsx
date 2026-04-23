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
    <div className="absolute inset-0 z-40 flex items-center justify-center px-5 backdrop-blur-sm">
      <div className="w-full max-w-[24rem] overflow-hidden rounded-[1.5rem] border border-[#ff96da]/18 bg-black text-center text-white shadow-[0_24px_70px_rgba(15,11,31,0.5)]">
        <div className="border-b border-white/10 px-5 py-4">
          <div id={widgetId} className="min-h-[82px] w-full rounded-[1rem] bg-white px-2 py-2" />
        </div>
        <div className="px-5 pb-4 pt-4 text-left">
          <div className="space-y-3">
            {[
              ['🔔', 'Nhận thông báo check-in & nhiệm vụ realtime'],
              ['🎁', 'Voucher & ưu đãi gửi trực tiếp qua Zalo'],
              ['🗓️', 'Cập nhật lịch trình & thay đổi sự kiện'],
              ['📸', 'Thông báo phần thưởng & hình ảnh sự kiện'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base">
                  {icon}
                </span>
                <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-white/82">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="w-full border-t border-white/10 px-4 py-4 text-[15px] font-bold text-[#0068ff]"
        >
          Để sau
        </button>
      </div>
    </div>
  );
};

export default OaWidgetModal;
