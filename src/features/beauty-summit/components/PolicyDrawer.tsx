import React from 'react';

import { POLICY_SECTIONS } from '@/features/beauty-summit/data';
import { CloseIcon, PolicyIcon } from '@/features/beauty-summit/icons';
import type { PolicySection } from '@/features/beauty-summit/types';
import { getToneClasses } from '@/features/beauty-summit/utils';

interface PolicyDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PolicyDrawer: React.FC<PolicyDrawerProps> = ({ open, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 max-h-[82%] rounded-t-[1.75rem] border-t border-white/8 bg-[#121320] px-5 pb-8 pt-3 shadow-[0_-24px_60px_rgba(0,0,0,0.45)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/12" />
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <PolicyIcon color="#d7b15c" />
              Chính sách ứng dụng
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              Quy định sự kiện, BPoint, voucher và dữ liệu người dùng.
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

        <div className="beauty-scroll max-h-[calc(82vh-6.5rem)] space-y-3 overflow-y-auto">
          {POLICY_SECTIONS.map((section: PolicySection) => {
            const tone = getToneClasses(section.tone);
            const bulletColor =
              section.tone === 'gold'
                ? '#ffd36c'
                : section.tone === 'green'
                  ? '#5fe0b4'
                  : section.tone === 'blue'
                    ? '#62b7ff'
                    : section.tone === 'red'
                      ? '#ff7878'
                      : '#ff70b8';

            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-[1.1rem] border border-white/6 bg-white/[0.03]"
              >
                <div
                  className={`flex items-center gap-2 border-b border-white/6 px-4 py-3 text-sm font-bold`}
                >
                  <PolicyIcon color="currentColor" />
                  <div className={`${tone}`}>{section.title}</div>
                </div>
                <div className="space-y-3 px-4 py-4">
                  {section.items.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
                      <span
                        className="mt-2 h-1.5 w-1.5 rounded-full"
                        style={{ background: bulletColor }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PolicyDrawer;
