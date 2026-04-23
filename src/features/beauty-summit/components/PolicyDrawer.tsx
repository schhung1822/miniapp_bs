import React from 'react';

import { POLICY_SECTIONS } from '@/features/beauty-summit/data';
import { CloseIcon, MissionIcon, PolicyIcon } from '@/features/beauty-summit/icons';
import type { PolicySection } from '@/features/beauty-summit/types';

interface PolicyDrawerProps {
  open: boolean;
  onClose: () => void;
}

const renderSectionIcon = (sectionId: string): React.ReactNode => {
  if (sectionId === 'missions') {
    return <MissionIcon size={24} color="#ffffff" />;
  }

  return <PolicyIcon size={24} color="#ffffff" />;
};

const PolicyDrawer: React.FC<PolicyDrawerProps> = ({ open, onClose }) => {
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
              Chính sách ứng dụng
            </div>
            <div className="mt-1 text-[12px] leading-5 text-white/78">
              Quy định áp dụng cho khách tham dự Beauty Summit.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 "
          >
            <CloseIcon color="currentColor" />
          </button>
        </div>

        <div className="space-y-4">
          {POLICY_SECTIONS.map((section: PolicySection) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-[1.8rem] border border-[#ffd2f4]/88 bg-[linear-gradient(135deg,rgba(178,18,196,0.95)_0%,rgba(131,12,188,0.96)_100%)] shadow-[0_20px_34px_rgba(98,4,103,0.22)]"
            >
              <div className="px-2 pb-5 pt-2">
                <div className="flex items-center ">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] ">
                    {renderSectionIcon(section.id)}
                  </div>
                  <div className="min-w-0 text-[1rem] font-black uppercase tracking-[0.02em] text-white/90">
                    {section.title}
                  </div>
                </div>

                <div className="mt-1 h-px w-full bg-white" />

                <div className="mt-2 space-y-4">
                  {section.items.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-left text-[13px] text-white/78">
                      <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-white" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyDrawer;
