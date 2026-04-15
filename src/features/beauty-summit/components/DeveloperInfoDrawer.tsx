import React from 'react';

import { CloseIcon, ProfileIcon } from '@/features/beauty-summit/icons';

interface DeveloperInfoDrawerProps {
  open: boolean;
  onClose: () => void;
}

const developerItems = [
  'Mã số doanh nghiệp: 0111450660.',
  'Số điện thoại liên hệ: 0332083366.',
  'Số phiên bản Mini App: 1.0.0',
] as const;

const DeveloperInfoDrawer: React.FC<DeveloperInfoDrawerProps> = ({ open, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 max-h-[78%] rounded-t-[1.75rem] border-t border-[#eadfd2] bg-[#fffdf9] px-5 pb-8 pt-3 shadow-[0_-24px_60px_rgba(36,22,41,0.22)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e8dfe5]" />
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-[#241629]">
              <ProfileIcon color="#2563eb" />
              Thông tin nhà phát triển
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#eadfd2] bg-white p-2 text-zinc-500"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="beauty-scroll max-h-[calc(78vh-6.5rem)] space-y-3 overflow-y-auto">
          <div className="overflow-hidden rounded-[1.1rem] border border-[#eadfd2] bg-white shadow-[0_10px_24px_rgba(184,134,11,0.06)]">
            <div className="border-b border-[#f0e7dc] px-4 py-3 text-sm font-bold text-[#241629]">
              CÔNG TY TNHH CIVI GLOBAL
            </div>
            <div className="space-y-3 px-4 py-4">
              {developerItems.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[#4b5563]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                  <span>{item}</span>
                </div>
              ))}
              <p className="pt-1 text-sm text-[#241629]">
                Nếu có phát sinh lỗi và gặp vấn đề gì trong quá trình sử dụng ứng dụng vui lòng liên hệ số điện thoại trên để được hỗ trợ.
              </p>
              <div className="pt-1 text-sm font-semibold text-[#241629]">Trân trọng!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperInfoDrawer;
