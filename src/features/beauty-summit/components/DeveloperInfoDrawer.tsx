import React from 'react';

import { CloseIcon, ProfileIcon } from '@/features/beauty-summit/icons';

interface DeveloperInfoDrawerProps {
  open: boolean;
  onClose: () => void;
}

const developerItems = [
  'Mã số doanh nghiệp: 0111450660.',
  'Số điện thoại liên hệ: 0332083366.',
  'Số phiên bản Mini App: 1.0.0.',
] as const;

const DeveloperInfoDrawer: React.FC<DeveloperInfoDrawerProps> = ({ open, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-40 bg-[linear-gradient(180deg,#7e13b7_0%,#a913b8_34%,#d2138b_72%,#de2b73_100%)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="beauty-scroll relative h-full overflow-y-auto px-4 pb-8 pt-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[1rem] font-black uppercase tracking-[0.06em] text-white/90">
              Thông tin nhà phát triển
            </div>
            <div className="mt-1 text-[12px] leading-5 text-white/78">
              Thông tin doanh nghiệp, hỗ trợ và phiên bản Mini App hiện tại.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/10"
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <div className="overflow-hidden rounded-[1.8rem] border border-[#ffd2f4]/88 bg-[linear-gradient(135deg,rgba(178,18,196,0.95)_0%,rgba(131,12,188,0.96)_100%)] shadow-[0_20px_34px_rgba(98,4,103,0.22)]">
          <div className="px-5 pb-5 pt-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] border border-white/16 bg-[linear-gradient(135deg,rgba(255,84,196,0.34)_0%,rgba(151,36,212,0.42)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <ProfileIcon size={24} color="#ffffff" />
              </div>
              <div className="min-w-0">
                <div className="text-[1rem] font-black uppercase tracking-[0.02em] text-white/90">
                  CÔNG TY TNHH CIVI GLOBAL
                </div>
                <div className="mt-1 text-[12px] leading-5 text-white/78">
                  Đơn vị phát triển và vận hành Mini App Beauty Summit 2026.
                </div>
              </div>
            </div>

            <div className="mt-4 h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.32)_0%,rgba(255,105,201,0.54)_50%,rgba(255,255,255,0.18)_100%)]" />

            <div className="mt-5 space-y-4">
              {developerItems.map((item) => (
                <div key={item} className="flex items-start gap-3 text-left text-[13px] leading-7 text-white/80">
                  <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-white" />
                  <span>{item}</span>
                </div>
              ))}

              <div className="text-left text-[13px] leading-7 text-white/80">
                <span>
                  Nếu có phát sinh lỗi và gặp vấn đề gì trong quá trình sử dụng ứng dụng vui lòng
                  liên hệ số điện thoại trên để được hỗ trợ.
                </span>
              </div>
              <div className="pt-1 text-[13px] font-bold text-white/90">Trân trọng!</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperInfoDrawer;
