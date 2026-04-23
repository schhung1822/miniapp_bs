import React from 'react';

import goldTicketBadge from '@/assets/gold.svg';
import logoOnboarding from '@/assets/logo-onboarding.png';
import vipTicketBadge from '@/assets/vip.svg';
import BeautyQrCode from '@/features/beauty-summit/components/BeautyQrCode';
import QrPreviewModal from '@/features/beauty-summit/components/QrPreviewModal';
import { CopyIcon, QrIcon } from '@/features/beauty-summit/icons';
import { getMiniAppTicketLockReason, isMiniAppTicketDisabled } from '@/features/beauty-summit/types';
import type { CheckinLog, CheckinZone, MiniAppTicketOrder } from '@/features/beauty-summit/types';

interface QrScreenProps {
  ticketLabel: string;
  orderCode: string;
  qrGenerated: boolean;
  availablePoints: number;
  userName: string;
  userPhone: string;
  qrValue: string;
  zones: CheckinZone[];
  checkinLog: CheckinLog[];
  ticketOrders: MiniAppTicketOrder[];
  ticketsLoading: boolean;
  ticketsError: string | null;
  onOrderCodeChange: (value: string) => void;
  onSelectTicket: (ticketCode: string) => void;
  onGenerate: () => void | Promise<void>;
  onEditTicketCode: () => void;
  onCopyTicketCode: (ticketCode: string) => void;
  onRefreshTickets: () => void;
  onOpenTicketHelp: () => void;
  onClose: () => void;
}

const DEFAULT_CHECKIN_LOCATION = 'VEC Đông Anh - Cổng chính';

const formatDisplayDate = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const datePart = value.split('T')[0] ?? '';
  const [year, month, day] = datePart.split('-');

  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const dayValue = String(parsedDate.getDate()).padStart(2, '0');
  const monthValue = String(parsedDate.getMonth() + 1).padStart(2, '0');
  return `${dayValue}/${monthValue}/${parsedDate.getFullYear()}`;
};

const HoangTuWordmark: React.FC = () => (
  <div className="text-left">
    <div className="text-[1.1rem] font-black uppercase leading-none tracking-[0.03em] text-white/90">
      HOANG TU
    </div>
    <div className="mt-0.5 text-[0.48rem] font-medium uppercase leading-none tracking-[0.3em] text-[#f4dfff]">
      HOLDINGS
    </div>
  </div>
);

const TicketFoundIcon: React.FC = () => (
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1fc316] shadow-[0_14px_28px_rgba(31,195,22,0.24)]">
    <svg width="22" height="22" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4.2 9.2l2.8 2.8 6.8-7"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const buildTicketDisplayLabel = (ticketClass: string): string => {
  const normalizedClass = ticketClass.trim().toUpperCase();

  if (normalizedClass.startsWith('VÉ ') || normalizedClass.startsWith('VE ')) {
    return normalizedClass;
  }

  return `VÉ ${normalizedClass || 'STANDARD'}`;
};

const buildZoneLocationLabel = (zone: CheckinZone): string => {
  const explicitLocation = String(zone.location ?? '').trim();
  if (explicitLocation) {
    return explicitLocation;
  }

  return DEFAULT_CHECKIN_LOCATION;
};

const TicketTypeBadge: React.FC<{ label: string; isVip: boolean }> = ({ label, isVip }) => {
  if (isVip) {
    return (
      <img
        src={vipTicketBadge}
        alt={label}
        className="h-[2.05rem] w-auto max-w-[7rem] object-contain drop-shadow-[0_10px_18px_rgba(95,28,144,0.24)]"
      />
    );
  }

  return (
    <div className="relative inline-flex h-[2.05rem] min-w-[7rem] items-center justify-center px-4">
      <img
        src={goldTicketBadge}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-fill"
      />
      <span className="relative truncate text-[0.61rem] font-black uppercase leading-none tracking-[-0.01em] text-[#fff4db]">
        {label}
      </span>
    </div>
  );
};

const QrScreen: React.FC<QrScreenProps> = ({
  ticketLabel,
  orderCode,
  qrGenerated,
  availablePoints,
  userName,
  userPhone,
  qrValue,
  zones,
  checkinLog,
  ticketOrders,
  ticketsLoading,
  ticketsError,
  onOrderCodeChange,
  onSelectTicket,
  onGenerate,
  onEditTicketCode,
  onCopyTicketCode,
  onRefreshTickets,
  onOpenTicketHelp,
  onClose,
}) => {
  const [entryMode, setEntryMode] = React.useState<'auto' | 'manual'>('auto');
  const [qrPreviewOpen, setQrPreviewOpen] = React.useState<boolean>(false);

  const selectedTicket = ticketOrders.find((ticket) => ticket.code === orderCode);
  const selectedTicketLockReason = getMiniAppTicketLockReason(selectedTicket, userPhone);
  const maskedPhone = React.useMemo(() => {
    const digits = userPhone.replace(/\D/g, '');
    const localDigits = digits.length === 11 && digits.startsWith('84') ? `0${digits.slice(2)}` : digits;

    if (localDigits.length !== 10) {
      return userPhone;
    }

    return `${localDigits.slice(0, 4)} *** ${localDigits.slice(7)}`;
  }, [userPhone]);
  const linkedPhoneLabel = maskedPhone || 'tài khoản hiện tại';
  const canGenerate =
    entryMode === 'manual'
      ? Boolean(orderCode.trim()) && !isMiniAppTicketDisabled(selectedTicket, userPhone)
      : Boolean(selectedTicket && !isMiniAppTicketDisabled(selectedTicket, userPhone));
  const checkinCountByZone = checkinLog.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.zoneId] = (accumulator[item.zoneId] ?? 0) + 1;
    return accumulator;
  }, {});
  const checkedZoneCount = zones.reduce((total, zone) => {
    if (!zone.id) {
      return total;
    }

    return total + ((checkinCountByZone[zone.id] ?? 0) > 0 ? 1 : 0);
  }, 0);
  const selectedTicketLabel = buildTicketDisplayLabel(selectedTicket?.ticketClass ?? ticketLabel);
  const selectedTicketIsVip = selectedTicketLabel.includes('VIP');
  const passHolderName = userName.trim().length > 0 ? userName.trim().toUpperCase() : userName;

  const renderTicketList = (): React.ReactNode => {
    if (ticketsLoading) {
      return (
        <div className="rounded-[1.65rem] border border-white/12 bg-white/[0.05] px-4 py-6 text-center text-sm font-semibold text-white/72">
          Đang tải danh sách vé...
        </div>
      );
    }

    if (ticketsError) {
      return (
        <div className="rounded-[1.65rem] border border-[#ff6aa7]/40 bg-[#3a1634] px-4 py-4 text-sm text-[#ffd6e8]">
          <div className="font-semibold">{ticketsError}</div>
          <button
            type="button"
            onClick={onRefreshTickets}
            className="mt-3 rounded-full border border-[#ff72b2]/55 bg-[#ff4fb61a] px-3.5 py-1.5 text-xs font-bold text-[#ff8bc7]"
          >
            Tải lại danh sách vé
          </button>
        </div>
      );
    }

    if (!ticketOrders.length) {
      return (
        <div className="rounded-[1.65rem] border border-white/12 bg-white/[0.05] px-4 py-5 text-center">
          <div className="text-sm font-semibold text-white">Chưa tìm thấy vé</div>
          <div className="mt-1 text-xs leading-5 text-white/62">
            Số điện thoại này chưa có mã vé trên hệ thống Beauty Summit.
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onRefreshTickets}
              className="rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-bold text-white"
            >
              Kiểm tra lại
            </button>
            <button
              type="button"
              onClick={() => setEntryMode('manual')}
              className="rounded-full border border-[#ff6ab6]/45 bg-[#ff4fb61a] px-4 py-2 text-xs font-bold text-[#ff8dc8]"
            >
              Tự nhập mã vé
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="beauty-scroll h-full min-h-0 space-y-3 overflow-y-auto pr-1">
        {ticketOrders.map((ticket) => {
          const selected = ticket.code === orderCode;
          const lockReason = getMiniAppTicketLockReason(ticket, userPhone);
          const disabled = isMiniAppTicketDisabled(ticket, userPhone);
          const displayTicketLabel = buildTicketDisplayLabel(ticket.ticketClass);
          const showVipTicketImage = displayTicketLabel.includes('VIP');
          const purchaseDate = formatDisplayDate(ticket.createdAt);
          const checkinDate = formatDisplayDate(ticket.checkinTime);
          const primaryLine =
            lockReason === 'transferred'
              ? 'Vé này đã được chuyển sang tài khoản khác'
              : ticket.checkedIn
                ? checkinDate
                  ? `Đã check-in ngày ${checkinDate}`
                  : 'Vé đã check-in'
                : 'Sử dụng cho sự kiện 19 & 20/06';
          const secondaryLine = purchaseDate ? `Mua ngày ${purchaseDate}` : `Liên kết với SĐT ${linkedPhoneLabel}`;

          return (
            <button
              key={ticket.code}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  onSelectTicket(ticket.code);
                }
              }}
              className={`w-full rounded-[1rem] border-2 p-2 text-left bg-[linear-gradient(180deg,rgba(42,34,68,0.98)_0%,rgba(30,27,49,0.98)_100%)] transition bg-gray ${
                disabled
                  ? 'cursor-not-allowed border-white/8 bg-white/[0.03] opacity-60'
                  : selected
                    ? 'border-[#ff35aa] shadow-[0_0_0_1px_rgba(255,53,170,0.24)]'
                    : 'hover:border-white/28'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex min-h-[5.8rem] items-center">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                      selected ? 'border-[#ff4fb6] bg-[#ff4fb61a]' : 'border-white/38 bg-transparent'
                    }`}
                  >
                    <div className={`h-3 w-3 rounded-full ${selected ? 'bg-[#ff3cad]' : 'bg-transparent'}`} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <TicketTypeBadge label={displayTicketLabel} isVip={showVipTicketImage} />
                  </div>
                  <div className="truncate text-[1rem] font-black leading-none tracking-[-0.03em] text-white/90">
                    {ticket.code}
                  </div>
                  <div className="mt-1 truncate text-[0.8rem] text-white/90 sm:text-[0.88rem]">{primaryLine}</div>
                  <div className="truncate text-[0.8rem] text-white/70 sm:text-[0.88rem]">{secondaryLine}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderManualTicketInput = (): React.ReactNode => (
    <div className="rounded-[0.7rem] border border-white/12 bg-white/[0.05] p-4">
      <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.18em]">
        Nhập mã vé
      </label>
      <div className="flex items-center gap-2">
        <input
          value={orderCode}
          onChange={(event) => onOrderCodeChange(event.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && canGenerate) {
              void onGenerate();
            }
          }}
          placeholder="DHMN4S154"
          className="min-w-0 flex-1 rounded-[1.05rem] border border-white/12 bg-[#25223b] px-4 py-3 text-center text-sm font-black tracking-[0.14em] text-white"
        />
        <button
          type="button"
          onClick={() => onCopyTicketCode(orderCode)}
          disabled={!orderCode.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.07] disabled:opacity-40"
          aria-label="Copy mã vé"
        >
          <CopyIcon size={16} color="#000" />
        </button>
      </div>
      <div className="mt-3 text-[0.82rem] leading-5">
        Nếu mã hợp lệ, hệ thống sẽ tự cập nhật vé này theo thông tin tài khoản hiện tại của bạn.
      </div>
      {selectedTicketLockReason === 'transferred' ? (
        <div className="mt-3 rounded-[1rem] border border-white/12 bg-white/[0.06] px-3 py-2 text-[0.8rem] font-semibold text-[#f2d2df]">
          Vé này đã được người khác nhận nên tạm khóa trên tài khoản này.
        </div>
      ) : null}
    </div>
  );

  const renderQrPreview = (): React.ReactNode => (
    <QrPreviewModal
      open={qrPreviewOpen}
      userName={userName}
      orderCode={orderCode}
      qrValue={qrValue}
      onClose={() => setQrPreviewOpen(false)}
      onChangeTicket={() => {
        setQrPreviewOpen(false);
        onEditTicketCode();
      }}
    />
  );

  if (!qrGenerated) {
    return (
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden px-5 pb-6 pt-5 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#18172c_0%,#1b1a31_54%,#161526_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(255,76,181,0.16),transparent_72%)]" />
        <div className="pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,71,169,0.12),transparent_72%)]" />
        <div className="pointer-events-none absolute bottom-[-4rem] right-[-3rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(128,102,255,0.14),transparent_72%)]" />

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
          <div className="shrink-0">
            <div className="flex items-center gap-3.5">
              <img
                src={logoOnboarding}
                alt="Beauty Summit"
                className="h-[2.6rem] w-auto max-w-[8.8rem] object-contain"
              />
              <HoangTuWordmark />
            </div>

            <div className="mt-7 flex items-center gap-3">
              <TicketFoundIcon />
              <div className="min-w-0">
                <div className="text-[1rem] font-black leading-tight text-[#ff4fb6]">
                  Tìm thấy {ticketOrders.length} vé
                </div>
                <div className="truncate text-[0.88rem] text-white/82">
                  Liên kết với SĐT {linkedPhoneLabel}
                </div>
              </div>
            </div>

            <div className="mt-1 text-[0.88rem] leading-6 text-white/80">
              Vui lòng chọn vé bạn muốn sử dụng cho sự kiện.
              <br />
              Mỗi vé tạo 1 mã QR riêng.
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onOpenTicketHelp}
                className="rounded-full bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold"
              >
                Tìm mã vé ở đâu?
              </button>
              <button
                type="button"
                onClick={() => setEntryMode((current) => (current === 'auto' ? 'manual' : 'auto'))}
                className="rounded-full border border-[#ff72ba]/45 bg-[#ff4fb61a] px-3.5 py-1.5 text-[0.82rem] font-semibold text-[#ff8dc8]"
              >
                {entryMode === 'auto' ? 'Tự nhập mã vé' : 'Xem danh sách vé'}
              </button>
            </div>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-hidden">
            {entryMode === 'auto' ? renderTicketList() : renderManualTicketInput()}
          </div>

          <div className="mt-5 flex shrink-0 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[0.5rem] bg-[#313049] px-4 py-3.5 text-[1.02rem] text-white/90"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate}
              className="flex-[1.42] rounded-[0.5rem] px-4 py-3.5 text-[1.02rem] text-white/90 disabled:cursor-not-allowed disabled:bg-[#38374d] disabled:text-white/40"
              style={
                canGenerate
                  ? {
                      background: 'linear-gradient(90deg, #ff3fa8 0%, #ff2f8e 100%)',
                      boxShadow: '0 16px 28px rgba(255, 63, 168, 0.22)',
                    }
                  : undefined
              }
            >
              Tạo QR →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="beauty-scroll relative h-full overflow-y-auto px-4 pb-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#5816b7_0%,#8916b1_26%,#bf118f_62%,#dd0f76_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_76%)]" />
      <div className="pointer-events-none absolute left-[-5rem] top-[11rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(90,214,255,0.12)_0%,rgba(90,214,255,0)_72%)]" />
      <div className="pointer-events-none absolute bottom-[8rem] right-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,175,225,0.18)_0%,rgba(255,175,225,0)_72%)]" />

      <div className="relative z-[1]">
        <div className="beauty-glow beauty-crisp-edge mt-4 overflow-hidden rounded-[1.45rem] border border-[#ff53bf] bg-[linear-gradient(135deg,rgba(122,23,170,0.95)_0%,rgba(141,19,167,0.97)_52%,rgba(113,14,153,0.98)_100%)] shadow-[0_18px_34px_rgba(85,8,123,0.24)]">
          <div className="relative p-4">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,198,237,0.22)_0%,rgba(255,198,237,0)_72%)]" />
            <div className="pointer-events-none absolute right-4 top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(125,112,255,0.24)_0%,rgba(125,112,255,0)_72%)]" />

            <div className="grid grid-cols-[minmax(0,1fr)_118px] items-center gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <img
                    src={logoOnboarding}
                    alt="Beauty Summit"
                    className="h-[22px] w-auto max-w-[92px] object-contain"
                  />
                  <HoangTuWordmark />
                </div>

                <div className="mt-1">
                  <TicketTypeBadge label={selectedTicketLabel} isVip={selectedTicketIsVip} />
                </div>

                <div className="mt-1 truncate text-[1.08rem] font-black uppercase tracking-[-0.03em] text-white/90">
                  {passHolderName}
                </div>
                <div className="mt-1 text-[0.82rem] font-medium text-white/58">{maskedPhone}</div>
                <div className="truncate text-[0.9rem] font-medium text-white/58">{orderCode}</div>
              </div>

              <button
                type="button"
                onClick={() => setQrPreviewOpen(true)}
                className="beauty-crisp-edge flex justify-center rounded-[1.25rem] bg-white p-2.5 shadow-[0_14px_28px_rgba(24,12,39,0.26)]"
                aria-label="Mở mã QR lớn"
              >
                <BeautyQrCode
                  value={qrValue}
                  size={96}
                  wrapperClassName="h-[96px] w-[96px] overflow-hidden rounded-[0.85rem]"
                  canvasClassName="h-full w-full rounded-[0.85rem]"
                  logoSize={12}
                  logoRingClassName="border-[4px] shadow-[0_4px_12px_rgba(178,71,125,0.12)]"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-[1.2rem] border border-white/26 bg-[rgba(75,22,118,0.56)] px-3 py-4 text-center shadow-[0_12px_24px_rgba(78,6,109,0.14)] backdrop-blur-[2px]">
            <div className="text-[2rem] font-black leading-none text-[#ff59c6]">{checkinLog.length}</div>
            <div className="mt-1 text-[0.78rem] font-medium leading-none text-white/90">Lần check-in</div>
          </div>
          <div className="rounded-[1.2rem] border border-white/26 bg-[rgba(75,22,118,0.56)] px-3 py-4 text-center shadow-[0_12px_24px_rgba(78,6,109,0.14)] backdrop-blur-[2px]">
            <div className="text-[2rem] font-black leading-none text-[#ff59c6]">
              {checkedZoneCount}/{zones.length}
            </div>
            <div className="mt-1 text-[0.78rem] font-medium leading-none text-white/90">Khu vực</div>
          </div>
          <div className="rounded-[1.2rem] border border-white/26 bg-[rgba(75,22,118,0.56)] px-3 py-4 text-center shadow-[0_12px_24px_rgba(78,6,109,0.14)] backdrop-blur-[2px]">
            <div className="text-[2rem] font-black leading-none text-[#ff59c6]">{availablePoints}</div>
            <div className="mt-1 text-[0.78rem] font-medium leading-none text-white/90">B-point</div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <div className="text-[1rem] leading-[1.15] tracking-[-0.03em] text-white/90">
            Sử dụng mã QR và check-in
          </div>
          <div className="text-[1rem] leading-[1.15] tracking-[-0.03em] text-white/90">
            tại các điểm của sự kiện
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {zones.length ? (
            zones.map((zone) => {
              const zoneId = zone.id ?? zone.name ?? 'zone';
              const count = zone.id ? checkinCountByZone[zone.id] ?? 0 : 0;
              const locationLabel = buildZoneLocationLabel(zone);
              const statusLabel = count > 0 ? (count > 1 ? `${count} lượt` : 'Đã quét') : 'Chờ quét';

              return (
                <div
                  key={zoneId}
                  className="rounded-[1.25rem] border border-white/24 bg-[linear-gradient(135deg,rgba(118,23,163,0.94)_0%,rgba(112,21,159,0.96)_100%)] px-4 py-4 shadow-[0_16px_30px_rgba(72,6,103,0.18)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-[3.1rem] w-[3.1rem] shrink-0 items-center justify-center rounded-[0.9rem] border border-[#ff7fd7]/34 bg-[#ff50b81a]">
                      <QrIcon size={28} color="#ff6fd0" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[1.02rem] font-black leading-tight text-white/90">
                        {zone.name ?? 'Khu vực check-in'}
                      </div>
                      <div className="mt-1 truncate text-[0.84rem] font-medium text-white/64">
                        {locationLabel}
                      </div>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
                        count > 0
                          ? 'border border-[#ff93da]/42 bg-[#ff4fb61f] text-[#ffd4ee]'
                          : 'bg-[#4b425e] text-white/80'
                      }`}
                    >
                      {statusLabel}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-[1.25rem] border border-white/20 bg-[rgba(83,25,120,0.54)] px-4 py-5 text-center text-[0.92rem] font-medium text-white/74">
              Danh sách khu vực check-in sẽ hiển thị sau khi hệ thống tải dữ liệu từ backend.
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mx-auto flex mt-5 items-center gap-2 text-[1.02rem] font-medium text-white/70 transition hover:text-white"
        >
          <span className="text-[1.2rem] leading-none">←</span>
          <span>Quay lại</span>
        </button>
      </div>

      {renderQrPreview()}
    </div>
  );
};

export default QrScreen;
