import React from 'react';

interface TermsScreenProps {
  agreed: boolean;
  onToggleAgree: () => void;
  onContinue: () => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ agreed, onToggleAgree, onContinue }) => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden px-5 pb-6 pt-6">
      <div className="mb-6 shrink-0 text-center">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-200">
          19 - 20 tháng 6, 2026
        </div>
        <h1 className="bg-[linear-gradient(135deg,#fff,#ffd970,#ec4899)] bg-clip-text font-serif text-[2rem] font-black leading-none text-transparent">
          BEAUTY
          <br />
          VERSE
        </h1>
        <div className="mt-3 text-[11px] font-medium tracking-[0.18em] text-zinc-500">
          BEAUTY SUMMIT 2026 • VEC HÀ NỘI
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-[1.35rem] border border-[#eadfd2] bg-white/90 p-5 shadow-[0_18px_42px_rgba(184,134,11,0.12)]">
        <div className="shrink-0">
          <div className="mb-1 text-base font-bold text-[#241629]">Điều khoản & điều kiện</div>
          <div className="mb-4 text-[13px] text-[#7a7280]">
            Vui lòng đọc và xác nhận trước khi kích hoạt app.
          </div>
        </div>

        <div className="beauty-scroll mb-5 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-[1rem] border border-[#efe4d6] bg-[#fffaf2] p-4 text-[13px] leading-6 text-[#4d4350] shadow-inner shadow-[#eadfd2]/40">
          <div>
            <div className="mb-1 text-[13px] font-semibold text-[#241629]">1. Quy định chung</div>
            Mini App chỉ áp dụng cho khách tham dự Beauty Summit 2026. Mỗi số điện thoại chỉ
            dùng một tài khoản duy nhất.
          </div>
          <div>
            <div className="mb-1 text-[13px] font-semibold text-[#241629]">2. Thu thập dữ liệu</div>
            Số điện thoại và tên Zalo được dùng để định danh tài khoản, check-in và gửi thông báo
            trong sự kiện.
          </div>
          <div>
            <div className="mb-1 text-[13px] font-semibold text-[#241629]">3. BPoint & voucher</div>
            Điểm tích lũy dùng để đổi voucher. BPoint đã tiêu không được hoàn lại và voucher
            không quy đổi thành tiền mặt.
          </div>
          <div>
            <div className="mb-1 text-[13px] font-semibold text-[#241629]">4. Nhiệm vụ & phần thưởng</div>
            Nhiệm vụ chia theo từng giai đoạn. Ban tổ chức có quyền từ chối bằng chứng không hợp
            lệ hoặc có dấu hiệu gian lận.
          </div>
          <div>
            <div className="mb-1 text-[13px] font-semibold text-[#241629]">5. Quyết định cuối cùng</div>
            Mọi tranh chấp hoặc vi phạm sẽ được xử lý theo quyết định cuối cùng của Ban tổ chức.
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleAgree}
          className="mb-5 flex w-full shrink-0 items-start gap-3 rounded-[1rem] border border-[#eadfd2] bg-[#fffaf2] p-4 text-left"
        >
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
              agreed ? 'border-amber-300 bg-amber-300 text-[#140b18]' : 'border-[#cfc6d0] bg-[#f1f1f2]'
            }`}
          >
            {agreed ? '✓' : null}
          </div>
          <span className="text-[13px] leading-5 text-[#4d4350]">
            Tôi đã đọc, hiểu và đồng ý với toàn bộ điều khoản của Beauty Summit 2026.
          </span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!agreed}
          className="w-full shrink-0 rounded-[1.15rem] px-4 py-4 text-sm font-bold disabled:cursor-not-allowed"
          style={
            agreed
              ? { background: 'linear-gradient(135deg, #f59e0b, #ffd970)', color: '#160c1d' }
              : { background: '#d1d5db', color: '#6b7280' }
          }
        >
          Đồng ý và tiếp tục
        </button>
      </div>
    </div>
  );
};

export default TermsScreen;
