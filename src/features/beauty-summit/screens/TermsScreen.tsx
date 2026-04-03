import React from 'react';

import { TIERS } from '@/features/beauty-summit/data';
import type { TierKey } from '@/features/beauty-summit/types';

interface TermsScreenProps {
  agreed: boolean;
  tier: TierKey;
  onToggleAgree: () => void;
  onTierChange: (tier: TierKey) => void;
  onContinue: () => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({
  agreed,
  tier,
  onToggleAgree,
  onTierChange,
  onContinue,
}) => {
  return (
    <div className="relative h-full overflow-y-auto px-5 pb-10 pt-6">
      <div className="mb-8 text-center">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-200">
          19 - 20 tháng 6, 2026
        </div>
        <h1 className="font-serif text-4xl font-black leading-none text-transparent bg-[linear-gradient(135deg,#fff,#ffd970,#ec4899)] bg-clip-text">
          BEAUTY
          <br />
          VERSE
        </h1>
        <div className="mt-3 text-[12px] font-medium tracking-[0.18em] text-zinc-500">
          BEAUTY SUMMIT 2026 • VEC HÀ NỘI
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Hạng vé
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(TIERS) as TierKey[]).map((key) => {
            const item = TIERS[key];
            const active = key === tier;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onTierChange(key)}
                className={`rounded-[1rem] border px-3 py-3 text-center transition ${
                  active ? 'text-white' : 'border-white/8 bg-white/[0.03] text-zinc-500'
                }`}
                style={
                  active
                    ? {
                        borderColor: `${item.color}55`,
                        background: `linear-gradient(145deg, ${item.color}28, rgba(255,255,255,0.05))`,
                      }
                    : undefined
                }
              >
                <div className="mb-1 text-lg">{item.icon}</div>
                <div className="text-sm font-bold">{item.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.04] p-5">
        <div className="mb-1 text-lg font-bold text-white">Điều khoản & điều kiện</div>
        <div className="mb-4 text-sm text-zinc-400">Vui lòng đọc và xác nhận trước khi kích hoạt app.</div>

        <div className="mb-5 max-h-72 space-y-4 overflow-y-auto rounded-[1rem] border border-white/6 bg-black/20 p-4 text-sm leading-7 text-zinc-300">
          <div>
            <div className="mb-1 font-semibold text-white">1. Quy định chung</div>
            Mini App chỉ áp dụng cho khách tham dự Beauty Summit 2026. Mỗi số điện thoại chỉ dùng một tài khoản duy nhất.
          </div>
          <div>
            <div className="mb-1 font-semibold text-white">2. Thu thập dữ liệu</div>
            Số điện thoại và tên Zalo được dùng để định danh tài khoản, check-in và gửi thông báo trong sự kiện.
          </div>
          <div>
            <div className="mb-1 font-semibold text-white">3. BPoint & voucher</div>
            Điểm tích lũy dùng để đổi voucher. BPoint đã tiêu không được hoàn lại và voucher không quy đổi thành tiền mặt.
          </div>
          <div>
            <div className="mb-1 font-semibold text-white">4. Nhiệm vụ & phần thưởng</div>
            Nhiệm vụ chia theo từng giai đoạn. Ban tổ chức có quyền từ chối bằng chứng không hợp lệ hoặc có dấu hiệu gian lận.
          </div>
          <div>
            <div className="mb-1 font-semibold text-white">5. Quyết định cuối cùng</div>
            Mọi tranh chấp hoặc vi phạm sẽ được xử lý theo quyết định cuối cùng của Ban tổ chức.
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleAgree}
          className="mb-5 flex w-full items-start gap-3 rounded-[1rem] border border-white/8 bg-black/20 p-4 text-left"
        >
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
              agreed ? 'border-amber-300 bg-amber-300 text-[#140b18]' : 'border-white/15 bg-white/[0.03]'
            }`}
          >
            {agreed ? '✓' : null}
          </div>
          <span className="text-sm leading-6 text-zinc-300">
            Tôi đã đọc, hiểu và đồng ý với toàn bộ điều khoản của Beauty Summit 2026.
          </span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!agreed}
          className="w-full rounded-[1.15rem] px-4 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-zinc-500"
          style={agreed ? { background: 'linear-gradient(135deg, #f59e0b, #ffd970)', color: '#160c1d' } : undefined}
        >
          Đồng ý và tiếp tục
        </button>
      </div>
    </div>
  );
};

export default TermsScreen;
