import React from 'react';

import { QrIcon } from '@/features/beauty-summit/icons';
import type { CheckinLog, CheckinZone, TierMeta } from '@/features/beauty-summit/types';

interface QrScreenProps {
  tier: TierMeta;
  orderCode: string;
  qrGenerated: boolean;
  availablePoints: number;
  totalPoints: number;
  userName: string;
  userPhone: string;
  qrMarkup: string;
  zones: CheckinZone[];
  checkinLog: CheckinLog[];
  onOrderCodeChange: (value: string) => void;
  onGenerate: () => void;
  onDemoCheckin: (zoneId: string) => void;
  onOpenTicketHelp: () => void;
}

const QrScreen: React.FC<QrScreenProps> = ({
  tier,
  orderCode,
  qrGenerated,
  availablePoints,
  totalPoints,
  userName,
  userPhone,
  qrMarkup,
  zones,
  checkinLog,
  onOrderCodeChange,
  onGenerate,
  onDemoCheckin,
  onOpenTicketHelp,
}) => {
  const checkinCountByZone = checkinLog.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.zoneId] = (accumulator[item.zoneId] ?? 0) + 1;
    return accumulator;
  }, {});

  if (!qrGenerated) {
    return (
      <div className="h-full overflow-y-auto px-5 pb-10 pt-6">
        <div className="mb-6 text-center">
          <div
            className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-[#170d1d]"
            style={{ background: tier.gradient }}
          >
            {tier.icon} {tier.name} Pass
          </div>
          <div className="text-2xl font-black text-white">Tạo mã QR check-in</div>
          <div className="mt-2 text-sm text-zinc-400">Nhập mã vé để kích hoạt app Beauty Summit 2026.</div>
        </div>

        <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.04] p-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Mã đơn hàng
          </label>
          <input
            value={orderCode}
            onChange={(event) => onOrderCodeChange(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onGenerate();
              }
            }}
            placeholder="VD: BS2026-PRE-12345"
            className="mb-3 w-full rounded-[1.1rem] border border-white/10 bg-black/20 px-4 py-4 text-center text-base font-semibold tracking-[0.24em] text-white placeholder:text-zinc-500"
          />
          <div className="mb-4 text-center text-xs text-zinc-500">
            Mã được gửi qua email hoặc tin nhắn Zalo khi mua vé.
          </div>

          <button
            type="button"
            onClick={onOpenTicketHelp}
            className="mb-4 flex w-full items-center gap-3 rounded-[1rem] border border-amber-300/15 bg-amber-300/5 px-4 py-4 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-300/12">
              <QrIcon color="#ffd970" />
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-200">Tìm mã ở đâu?</div>
              <div className="text-xs text-zinc-400">Xem nhanh 2 trường hợp nhận mã vé.</div>
            </div>
          </button>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!orderCode.trim()}
            className="w-full rounded-[1.15rem] px-4 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-zinc-500"
            style={orderCode.trim() ? { background: 'linear-gradient(135deg, #f59e0b, #ffd970)', color: '#170d1d' } : undefined}
          >
            Tạo mã QR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 pb-10 pt-5">
      <div
        className="mb-4 rounded-[1.3rem] border p-4"
        style={{
          borderColor: `${tier.color}33`,
          background: `linear-gradient(145deg, ${tier.color}1e, rgba(255,255,255,0.04))`,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div
              className="mb-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-[#170d1d]"
              style={{ background: tier.gradient }}
            >
              {tier.icon} {tier.name} Pass
            </div>
            <div className="text-lg font-bold text-white">{userName}</div>
            <div className="mt-1 text-sm text-zinc-300">{userPhone}</div>
            <div className="mt-2 text-xs tracking-[0.22em] text-zinc-500">{orderCode}</div>
          </div>
          <div className="h-24 w-24 shrink-0 rounded-[1rem] bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
            <div
              className="h-full w-full overflow-hidden rounded-xl"
              dangerouslySetInnerHTML={{ __html: qrMarkup }}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-[1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
          <div className="text-xl font-black text-pink-300">{checkinLog.length}</div>
          <div className="mt-1 text-[11px] text-zinc-400">lần check-in</div>
        </div>
        <div className="rounded-[1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
          <div className="text-xl font-black text-sky-300">
            {Object.keys(checkinCountByZone).length}/{zones.length}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">khu vực</div>
        </div>
        <div className="rounded-[1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
          <div className="text-xl font-black text-amber-200">{availablePoints}</div>
          <div className="mt-1 text-[11px] text-zinc-400">BP / {totalPoints}</div>
        </div>
      </div>

      <div className="mb-2 text-sm font-bold text-white">Khu vực check-in</div>
      <div className="mb-4 text-xs text-zinc-500">
        Staff ở mỗi điểm sẽ quét QR của bạn. Bấm “demo” để giả lập thao tác quét.
      </div>

      <div className="space-y-3">
        {zones.map((zone) => {
          const count = checkinCountByZone[zone.id] ?? 0;
          const logs = checkinLog.filter((item) => item.zoneId === zone.id);

          return (
            <div
              key={zone.id}
              className="rounded-[1.1rem] border p-4"
              style={{
                borderColor: count > 0 ? `${zone.color}33` : 'rgba(255,255,255,0.08)',
                background: count > 0 ? `${zone.color}12` : 'rgba(255,255,255,0.03)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `${zone.color}1e`, border: `1px solid ${zone.color}30` }}
                >
                  <QrIcon color={zone.color} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white">{zone.name}</div>
                  <div className="mt-1 text-xs text-zinc-400">{zone.location}</div>
                  <div className="mt-2 text-xs text-zinc-500">{zone.desc}</div>
                </div>
                <div className="text-right text-xs font-semibold" style={{ color: zone.color }}>
                  {count > 0 ? `${count} lượt` : 'Chờ quét'}
                </div>
              </div>
              {logs.length > 0 ? (
                <div className="mt-3 space-y-1 pl-[52px] text-xs text-zinc-400">
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
    </div>
  );
};

export default QrScreen;
