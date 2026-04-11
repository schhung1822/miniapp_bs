import React from 'react';

import BeautyQrCode from '@/features/beauty-summit/components/BeautyQrCode';
import QrPreviewModal from '@/features/beauty-summit/components/QrPreviewModal';
import { CopyIcon, QrIcon } from '@/features/beauty-summit/icons';
import { getMiniAppTicketLockReason, isMiniAppTicketDisabled } from '@/features/beauty-summit/types';
import type { CheckinLog, CheckinZone, MiniAppTicketOrder, TierMeta } from '@/features/beauty-summit/types';

interface QrScreenProps {
  tier: TierMeta;
  ticketLabel: string;
  orderCode: string;
  qrGenerated: boolean;
  availablePoints: number;
  totalPoints: number;
  userName: string;
  userAvatar: string;
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
  onDemoCheckin: (zoneId: string) => void;
  onOpenTicketHelp: () => void;
}

const QrScreen: React.FC<QrScreenProps> = ({
  tier,
  ticketLabel,
  orderCode,
  qrGenerated,
  availablePoints,
  totalPoints,
  userName,
  userAvatar,
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
  onDemoCheckin,
  onOpenTicketHelp,
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
  const canGenerate =
    entryMode === 'manual'
      ? Boolean(orderCode.trim()) && !isMiniAppTicketDisabled(selectedTicket, userPhone)
      : Boolean(selectedTicket && !isMiniAppTicketDisabled(selectedTicket, userPhone));
  const checkinCountByZone = checkinLog.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.zoneId] = (accumulator[item.zoneId] ?? 0) + 1;
    return accumulator;
  }, {});

  const renderTicketList = (): React.ReactNode => {
    if (ticketsLoading) {
      return (
        <div className="rounded-[1.1rem] border border-[#eadfd2] bg-white px-4 py-5 text-center text-sm font-semibold text-[#7a7280]">
          Đang tải danh sách vé...
        </div>
      );
    }

    if (ticketsError) {
      return (
        <div className="rounded-[1.1rem] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          <div className="font-semibold">{ticketsError}</div>
          <button
            type="button"
            onClick={onRefreshTickets}
            className="mt-3 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700"
          >
            Tải lại danh sách vé
          </button>
        </div>
      );
    }

    if (!ticketOrders.length) {
      return (
        <div className="rounded-[1.1rem] border border-[#eadfd2] bg-white px-4 py-5 text-center">
          <div className="text-sm font-semibold text-[#241629]">Chưa tìm thấy vé</div>
          <div className="mt-1 text-xs leading-5 text-[#7a7280]">
            Số điện thoại này chưa có mã vé trên hệ thống Beauty Summit.
          </div>
          <button
            type="button"
            onClick={onRefreshTickets}
            className="mt-4 rounded-full bg-[#fff2cc] px-4 py-2 text-xs font-bold text-[#9f7400]"
          >
            Kiểm tra lại
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        {ticketOrders.map((ticket) => {
          const selected = ticket.code === orderCode;
          const disabled = isMiniAppTicketDisabled(ticket, userPhone);
          const lockReason = getMiniAppTicketLockReason(ticket, userPhone);
          const transferred = lockReason === 'transferred';

          return (
            <div
              key={ticket.code}
              className={`flex items-center gap-2 rounded-[1.15rem] border p-2.5 transition ${
                disabled
                  ? 'border-[#d8d2da] bg-[#f3f0f4]'
                  : selected
                    ? 'border-[#d9a400] bg-[#fff8dc]'
                    : 'border-[#eadfd2] bg-white'
              } ${disabled ? 'opacity-70' : ''}`}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    onSelectTicket(ticket.code);
                  }
                }}
                className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      disabled ? 'bg-[#f1edf2]' : 'bg-[#fff2cc]'
                    }`}
                  >
                    <QrIcon size={19} color={disabled ? '#9a8f9d' : '#b8860b'} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`truncate text-sm font-black tracking-[0.12em] ${
                        disabled ? 'text-[#756f78]' : 'text-[#241629]'
                      }`}
                    >
                      {ticket.code}
                    </div>
                    <div className={`mt-0.5 truncate text-[11px] ${disabled ? 'text-[#918998]' : 'text-[#7a7280]'}`}>
                      {ticket.ticketClass || 'Beauty Summit Ticket'}
                    </div>
                  </div>
                </div>
              </button>
              <div
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  transferred
                    ? 'bg-slate-200 text-slate-600'
                    : ticket.checkedIn
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-[#fff2cc] text-[#9f7400]'
                }`}
              >
                {ticket.statusLabel}
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onCopyTicketCode(ticket.code)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f4edf2] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Copy ${ticket.code}`}
              >
                <CopyIcon size={15} color="#7a7280" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderManualTicketInput = (): React.ReactNode => (
    <div className="rounded-[1.1rem] border border-[#eadfd2] bg-white p-4">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#8b8790]">
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
          className="min-w-0 flex-1 rounded-[1rem] border border-[#eadfd2] bg-[#fffaf2] px-4 py-3 text-center text-sm font-black tracking-[0.16em] text-[#241629] placeholder:text-[#b9afbb]"
        />
        <button
          type="button"
          onClick={() => onCopyTicketCode(orderCode)}
          disabled={!orderCode.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4edf2] disabled:opacity-40"
          aria-label="Copy mã vé"
        >
          <CopyIcon size={16} color="#7a7280" />
        </button>
      </div>
      <div className="mt-3 text-xs leading-5 text-[#7a7280]">
        Nếu mã hợp lệ, hệ thống sẽ tự cập nhật vé này theo thông tin tài khoản hiện tại của bạn.
      </div>
      {selectedTicketLockReason === 'checked-in' ? (
        <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          Vé này đã check-in, vui lòng chọn hoặc nhập mã vé khác.
        </div>
      ) : null}
      {selectedTicketLockReason === 'transferred' ? (
        <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
          Vé này đã được người khác nhận nên tạm khóa trên tài khoản này.
        </div>
      ) : null}
    </div>
  );

  const renderQrPreview = (): React.ReactNode => {
    return (
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
  };

  if (!qrGenerated) {
    return (
      <div className="beauty-scroll h-full overflow-y-auto px-5 pb-10 pt-6">
        <div className="mb-6 text-center">
          <div
            className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-[#170d1d]"
            style={{ background: tier.gradient }}
          >
            {tier.icon} {ticketLabel}
          </div>
          <div className="text-2xl font-black text-[#241629]">Tạo mã QR check-in</div>
          <div className="mt-2 text-sm text-[#7a7280]">
            Chọn một mã vé chưa check-in để tạo mã QR.
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-[#eadfd2] bg-white p-4 shadow-[0_8px_18px_rgba(36,22,41,0.06)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#8b8790]">
                Danh sách mã vé
              </label>
              <div className="mt-1 text-[11px] text-[#7a7280]">{maskedPhone}</div>
            </div>
            <button
              type="button"
              onClick={onOpenTicketHelp}
              className="rounded-full bg-[#fff2cc] px-3 py-2 text-[11px] font-bold text-[#9f7400]"
            >
              Hướng dẫn
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 rounded-[1rem] bg-white p-1">
            <button
              type="button"
              onClick={() => setEntryMode('auto')}
              className={`rounded-[0.85rem] px-3 py-2.5 text-xs font-bold ${
                entryMode === 'auto' ? '!text-white' : 'text-[#7a7280]'
              }`}
              style={entryMode === 'auto' ? { background: 'linear-gradient(135deg, #b8860b, #ffd970)' } : undefined}
            >
              Hệ thống tự lấy
            </button>
            <button
              type="button"
              onClick={() => setEntryMode('manual')}
              className={`rounded-[0.85rem] px-3 py-2.5 text-xs font-bold ${
                entryMode === 'manual' ? '!text-white' : 'text-[#7a7280]'
              }`}
              style={entryMode === 'manual' ? { background: 'linear-gradient(135deg, #b8860b, #ffd970)' } : undefined}
            >
              Tự nhập mã vé
            </button>
          </div>

          {entryMode === 'auto' ? renderTicketList() : renderManualTicketInput()}

          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="mt-4 w-full rounded-[1.15rem] px-4 py-4 text-sm font-bold disabled:cursor-not-allowed disabled:bg-[#d1d5db] disabled:text-[#6b7280]"
            style={canGenerate ? { background: 'linear-gradient(135deg, #f59e0b, #ffd970)', color: '#170d1d' } : undefined}
          >
            Tạo mã QR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="beauty-scroll h-full overflow-y-auto px-4 pb-10 pt-5">
      <div
        className="mb-4 rounded-[1.3rem] border bg-white p-4 shadow-[0_8px_18px_rgba(36,22,41,0.06)]"
        style={{ borderColor: `${tier.color}33` }}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-[#170d1d]"
                style={{ background: tier.gradient }}
              >
                {tier.icon} {ticketLabel}
              </div>
              <img
                src={userAvatar}
                alt={userName}
                className="h-11 w-11 shrink-0 rounded-full border border-[#eadfd2] object-cover"
              />
            </div>
            <div className="text-lg font-bold text-[#241629]">{userName}</div>
            <div className="mt-1 text-sm text-[#7a7280]">{maskedPhone}</div>
            <button
              type="button"
              onClick={onEditTicketCode}
              className="mt-2 inline-flex rounded-full border border-[#eadfd2] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#7a5200]"
            >
              Đổi vé
            </button>
          </div>
          <button
            type="button"
            onClick={() => setQrPreviewOpen(true)}
            className="beauty-crisp-edge h-24 w-24 shrink-0 rounded-[1rem] bg-white p-2 shadow-[0_12px_24px_rgba(184,134,11,0.14)]"
            aria-label="Mở mã QR lớn"
          >
            <BeautyQrCode
              value={qrValue}
              size={80}
              wrapperClassName="h-full w-full overflow-hidden rounded-xl"
              canvasClassName="h-full w-full rounded-xl"
              logoSize={12}
              logoRingClassName="border-[4px] shadow-[0_4px_12px_rgba(178,71,125,0.12)]"
            />
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-[1rem] border border-[#eadfd2] bg-white px-3 py-4 text-center">
          <div className="text-xl font-black text-pink-500">{checkinLog.length}</div>
          <div className="mt-1 text-[11px] text-[#7a7280]">lần check-in</div>
        </div>
        <div className="rounded-[1rem] border border-[#eadfd2] bg-white px-3 py-4 text-center">
          <div className="text-xl font-black text-sky-500">
            {Object.keys(checkinCountByZone).length}/{zones.length}
          </div>
          <div className="mt-1 text-[11px] text-[#7a7280]">khu vực</div>
        </div>
        <div className="rounded-[1rem] border border-[#eadfd2] bg-white px-3 py-4 text-center">
          <div className="text-xl font-black text-amber-500">{availablePoints}</div>
          <div className="mt-1 text-[11px] text-[#7a7280]">BP / {totalPoints}</div>
        </div>
      </div>

      <div className="mb-2 text-sm font-bold text-[#241629]">Khu vực check-in</div>
      <div className="mb-4 text-xs text-[#7a7280]">
        Staff ở mỗi điểm sẽ quét QR của bạn. Bấm “demo” để giả lập thao tác quét.
      </div>

      <div className="space-y-3">
        {zones.map((zone) => {
          const count = checkinCountByZone[zone.id] ?? 0;
          const logs = checkinLog.filter((item) => item.zoneId === zone.id);

          return (
            <div
              key={zone.id}
              className="rounded-[1.1rem] border bg-white p-4 shadow-[0_6px_14px_rgba(36,22,41,0.04)]"
              style={{
                borderColor: count > 0 ? `${zone.color}33` : '#eadfd2',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="beauty-crisp-edge flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                  style={{ background: `${zone.color}1e`, border: `1px solid ${zone.color}30` }}
                >
                  <BeautyQrCode
                    value={qrValue}
                    size={26}
                    wrapperClassName="h-[26px] w-[26px]"
                    canvasClassName="h-[26px] w-[26px] rounded-[0.45rem]"
                    logoSize={8}
                    logoRingClassName="border-[3px]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#241629]">{zone.name}</div>
                  <div className="mt-1 text-xs text-[#7a7280]">{zone.location}</div>
                  <div className="mt-2 text-xs text-[#7a7280]">{zone.desc}</div>
                </div>
                <div className="text-right text-xs font-semibold" style={{ color: zone.color }}>
                  {count > 0 ? `${count} lượt` : 'Chờ quét'}
                </div>
              </div>
              {logs.length > 0 ? (
                <div className="mt-3 space-y-1 pl-[52px] text-xs text-[#7a7280]">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: zone.color }} />
                      <span>{log.day}</span>
                      <span className="font-semibold" style={{ color: zone.color }}>
                        {log.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => onDemoCheckin(zone.id)}
                className="mt-3 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                style={{
                  color: zone.color,
                  background: `${zone.color}0e`,
                  border: `1px dashed ${zone.color}33`,
                }}
              >
                Demo: staff quét
              </button>
            </div>
          );
        })}
      </div>

      {renderQrPreview()}
    </div>
  );
};

export default QrScreen;
