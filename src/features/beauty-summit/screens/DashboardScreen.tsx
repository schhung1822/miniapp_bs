import React from 'react';

import {
  BPOINT_VOUCHERS,
  FREE_VOUCHERS,
  MILESTONES,
  POLICY_SECTIONS,
  VOTE_CATEGORIES,
} from '@/features/beauty-summit/data';
import type {
  BeautyTab,
  Milestone,
  Mission,
  MissionPhase,
  PolicySection,
  TierMeta,
  Voucher,
  VoucherTab,
  VoteBrand,
  VoteCategory,
} from '@/features/beauty-summit/types';
import { getToneClasses, normalizeQuery } from '@/features/beauty-summit/utils';
import {
  CalendarIcon,
  ClockIcon,
  GiftIcon,
  PolicyIcon,
  QrIcon,
  SearchIcon,
  StarIcon,
  VoucherIcon,
  VoteIcon,
} from '@/features/beauty-summit/icons';
import BrandDetailDrawer from '@/features/beauty-summit/components/BrandDetailDrawer';
import InternalTabBar from '@/features/beauty-summit/components/InternalTabBar';
import MilestoneModal from '@/features/beauty-summit/components/MilestoneModal';
import MissionCard from '@/features/beauty-summit/components/MissionCard';
import MissionDrawer from '@/features/beauty-summit/components/MissionDrawer';
import VoucherCodeModal from '@/features/beauty-summit/components/VoucherCodeModal';

interface DashboardScreenProps {
  tier: TierMeta;
  activeTab: BeautyTab;
  activePhase: MissionPhase;
  voucherTab: VoucherTab;
  proofValue: string;
  progress: number;
  totalPoints: number;
  spentPoints: number;
  availablePoints: number;
  qrGenerated: boolean;
  userName: string;
  userPhone: string;
  orderCode: string;
  qrMarkup: string;
  currentPhaseMissions: Mission[];
  allMissionCount: number;
  completedIds: string[];
  claimedFreeVoucherIds: string[];
  redeemedVoucherIds: string[];
  claimedMilestonePcts: number[];
  votes: Record<string, string>;
  voteQuery: string;
  selectedVoucher: Voucher | null;
  selectedBrand: VoteBrand | null;
  selectedCategory: VoteCategory | null;
  selectedMilestone: Milestone | null;
  expandedMission: Mission | null;
  phaseProgressMap: Record<MissionPhase, number>;
  onTabChange: (tab: BeautyTab) => void;
  onPhaseChange: (phase: MissionPhase) => void;
  onVoucherTabChange: (tab: VoucherTab) => void;
  onProofValueChange: (value: string) => void;
  onOpenMission: (mission: Mission) => void;
  onCloseMission: () => void;
  onSubmitMission: () => void;
  onVoteQueryChange: (value: string) => void;
  onToggleVote: (category: VoteCategory, brand: VoteBrand) => void;
  onOpenBrand: (category: VoteCategory, brand: VoteBrand) => void;
  onCloseBrand: () => void;
  onOpenVoucher: (voucher: Voucher) => void;
  onCloseVoucher: () => void;
  onRedeemVoucher: (voucher: Voucher) => void;
  onClaimVoucher: (voucher: Voucher) => void;
  onOpenMilestone: (milestone: Milestone) => void;
  onCloseMilestone: () => void;
  onClaimMilestone: () => void;
  onOpenQr: () => void;
}

const phaseItems: Array<{
  key: MissionPhase;
  label: string;
  sub?: string;
  renderIcon: (active: boolean) => React.ReactNode;
}> = [
  {
    key: 'before',
    label: 'Nhiệm vụ trước sự kiện',
    renderIcon: (active) => <ClockIcon size={19} color={active ? '#fff' : '#696a73'} />,
  },
  {
    key: 'day1',
    label: 'Nhiệm vụ ngày 1',
    sub: '19/06/2026',
    renderIcon: (active) => <CalendarIcon size={19} color={active ? '#fff' : '#696a73'} />,
  },
  {
    key: 'day2',
    label: 'Nhiệm vụ ngày 2',
    sub: '20/06/2026',
    renderIcon: (active) => <CalendarIcon size={19} color={active ? '#fff' : '#696a73'} />,
  },
];

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  tier,
  activeTab,
  activePhase,
  voucherTab,
  proofValue,
  progress,
  totalPoints,
  spentPoints,
  availablePoints,
  qrGenerated,
  userName,
  userPhone,
  orderCode,
  qrMarkup,
  currentPhaseMissions,
  allMissionCount,
  completedIds,
  claimedFreeVoucherIds,
  redeemedVoucherIds,
  claimedMilestonePcts,
  votes,
  voteQuery,
  selectedVoucher,
  selectedBrand,
  selectedCategory,
  selectedMilestone,
  expandedMission,
  phaseProgressMap,
  onTabChange,
  onPhaseChange,
  onVoucherTabChange,
  onProofValueChange,
  onOpenMission,
  onCloseMission,
  onSubmitMission,
  onVoteQueryChange,
  onToggleVote,
  onOpenBrand,
  onCloseBrand,
  onOpenVoucher,
  onCloseVoucher,
  onRedeemVoucher,
  onClaimVoucher,
  onOpenMilestone,
  onCloseMilestone,
  onClaimMilestone,
  onOpenQr,
}) => {
  const completedSet = new Set(completedIds);
  const claimedFreeSet = new Set(claimedFreeVoucherIds);
  const redeemedSet = new Set(redeemedVoucherIds);
  const milestoneSet = new Set(claimedMilestonePcts);
  const ticketCode = orderCode.trim().slice(-3) || 'KKK';
  const hasQr = qrGenerated && orderCode.trim().length > 0;

  const renderPassCard = (): React.ReactNode => (
    <div className="beauty-glow mb-5 overflow-hidden rounded-[1.8rem] border border-[#715318] bg-[linear-gradient(135deg,#241d12_0%,#251b15_56%,#311225_100%)] shadow-[0_16px_38px_rgba(0,0,0,0.24)]">
      <div className="relative px-4 pb-4 pt-5">
        <div className="pointer-events-none absolute right-7 top-4 h-20 w-20 rounded-full bg-[#ff3bb1]/14 blur-[42px]" />
        <div className="grid grid-cols-[minmax(0,1fr)_104px] items-start gap-3 sm:grid-cols-[minmax(0,1fr)_118px]">
          <div className="min-w-0 pt-1">
            <div className="mb-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f4c50a] px-3.5 py-2 text-[9px] font-black text-white">
              <StarIcon size={15} color="#ffffff" />
              <span className='text-[12px]'>{tier.name} Pass</span>
            </div>
            <div className="text-[19px] font-black leading-[0.95] text-white sm:text-[23px]">
              {userName}
            </div>
            <div className="mt-1.5 truncate text-[11px] font-medium leading-none text-[#8a8a92] sm:text-[13px]">
              {userPhone} · {ticketCode}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-[0.9rem] bg-[#3a2b10] px-3.5 py-2.5 text-[#ffd23f]">
              <StarIcon size={14} color="#ffd23f" />
              <span className="text-[14px] font-black leading-none">{availablePoints}</span>
              <span className="text-[11px] font-medium text-[#9d937b]">BP</span>
            </div>
          </div>

          <button type="button" onClick={onOpenQr} className="shrink-0 text-center">
            <div className="relative rounded-[1.45rem] border-[3px] border-[#d4be83] bg-white p-2.5 shadow-[0_0_0_3px_rgba(255,255,255,0.05),0_14px_28px_rgba(211,80,168,0.16)]">
              {hasQr ? (
                <div
                  className="h-[82px] w-[82px] overflow-hidden rounded-[0.8rem] sm:h-[92px] sm:w-[92px] [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qrMarkup }}
                />
              ) : (
                <div className="flex flex-col h-[82px] w-[82px] items-center justify-center rounded-[0.8rem] bg-white sm:h-[92px] sm:w-[92px]">
                  <QrIcon size={36} color="#1c1530" />
                  <p className='text-[#000]'>
                    Tạo mã QR
                  </p>
                </div>
              )}
              {hasQr ? ( <div className="absolute bottom-[-10px] px-2 left-4.5 rounded-full bg-gradient-to-br from-[#b8860b] to-[#ffd700] text-[9px] font-black text-white">
                CHECK-IN
              </div> ) : null}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgressCard = (): React.ReactNode => {
    const trackItems = [
      { pct: 0, label: '0%', unlocked: completedIds.length > 0, milestone: null as Milestone | null },
      ...MILESTONES.map((milestone) => ({
        pct: milestone.pct,
        label: `${milestone.pct}%`,
        unlocked: progress >= milestone.pct,
        milestone,
      })),
    ];

    return (
      <div className="mb-4 rounded-[1.55rem] border border-white/8 bg-[#161720] px-4 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.15)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-[14px] font-semibold text-[#9ba1b2]">Tiến độ nhiệm vụ</div>
          <div className="text-[15px] font-black text-[#ff58ba]">
            {completedIds.length}/{allMissionCount}
          </div>
        </div>

        <div className="flex items-start">
          {trackItems.map((item, index) => {
            const isFinal = item.pct === 100;
            const iconColor = item.unlocked || isFinal ? '#c89d10' : '#5b5c67';
            const node = (
              <div className={`flex w-[36px] flex-col items-center`}>
                {item.milestone ? (
                  <button
                    type="button"
                    onClick={() => onOpenMilestone(item.milestone)}
                    className={`flex items-center justify-center transition h-[32px] w-[32px] rounded-[0.4rem] border-2 ${
                      isFinal
                        ? 'border-dashed' : ''
                    }`}
                    style={{
                      borderColor: item.unlocked ? '#a88312' : isFinal ? 'rgba(168,131,18,0.7)' : '#3a3b44',
                      background: item.unlocked
                        ? 'rgba(168,131,18,0.14)'
                        : isFinal
                          ? 'rgba(168,131,18,0.06)'
                          : 'rgba(32,33,41,0.9)',
                    }}
                  >
                    <GiftIcon size={20} color={iconColor} />
                  </button>
                ) : (
                  <div
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-[1rem]"
                    style={{
                      background: item.unlocked ? 'linear-gradient(135deg, #b88908, #e5b61a)' : 'rgba(32,33,41,0.9)',
                    }}
                  >
                    <span className={`text-[18px] leading-none ${item.unlocked ? 'text-white' : 'text-[#646572]'}`}>
                      ✓
                    </span>
                  </div>
                )}
                <div
                  className="ms-1 mt-1 text-[12px] font-black"
                  style={{ color: item.unlocked || isFinal ? '#c89d10' : '#5b5c67' }}
                >
                  {item.label}
                </div>
              </div>
            );

            if (index === trackItems.length - 1) {
              return <div key={item.pct}>{node}</div>;
            }

            return (
              <React.Fragment key={item.pct}>
                {node}
                <div className="mt-[12px] h-[5px] flex-1 rounded-full bg-[#2a2b33]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: item.unlocked ? '100%' : '0%',
                      background: 'linear-gradient(90deg, #b88908, #d6ad1b)',
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMissionsTab = (): React.ReactNode => {
    return (
      <>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {phaseItems.map((item) => {
            const active = item.key === activePhase;
            const percent = phaseProgressMap[item.key];

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPhaseChange(item.key)}
                className={`rounded-[1.2rem] border px-2 py-3 text-center transition ${
                  active ? 'text-white' : 'border-white/8 bg-[#10111a] text-zinc-500'
                }`}
                style={
                  active
                    ? {
                        borderColor: '#7d5e19',
                        background: 'linear-gradient(180deg, rgba(39,30,18,0.96), rgba(28,23,15,0.96))',
                      }
                    : undefined
                }
              >
                <div className="flex items-center justify-center gap-1">
                  <span className='h-[19px]'>{item.renderIcon(active)}</span>
                  <div
                    className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-black ${
                      active ? 'bg-[#3d2f14] text-[#e7b317]' : 'bg-[#191923] text-[#767680]'
                    }`}
                  >
                    {percent}%
                  </div>
                </div>
                <div className={`text-[11px] font-semibold leading-4 ${active ? 'text-white' : 'text-[#73737c]'}`}>
                  {item.label}
                </div>
                {item.sub ? <div className="mt-1 text-[11px] text-[#73737c]">{item.sub}</div> : null}
              </button>
            );
          })}
        </div>
        <div className="space-y-2.5">
          {currentPhaseMissions.map((mission, index) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              completed={completedSet.has(mission.id)}
              accentColor={tier.color}
              delay={index * 60}
              onOpen={onOpenMission}
            />
          ))}
        </div>
      </>
    );
  };

  const renderVoucherTab = (): React.ReactNode => (
    <div className="space-y-4">
      <div className="rounded-[1.2rem] border border-amber-300/18 bg-[linear-gradient(145deg,rgba(245,158,11,0.15),rgba(245,158,11,0.04))] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">BPoint khả dụng</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-black text-amber-200">{availablePoints}</span>
              <span className="pb-1 text-xs text-zinc-500">/ {totalPoints} tổng</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500">Đã dùng</div>
            <div className="mt-1 text-xl font-black text-pink-300">{spentPoints}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-[1rem] border border-white/6 bg-white/[0.03] p-1">
        {(
          [
            { key: 'bpoint', label: `Đổi BPoint (${BPOINT_VOUCHERS.length})` },
            { key: 'free', label: `Miễn phí (${FREE_VOUCHERS.length})` },
          ] as const
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onVoucherTabChange(item.key)}
            className={`rounded-[0.85rem] px-3 py-3 text-sm font-semibold transition ${
              voucherTab === item.key ? 'text-white' : 'text-zinc-500'
            }`}
            style={voucherTab === item.key ? { background: 'linear-gradient(135deg, #ec4899, #f59e0b)' } : undefined}
          >
            {item.label}
          </button>
        ))}
      </div>

      {voucherTab === 'bpoint' ? (
        <div className="space-y-3">
          {BPOINT_VOUCHERS.map((voucher) => {
            const redeemed = redeemedSet.has(voucher.id);
            const canAfford = availablePoints >= (voucher.cost ?? 0);

            return (
              <div
                key={voucher.id}
                className="rounded-[1.1rem] border p-4"
                style={{
                  borderColor: redeemed
                    ? 'rgba(74,222,128,0.2)'
                    : voucher.isGrand
                      ? 'rgba(255,215,0,0.2)'
                      : 'rgba(255,255,255,0.06)',
                  background: redeemed
                    ? 'rgba(74,222,128,0.08)'
                    : voucher.isGrand
                      ? 'rgba(236,72,153,0.08)'
                      : 'rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${voucher.color}, ${voucher.color}bb)` }}
                  >
                    {voucher.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold" style={{ color: voucher.color }}>
                      {voucher.brand}
                    </div>
                    <div className="text-sm font-bold text-white">{voucher.discount}</div>
                    <div className="mt-1 truncate text-xs text-zinc-400">{voucher.desc}</div>
                  </div>
                  {redeemed ? (
                    <button
                      type="button"
                      onClick={() => onOpenVoucher(voucher)}
                      className="rounded-full bg-emerald-400/12 px-3 py-2 text-xs font-semibold text-emerald-300"
                    >
                      Xem mã
                    </button>
                  ) : voucher.isGrand ? (
                    <div className="rounded-full bg-amber-300/12 px-3 py-2 text-xs font-bold text-amber-200">
                      MAX
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRedeemVoucher(voucher)}
                      disabled={!canAfford}
                      className="rounded-full px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-zinc-500"
                      style={
                        canAfford
                          ? { background: `linear-gradient(135deg, ${voucher.color}, ${voucher.color}bb)`, color: '#fff' }
                          : undefined
                      }
                    >
                      {voucher.cost} BP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {FREE_VOUCHERS.map((voucher) => {
            const claimed = claimedFreeSet.has(voucher.id);

            return (
              <button
                key={voucher.id}
                type="button"
                onClick={() => (claimed ? onOpenVoucher(voucher) : onClaimVoucher(voucher))}
                className="flex w-full items-center gap-3 rounded-[1.1rem] border border-white/6 bg-white/[0.03] p-4 text-left"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${voucher.color}, ${voucher.color}bb)` }}
                >
                  {voucher.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold" style={{ color: voucher.color }}>
                    {voucher.brand}
                  </div>
                  <div className="text-sm font-bold text-white">{voucher.discount}</div>
                  <div className="mt-1 truncate text-xs text-zinc-400">{voucher.desc}</div>
                </div>
                <div
                  className={`rounded-full px-3 py-2 text-xs font-semibold ${
                    claimed ? 'bg-emerald-400/12 text-emerald-300' : 'text-white'
                  }`}
                  style={claimed ? undefined : { background: `linear-gradient(135deg, ${voucher.color}, ${voucher.color}bb)` }}
                >
                  {claimed ? 'Đã nhận' : 'Nhận'}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderVoteTab = (): React.ReactNode => {
    const query = normalizeQuery(voteQuery);

    return (
      <div className="space-y-4">
        <div className="rounded-[1.2rem] border border-violet-300/18 bg-[linear-gradient(145deg,rgba(167,139,250,0.16),rgba(167,139,250,0.04))] p-4">
          <div className="mb-2 flex items-center gap-2">
            <VoteIcon color="#d8b4fe" size={20} />
            <div className="text-base font-bold text-white">Bình chọn nhãn hàng</div>
          </div>
          <div className="text-sm leading-6 text-zinc-300">
            Chọn thương hiệu hoặc sản phẩm yêu thích trong từng hạng mục. Hoàn thành ít nhất 2 hạng mục để mở khóa nhiệm vụ vote.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {VOTE_CATEGORIES.map((category) => {
              const voted = Boolean(votes[category.id]);
              return (
                <div
                  key={category.id}
                  className="rounded-full border px-3 py-1 text-[11px] font-semibold"
                  style={{
                    borderColor: voted ? `${category.color}33` : 'rgba(255,255,255,0.08)',
                    background: voted ? `${category.color}18` : 'rgba(255,255,255,0.04)',
                    color: voted ? category.color : '#71717a',
                  }}
                >
                  {voted ? '✓ ' : ''}
                  {category.title.split(' ')[0]}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <input
            value={voteQuery}
            onChange={(event) => onVoteQueryChange(event.target.value)}
            placeholder="Tìm nhãn hàng..."
            className="w-full rounded-[1rem] border border-white/8 bg-white/[0.03] px-10 py-3 text-sm text-white placeholder:text-zinc-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
          {voteQuery ? (
            <button
              type="button"
              onClick={() => onVoteQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/8 px-2 py-1 text-xs text-zinc-400"
            >
              x
            </button>
          ) : null}
        </div>

        <div className="space-y-3">
          {VOTE_CATEGORIES.map((category) => {
            const filteredBrands = query
              ? category.brands.filter((brand) => normalizeQuery(brand.name).includes(query))
              : category.brands;

            if (filteredBrands.length === 0) {
              return null;
            }

            const selectedId = votes[category.id];
            const selectedBrandName = category.brands.find((brand) => brand.id === selectedId)?.name;

            return (
              <div key={category.id} className="rounded-[1.1rem] border border-white/6 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                      <span className="text-sm font-bold text-white">{category.title}</span>
                    </div>
                    <div className="text-xs leading-5 text-zinc-400">
                      {selectedBrandName ? `Đã chọn: ${selectedBrandName}` : category.desc}
                    </div>
                  </div>
                  <div className="rounded-full bg-white/6 px-2 py-1 text-[10px] font-semibold text-zinc-500">
                    {category.brands.length} ứng viên
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredBrands.map((brand) => {
                    const selected = selectedId === brand.id;

                    return (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => onOpenBrand(category, brand)}
                        className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                          selected ? 'text-white' : 'text-zinc-300'
                        }`}
                        style={{
                          borderColor: selected ? category.color : 'rgba(255,255,255,0.08)',
                          background: selected ? `linear-gradient(135deg, ${category.color}30, ${category.color}14)` : 'rgba(255,255,255,0.03)',
                        }}
                      >
                        {selected ? '✓ ' : ''}
                        {brand.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPolicyTab = (): React.ReactNode => (
    <div className="space-y-3">
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
          <div key={section.id} className="overflow-hidden rounded-[1.1rem] border border-white/6 bg-white/[0.03]">
            <div className={`flex items-center gap-2 border-b border-white/6 px-4 py-3 text-sm font-bold ${tone}`}>
              <PolicyIcon color="currentColor" />
              {section.title}
            </div>
            <div className="space-y-3 px-4 py-4">
              {section.items.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full" style={{ background: bulletColor }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative h-full">
      <div className="beauty-scroll h-full overflow-y-auto px-4 pb-40 pt-5">
        {renderPassCard()}
        {renderProgressCard()}

        {activeTab === 'missions'
          ? renderMissionsTab()
          : activeTab === 'vouchers'
            ? renderVoucherTab()
            : activeTab === 'vote'
              ? renderVoteTab()
              : renderPolicyTab()}
      </div>

      <MissionDrawer
        mission={expandedMission}
        accentColor={tier.color}
        value={proofValue}
        onChange={onProofValueChange}
        onClose={onCloseMission}
        onSubmit={onSubmitMission}
        onGoVote={() => {
          onCloseMission();
          onTabChange('vote');
        }}
      />

      <VoucherCodeModal voucher={selectedVoucher} onClose={onCloseVoucher} />

      <BrandDetailDrawer
        brand={selectedBrand}
        category={selectedCategory}
        voted={Boolean(selectedCategory && selectedBrand && votes[selectedCategory.id] === selectedBrand.id)}
        onClose={onCloseBrand}
        onVote={() => {
          if (selectedCategory && selectedBrand) {
            onToggleVote(selectedCategory, selectedBrand);
          }
        }}
      />

      <MilestoneModal
        milestone={selectedMilestone}
        progress={progress}
        claimed={Boolean(selectedMilestone && milestoneSet.has(selectedMilestone.pct))}
        onClose={onCloseMilestone}
        onClaim={onClaimMilestone}
      />

      <InternalTabBar
        activeTab={activeTab}
        completedCount={completedIds.length}
        totalCount={allMissionCount}
        onChange={onTabChange}
        hidden={Boolean(expandedMission || selectedVoucher || selectedBrand || selectedMilestone)}
      />
    </div>
  );
};

export default DashboardScreen;
