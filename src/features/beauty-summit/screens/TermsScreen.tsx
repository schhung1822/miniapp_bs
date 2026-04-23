import React from 'react';

import logoOnboarding from '@/assets/logo-onboarding.png';
import titleIllustration from '@/assets/title.svg';

interface TermsScreenProps {
  agreed: boolean;
  onToggleAgree: () => void;
  onContinue: () => void;
}

const HoangTuWordmark: React.FC = () => (
  <div className="text-left">
    <div className="text-[13px] font-black uppercase tracking-[0.05em] text-[#ffffff]">HOANG TU</div>
    <div className="mt-[1px] text-[6px] font-medium tracking-[0.24em] text-[#f4dfff]">HOLDINGS</div>
  </div>
);

const TermsScreen: React.FC<TermsScreenProps> = ({ agreed, onToggleAgree, onContinue }) => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden px-5 pb-4 pt-2">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#5611b9_0%,#7b14b0_38%,#d10c8e_74%,#f07357_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(84,222,255,0.22),transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,186,124,0.28),transparent_72%)]" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(84,41,214,0.34),transparent_72%)]" />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 pt-1 text-left">
          <div className="flex items-center gap-3.5">
            <img
              src={logoOnboarding}
              alt="Beauty Summit"
              className="h-[28px] w-auto max-w-[98px] object-contain"
            />
            <HoangTuWordmark />
          </div>

          <div className="mt-5 text-[9px] font-medium uppercase tracking-[0.08em] text-[#ffe8ff]">
            BEAUTY SUMMIT
          </div>
          <div className='relative'>
            {/* Thẻ "bóng ma" (vẫn chiếm không gian nhưng không hiển thị) */}
            <img
              src={titleIllustration}
              alt=""
              className="invisible opacity-0 h-auto w-[15rem] max-w-full"
              aria-hidden="true" 
            />
            
            {/* Thẻ hiển thị thực tế (bị trượt ra ngoài theo ý muốn) */}
            <img
              src={titleIllustration}
              alt="Beauty Verse"
              className="absolute top-0 left-[-13px] h-auto w-[15rem] max-w-full object-contain"
            />
          </div>

          <div className="font-poppins inline-flex rounded-full bg-[#ffffff] px-2 text-[12px] uppercase tracking-[0.03em] text-[#ea218d] shadow-[0_14px_24px_rgba(255,255,255,0.16)]">
            <b>
              ĐỊNH HÌNH CHUẨN MỰC MỚI CỦA NGÀNH LÀM ĐẸP
            </b>
          </div>

          <div className="mt-3 flex items-start gap-2 text-left text-[#ffffff]">
            <div className="shrink-0 leading-none">
              <div className="font-poppins text-[1.1rem] font-bold tracking-[-0.04em]">19<span className="mx-0.5 mb-[2px]">−</span>20</div>
              <div className="font-poppins mt-0.5 text-[0.8rem] leading-none">06.2026</div>
            </div>
            <div className="mt-0.5 h-8 w-px shrink-0 bg-[#ffffff]/45" />
            <div className="min-w-0 whitespace-nowrap">
              <div className="font-poppins text-[0.9rem] font-bold leading-tight">VEC - Trung tâm Triển lãm Việt Nam</div>
              <div className="font-poppins mt-0.5 text-[0.8rem] leading-3 text-[#ffe8ff]">
                Đường Cầu Tứ Liên Trường Sa, Đông Anh, Hà Nội
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex min-h-0 flex-1 flex-col rounded-[2rem] border border-[#4b147e] bg-[linear-gradient(180deg,rgba(112,18,182,0.96)_0%,rgba(89,10,149,0.97)_100%)] px-5 py-4.5 shadow-[0_24px_52px_rgba(66,8,105,0.34),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="shrink-0 text-center">
            <div className="text-[0.9rem] leading-tight text-[#ffffff]">Điều khoản & Điều kiện</div>
            <div className="mt-0.5 text-[11px] text-[#f4dfff]">Vui lòng đọc và đồng ý để tiếp tục</div>
          </div>

          <div className="beauty-scroll mt-2 min-h-0 flex-1 overflow-y-auto rounded-[1.35rem] bg-[rgba(47,7,78,0.96)] px-4 py-3.5 text-center text-[11px] leading-5 text-[#ffffff] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div>
              <div className="text-[13px] text-[#ffffff]">1. Quy định chung</div>
              <div className="mt-1">
                Mini App Beauty Summit 2026 chỉ áp dụng cho khách tham dự sự kiện ngày 19-20/06/2026 tại VEC Hà Nội.
                Mỗi số điện thoại chỉ được đăng ký 1 tài khoản duy nhất. Nghiêm cấm sử dụng thông tin giả mạo hoặc gian lận.
              </div>
            </div>

            <div className="mt-5">
              <div className="text-[13px] text-[#ffffff]">2. Thu thập & sử dụng dữ liệu</div>
              <div className="mt-1">
                Số điện thoại được sử dụng để xác nhận check-in và gửi thông báo sự kiện. Thông tin cá nhân không chia sẻ
                cho bên thứ ba ngoài nhãn hàng tài trợ đã cam kết bảo mật. Bạn có quyền yêu cầu xóa dữ liệu sau sự kiện.
              </div>
            </div>

            <div className="mt-5">
              <div className="text-[13px] text-[#ffffff]">3. Chương trình BPoint & Voucher</div>
              <div className="mt-1">
                BPoint tích lũy qua nhiệm vụ, dùng để đổi voucher. BPoint đã đổi không hoàn lại. Voucher chỉ có hiệu lực
                tại sự kiện trong 2 ngày và không quy đổi thành tiền mặt.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleAgree}
            className="mt-3.5 flex w-full items-start gap-2.5 rounded-[1rem] bg-transparent px-1 text-left"
          >
            <div
              className={`mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-[0.4rem] border ${
                agreed
                  ? 'border-[#ff4fb6] bg-[#ff4fb6] text-[#ffffff]'
                  : 'border-[#a16bc7] bg-[#6f35a7]/70 text-transparent'
              }`}
            >
              {agreed ? '✓' : null}
            </div>
            <span className="text-[11px] leading-4.5 text-[#f7e8ff]">
              Tôi đã đọc, hiểu và đồng ý với toàn bộ điều khoản & điều kiện của Beauty Summit
            </span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={!agreed}
            className="mt-3.5 w-full shrink-0 rounded-[1.05rem] px-4 py-3.5 text-[0.96rem] font-black text-white disabled:cursor-not-allowed"
            style={
              agreed
                ? {
                    color: '#ffffff',
                    background: 'linear-gradient(90deg, #612C8F 0%, #DF2757 58%, #5E2F8E 100%)',
                    boxShadow: '0 0 0 1px rgba(255,239,130,0.92), 0 0 20px rgba(255,234,128,0.2)',
                  }
                : {
                    background: 'rgba(108,77,136,0.72)',
                    color: 'rgba(255,255,255,0.72)',
                  }
            }
          >
            Đồng ý & Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsScreen;
