import React from 'react';

import { MILESTONES } from '@/features/beauty-summit/data';
import type {
  BeautyTab,
  BeautyUserRole,
  Milestone,
  Mission,
  MissionPhase,
  TierMeta,
  Voucher,
  VoucherTab,
  VoteBrand,
  VoteCategory,
} from '@/features/beauty-summit/types';
import {
  CalendarIcon,
  ClockIcon,
  GiftIcon,
  QrIcon,
  StarIcon,
} from '@/features/beauty-summit/icons';
import BrandDetailDrawer from '@/features/beauty-summit/components/BrandDetailDrawer';
import BeautyQrCode from '@/features/beauty-summit/components/BeautyQrCode';
import FooterNav from '@/features/beauty-summit/components/FooterNav';
import MilestoneModal from '@/features/beauty-summit/components/MilestoneModal';
import MissionCard from '@/features/beauty-summit/components/MissionCard';
import MissionDrawer from '@/features/beauty-summit/components/MissionDrawer';
import PolicyDrawer from '@/features/beauty-summit/components/PolicyDrawer';
import ProfilePanel from '@/features/beauty-summit/components/ProfilePanel';
import QrPreviewModal from '@/features/beauty-summit/components/QrPreviewModal';
import ScanDrawer from '@/features/beauty-summit/components/ScanDrawer';
import VoucherCodeModal from '@/features/beauty-summit/components/VoucherCodeModal';
import VoucherLogoBadge from '@/features/beauty-summit/components/VoucherLogoBadge';
import VoteSection from '@/features/beauty-summit/components/VoteSection';

interface DashboardScreenProps {
  tier: TierMeta;
  ticketLabel: string;
  activeTab: BeautyTab;
  activePhase: MissionPhase;
  voucherTab: VoucherTab;
  bpointVouchers: Voucher[];
  freeVouchers: Voucher[];
  proofValue: string;
  progress: number;
  totalPoints: number;
  spentPoints: number;
  availablePoints: number;
  qrGenerated: boolean;
  voteCategories: VoteCategory[];
  userName: string;
  userAvatar: string;
  userPhone: string;
  userRole: BeautyUserRole;
  orderCode: string;
  qrValue: string;
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
  policyOpen: boolean;
  scannerOpen: boolean;
  scannerBusy: boolean;
  scannerResult: string | null;
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
  onChangeTicket: () => void;
  onOpenPolicy: () => void;
  onLogout: () => void;
  onClosePolicy: () => void;
  onOpenScanner: () => void;
  onCloseScanner: () => void;
  onRunScanner: () => void;
}

const phaseItems: Array<{
  key: MissionPhase;
  label: string;
  sub?: string;
  renderIcon: (active: boolean) => React.ReactNode;
}> = [
  {
    key: 'before',
    label: 'Trước sự kiện',
    sub: '.',
    renderIcon: (active) => <ClockIcon size={18} color={active ? '#b8860b' : '#9a8f9d'} />,
  },
  {
    key: 'day1',
    label: 'Ngày 1',
    sub: '19/06/2026',
    renderIcon: (active) => <CalendarIcon size={18} color={active ? '#b8860b' : '#9a8f9d'} />,
  },
  {
    key: 'day2',
    label: 'Ngày 2',
    sub: '20/06/2026',
    renderIcon: (active) => <CalendarIcon size={18} color={active ? '#b8860b' : '#9a8f9d'} />,
  },
];

const DashboardScreen: React.FC<DashboardScreenProps> = (props) => {
  const {
    tier,
    ticketLabel,
    activeTab,
    activePhase,
    voucherTab,
    bpointVouchers,
    freeVouchers,
    proofValue,
    progress,
    totalPoints,
    spentPoints,
    availablePoints,
    qrGenerated,
    voteCategories,
    userName,
    userAvatar,
    userPhone,
    userRole,
    orderCode,
    qrValue,
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
    policyOpen,
    scannerOpen,
    scannerBusy,
    scannerResult,
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
    onChangeTicket,
    onOpenPolicy,
    onLogout,
    onClosePolicy,
    onCloseScanner,
    onRunScanner,
  } = props;

  const completedSet = React.useMemo(() => new Set(completedIds), [completedIds]);
  const claimedFreeSet = React.useMemo(
    () => new Set(claimedFreeVoucherIds),
    [claimedFreeVoucherIds]
  );
  const redeemedSet = React.useMemo(() => new Set(redeemedVoucherIds), [redeemedVoucherIds]);
  const milestoneSet = React.useMemo(() => new Set(claimedMilestonePcts), [claimedMilestonePcts]);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const previousTabRef = React.useRef<BeautyTab>(activeTab);
  const [qrPreviewOpen, setQrPreviewOpen] = React.useState(false);
  const hasQr = qrGenerated && orderCode.trim().length > 0;

  const maskedPhone = React.useMemo(() => {
    const digits = userPhone.replace(/\D/g, '');
    const localDigits =
      digits.length === 11 && digits.startsWith('84') ? `0${digits.slice(2)}` : digits;
    if (localDigits.length !== 10) return userPhone;
    return `${localDigits.slice(0, 4)} *** ${localDigits.slice(7)}`;
  }, [userPhone]);

  const phaseMissionsPending = React.useMemo(
    () => currentPhaseMissions.filter((mission) => !completedSet.has(mission.id)),
    [completedSet, currentPhaseMissions]
  );
  const phaseMissionsDone = React.useMemo(
    () => currentPhaseMissions.filter((mission) => completedSet.has(mission.id)),
    [completedSet, currentPhaseMissions]
  );
  const redeemableVoucherCount = React.useMemo(
    () =>
      bpointVouchers.filter(
        (voucher) =>
          !voucher.isGrand &&
          !redeemedSet.has(voucher.id) &&
          availablePoints >= (voucher.cost ?? Number.POSITIVE_INFINITY)
      ).length,
    [availablePoints, bpointVouchers, redeemedSet]
  );
  const freeVoucherClaimedCount = React.useMemo(
    () => freeVouchers.filter((voucher) => claimedFreeSet.has(voucher.id)).length,
    [claimedFreeSet, freeVouchers]
  );
  const overallVoteCount = React.useMemo(
    () => voteCategories.reduce((sum, category) => sum + (category.totalVotes ?? 0), 0),
    [voteCategories]
  );
  React.useEffect(() => {
    if (previousTabRef.current !== activeTab) {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      previousTabRef.current = activeTab;
    }
  }, [activeTab]);

  const renderPassCard = (): React.ReactNode => (
    <div className="beauty-glow beauty-crisp-edge mb-5 overflow-hidden rounded-[1.8rem] border border-[#715318] bg-[linear-gradient(135deg,#241d12_0%,#251b15_56%,#311225_100%)] shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
      <div className="relative px-4 pb-4 pt-5">
        <div className="pointer-events-none absolute right-8 top-5 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(255,59,177,0.14)_0%,rgba(255,59,177,0)_72%)]" />
        <div className="grid grid-cols-[minmax(0,1fr)_104px] items-start gap-3 sm:grid-cols-[minmax(0,1fr)_118px]">
          <div className="min-w-0 pt-1">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4c50a] px-3.5 py-2 text-[12px] font-black !text-white">
                <StarIcon size={15} color="#ffffff" />
                <span>{ticketLabel}</span>
              </div>
              <img
                src={userAvatar}
                alt={userName}
                className="h-10 w-10 shrink-0 rounded-full border border-white/18 object-cover shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
              />
            </div>
            <div className="text-[19px] font-black leading-[0.95] text-white sm:text-[23px]">
              {userName}
            </div>
            <div className="mt-1.5 truncate text-[11px] font-medium leading-none text-[#8a8a92] sm:text-[13px]">
              {maskedPhone}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-[0.9rem] bg-[#3a2b10] px-3.5 py-2.5 text-[#ffd23f]">
              <StarIcon size={14} color="#ffd23f" />
              <span className="text-[14px] font-black leading-none">{availablePoints}</span>
              <span className="text-[11px] font-medium text-[#9d937b]">BP</span>
            </div>
          </div>

          <button type="button" onClick={onOpenQr} className="shrink-0 text-center">
            <div className="beauty-crisp-edge relative rounded-[1.45rem] border-[3px] border-[#d4be83] bg-white p-2.5 shadow-[0_10px_20px_rgba(211,80,168,0.14)]">
              {hasQr ? (
                <BeautyQrCode
                  value={qrValue}
                  size={92}
                  wrapperClassName="h-[82px] w-[82px] overflow-hidden rounded-[0.8rem] sm:h-[92px] sm:w-[92px]"
                  canvasClassName="h-full w-full rounded-[0.8rem]"
                  logoSize={12}
                  logoRingClassName="border-[4px] shadow-[0_4px_12px_rgba(178,71,125,0.12)]"
                />
              ) : (
                <div className="flex h-[82px] w-[82px] flex-col items-center justify-center rounded-[0.8rem] bg-white sm:h-[92px] sm:w-[92px]">
                  <QrIcon size={36} color="#1c1530" />
                  <p className="text-[#000]">Tạo mã QR</p>
                </div>
              )}
              {hasQr ? (
                <div className="absolute bottom-[-10px] left-4.5 rounded-full bg-gradient-to-br from-[#b8860b] to-[#ffd700] px-2 text-[9px] font-black !text-white">
                  CHECK-IN
                </div>
              ) : null}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgressCard = (): React.ReactNode => {
    const trackItems = [
      {
        pct: 0,
        label: '0%',
        unlocked: completedIds.length > 0,
        milestone: null as Milestone | null,
      },
    ].concat(
      MILESTONES.map((milestone) => ({
        pct: milestone.pct,
        label: `${milestone.pct}%`,
        unlocked: progress >= milestone.pct,
        milestone,
      }))
    );

    return (
      <div className="mb-4 rounded-[1.55rem] border border-[#eadfd2] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(184,134,11,0.08)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-[14px] font-semibold text-[#9ba1b2]">Tiến độ nhiệm vụ</div>
          <div className="text-[15px] font-black text-[#ff58ba]">
            {completedIds.length}/{allMissionCount}
          </div>
        </div>

        <div className="flex items-start">
          {trackItems.map((item, index) => {
            const isFinal = item.pct === 100;
            const claimed = Boolean(item.milestone && milestoneSet.has(item.milestone.pct));
            const ready = Boolean(item.milestone && item.unlocked && !claimed);
            const iconColor = claimed
              ? '#ffffff'
              : item.unlocked || isFinal
                ? '#c89d10'
                : '#5b5c67';
            const node = (
              <div className="flex w-[36px] flex-col items-center">
                {item.milestone ? (
                  <button
                    type="button"
                    onClick={() => onOpenMilestone(item.milestone)}
                    className={`beauty-milestone-node flex h-[33px] w-[33px] items-center justify-center rounded-[0.4rem] border-2 transition ${
                      claimed
                        ? 'beauty-milestone-node--claimed'
                        : ready
                          ? 'beauty-milestone-node--ready'
                          : ''
                    } ${isFinal ? 'border-dashed' : ''}`}
                    style={{
                      borderColor: claimed
                        ? '#22c55e'
                        : item.unlocked
                          ? '#c99b17'
                          : isFinal
                            ? 'rgba(201,155,23,0.55)'
                            : '#d7ced9',
                      background: claimed
                        ? 'linear-gradient(135deg, #34d399, #16a34a)'
                        : item.unlocked
                          ? 'rgba(255,214,102,0.24)'
                          : isFinal
                            ? 'rgba(255,214,102,0.12)'
                            : '#f4f1f5',
                    }}
                  >
                    {claimed ? (
                      <span className="text-[18px] leading-none !text-white">{'\u2713'}</span>
                    ) : (
                      <GiftIcon size={20} color={iconColor} />
                    )}
                  </button>
                ) : (
                  <div
                    className="flex h-[33px] w-[33px] items-center justify-center rounded-[1rem]"
                    style={{
                      background: item.unlocked
                        ? 'linear-gradient(135deg, #b88908, #e5b61a)'
                        : '#f4f1f5',
                    }}
                  >
                    <span
                      className={`text-[18px] leading-none ${item.unlocked ? '!text-white' : 'text-[#9a8f9d]'}`}
                    >
                      ✓
                    </span>
                  </div>
                )}
                  <div
                    className="ms-1 mt-1 text-[12px] font-black"
                    style={{
                      color: claimed ? '#16a34a' : item.unlocked || isFinal ? '#c89d10' : '#5b5c67',
                    }}
                  >
                    {item.label}
                  </div>
                </div>
            );

            if (index === trackItems.length - 1) return <div key={item.pct}>{node}</div>;
            return (
              <React.Fragment key={item.pct}>
                {node}
                <div className="mt-[15px] h-[5px] flex-1 rounded-full bg-[#e8e1ea]">
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
  const renderMissionsTab = (): React.ReactNode => (
    <>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Đã xong', value: completedIds.length, tone: 'bg-[#fef3c7] text-[#9a6700]' },
          {
            label: 'Đang mở',
            value: phaseMissionsPending.length,
            tone: 'bg-[#fce7f3] text-[#b83280]',
          },
          { label: 'BPoint', value: availablePoints, tone: 'bg-[#ecfdf3] text-[#15803d]' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[1rem] border border-[#eadfd2] bg-white px-3 py-3 text-center"
          >
            <div
              className={`mx-auto mb-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.tone}`}
            >
              {item.label}
            </div>
            <div className="text-lg font-black text-[#241629]">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-[1.2rem] border border-[#eadfd2] bg-white p-3.5 shadow-[0_10px_24px_rgba(184,134,11,0.06)]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold text-[#8a7e8b]">Giai đoạn nhiệm vụ</div>
            <div className="mt-1 text-[14px] font-bold text-[#241629]">
              {phaseItems.find((item) => item.key === activePhase)?.label}
            </div>
          </div>
          <div className="rounded-full bg-[#fff2cc] px-3 py-1.5 text-[12px] font-black text-[#b8860b]">
            {phaseProgressMap[activePhase]}%
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {phaseItems.map((item) => {
            const active = item.key === activePhase;
            const percent = phaseProgressMap[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPhaseChange(item.key)}
                className={`rounded-[1rem] border px-2 py-3 text-center transition ${active ? 'border-[#d8b45b] bg-[#fff8df]' : 'border-[#eadfd2] bg-[#fffdf9]'}`}
              >
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  <span className="flex h-5 items-center">{item.renderIcon(active)}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${active ? 'bg-[#f2c94c] !text-white' : 'bg-[#f4edf2] text-[#8b8790]'}`}
                  >
                    {percent}%
                  </span>
                </div>
                <div
                  className={`text-[11px] font-semibold leading-4 ${active ? 'text-[#7a5200]' : 'text-[#73737c]'}`}
                >
                  {item.label}
                </div>
                {item.sub ? (
                  <div className="mt-1 text-[10px] text-[#8a7e8b]">{item.sub}</div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {phaseMissionsPending.length > 0 ? (
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] font-bold text-[#241629]">Cần làm ngay</div>
          <div className="rounded-full bg-[#fff5d6] px-2.5 py-1 text-[10px] font-semibold text-[#9a6700]">
            {phaseMissionsPending.length} nhiệm vụ
          </div>
        </div>
      ) : null}
      <div className="space-y-2.5">
        {phaseMissionsPending.length > 0 ? (
          phaseMissionsPending.map((mission, index) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              completed={false}
              accentColor={tier.color}
              delay={index * 60}
              onOpen={onOpenMission}
            />
          ))
        ) : (
          <div className="rounded-[1.15rem] border border-dashed border-[#e8d9c0] bg-[#fffdf9] px-4 py-5 text-center">
            <div className="text-[13px] font-semibold text-[#241629]">
              Không còn nhiệm vụ đang mở
            </div>
            <div className="mt-1 text-[11px] text-[#8a7e8b]">
              Bạn đã hoàn thành hết nhiệm vụ trong giai đoạn này.
            </div>
          </div>
        )}
      </div>

      {phaseMissionsDone.length > 0 ? (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-bold text-[#241629]">Đã hoàn thành</div>
            <div className="rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[10px] font-semibold text-[#15803d]">
              {phaseMissionsDone.length} mục
            </div>
          </div>
          <div className="space-y-2.5">
            {phaseMissionsDone.map((mission, index) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                completed
                accentColor={tier.color}
                delay={index * 40}
                onOpen={onOpenMission}
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );

  const renderVoucherTab = (): React.ReactNode => (
    <div className="space-y-4">
      <div className="rounded-[1.2rem] border border-[#eadfd2] bg-[linear-gradient(145deg,#fffdf8,#fff6ea)] p-4 shadow-[0_10px_24px_rgba(184,134,11,0.06)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[12px] font-semibold text-[#8a7e8b]">Ví voucher</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-[1.75rem] font-black text-[#241629]">{availablePoints}</span>
              <span className="pb-1 text-[12px] font-semibold text-[#b8860b]">BP khả dụng</span>
            </div>
          </div>
          <div className="rounded-full bg-[#fff2cc] px-3 py-1.5 text-[11px] text-[#9a6700]">
            {redeemableVoucherCount} có thể đổi
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-[0.95rem] bg-white px-3 py-3 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7e8b]">
              Tổng
            </div>
            <div className="mt-1 text-[15px] font-black text-[#241629]">{totalPoints}</div>
          </div>
          <div className="rounded-[0.95rem] bg-white px-3 py-3 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7e8b]">
                Đã dùng
            </div>
            <div className="mt-1 text-[15px] font-black text-[#db2777]">{spentPoints}</div>
          </div>
          <div className="rounded-[0.95rem] bg-white px-3 py-3 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7e8b]">
              Đã nhận
            </div>
            <div className="mt-1 text-[15px] font-black text-[#15803d]">
              {voucherTab === 'bpoint' ? redeemedVoucherIds.length : freeVoucherClaimedCount}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-[1rem] border border-[#eadfd2] bg-[#fffaf2] p-1">
        {(
          [
            { key: 'bpoint', label: `Đổi BPoint (${bpointVouchers.length})` },
            { key: 'free', label: `Miễn phí (${freeVouchers.length})` },
          ] as const
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onVoucherTabChange(item.key)}
            className={`rounded-[0.85rem] px-3 py-2.5 text-sm font-semibold transition ${voucherTab === item.key ? '!text-white' : 'text-[#7a7280]'}`}
            style={
              voucherTab === item.key
                ? { background: 'linear-gradient(135deg, #ec4899, #f59e0b)' }
                : undefined
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {voucherTab === 'bpoint' ? (
        <div className="space-y-3">
          {bpointVouchers.map((voucher) => {
            const redeemed = redeemedSet.has(voucher.id);
            const canAfford = availablePoints >= (voucher.cost ?? 0);
            const grandPrize = voucher.isGrand;
            const canClaimGrandPrize = progress >= 100;
            return (
              <div
                key={voucher.id}
                className={`rounded-[1.25rem] border bg-white p-3.5 shadow-[0_10px_22px_rgba(184,134,11,0.05)] ${grandPrize ? 'beauty-grand-prize-card beauty-crisp-edge' : ''}`}
                style={{
                  borderColor: redeemed
                    ? 'rgba(74,222,128,0.24)'
                    : grandPrize
                      ? 'rgba(246,194,52,0.42)'
                      : 'rgba(184,134,11,0.14)',
                }}
              >
                <div className="flex items-center gap-3">
                  <VoucherLogoBadge
                    logo={voucher.logo}
                    brand={voucher.brand}
                    color={voucher.color}
                    className="h-12 w-12 shrink-0"
                    grandPrize={grandPrize}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="truncate text-[13px] font-semibold"
                        style={{ color: voucher.color }}
                      >
                        {voucher.brand}
                      </span>
                      {voucher.isGrand ? (
                        <span className="beauty-grand-prize-badge truncate rounded-full px-2 py-0.5 text-[10px] font-semibold">
                          Giải đặc biệt
                        </span>
                      ) : null}
                    </div>
                    <div className="truncate text-[17px] font-black leading-tight text-[#241629]">
                      {voucher.discount}
                    </div>
                    <div className="mt-1 truncate text-[12px] text-[#7a7280]">{voucher.desc}</div>
                  </div>
                  <div className="shrink-0">
                    {redeemed ? (
                      <button
                        type="button"
                        onClick={() => onOpenVoucher(voucher)}
                        className="min-w-[82px] rounded-[0.95rem] bg-[#ecfdf3] px-3.5 py-1 text-center text-[13px] font-bold text-[#15803d]"
                      >
                        Đã nhận
                      </button>
                    ) : voucher.isGrand ? (
                      <button
                        type="button"
                        onClick={() => onRedeemVoucher(voucher)}
                        disabled={!canClaimGrandPrize}
                        className="beauty-grand-prize-button min-w-[82px] rounded-[0.95rem] px-3.5 py-1 text-center text-[13px] font-bold !text-white disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Nhận
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRedeemVoucher(voucher)}
                        disabled={!canAfford}
                        className="min-w-[82px] rounded-[0.95rem] px-3.5 py-1 text-center text-[13px] font-bold disabled:cursor-not-allowed disabled:bg-[#f1edf2] disabled:text-[#a69ba8]"
                        style={
                          canAfford
                            ? {
                                background: `linear-gradient(135deg, ${voucher.color}, ${voucher.color}bb)`,
                                color: '#fff',
                              }
                            : undefined
                        }
                      >
                        {voucher.cost} BP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {freeVouchers.map((voucher) => {
            const claimed = claimedFreeSet.has(voucher.id);
            return (
              <button
                key={voucher.id}
                type="button"
                onClick={() => (claimed ? onOpenVoucher(voucher) : onClaimVoucher(voucher))}
                className="flex w-full items-center gap-3 rounded-[1.25rem] border border-[#eadfd2] bg-white p-3.5 text-left shadow-[0_10px_22px_rgba(184,134,11,0.05)]"
              >
                <VoucherLogoBadge
                  logo={voucher.logo}
                  brand={voucher.brand}
                  color={voucher.color}
                  className="h-12 w-12 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold" style={{ color: voucher.color }}>
                    {voucher.brand}
                  </div>
                  <div className="truncate text-[17px] font-black leading-tight text-[#241629]">
                    {voucher.discount}
                  </div>
                  <div className="mt-1 truncate text-[12px] text-[#7a7280]">{voucher.desc}</div>
                </div>
                <div
                  className={`shrink-0 rounded-[0.95rem] px-3.5 py-1 text-center text-[13px] font-bold ${claimed ? 'bg-[#ecfdf3] text-[#15803d]' : '!text-white'}`}
                  style={
                    claimed
                      ? undefined
                      : {
                          background: `linear-gradient(135deg, ${voucher.color}, ${voucher.color}bb)`,
                        }
                  }
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

  const renderProfileTab = (): React.ReactNode => (
    <ProfilePanel
      userName={userName}
      userAvatar={userAvatar}
      userPhone={userPhone}
      ticketLabel={ticketLabel}
      availablePoints={availablePoints}
      completedCount={completedIds.length}
      totalMissionCount={allMissionCount}
      userRole={userRole}
      onOpenPolicy={onOpenPolicy}
      onLogout={onLogout}
    />
  );

  return (
    <div className="relative h-full">
      <div
        ref={scrollContainerRef}
        className="beauty-scroll h-full overflow-y-auto px-4 pb-40 pt-5"
      >
        {activeTab !== 'profile' ? (
          <>
            {renderPassCard()}
            {renderProgressCard()}
          </>
        ) : null}

        {activeTab === 'missions'
          ? renderMissionsTab()
          : activeTab === 'vouchers'
            ? renderVoucherTab()
            : activeTab === 'vote'
              ? (
                <VoteSection
                  voteCategories={voteCategories}
                  votes={votes}
                  voteQuery={voteQuery}
                  onVoteQueryChange={onVoteQueryChange}
                  onToggleVote={onToggleVote}
                  onOpenBrand={onOpenBrand}
                />
              )
              : renderProfileTab()}
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
        overallVoteCount={overallVoteCount}
        voted={Boolean(
          selectedCategory && selectedBrand && votes[selectedCategory.id] === selectedBrand.id
        )}
        onClose={onCloseBrand}
        onVote={() => {
          if (selectedCategory && selectedBrand) onToggleVote(selectedCategory, selectedBrand);
        }}
      />

      <MilestoneModal
        milestone={selectedMilestone}
        progress={progress}
        claimed={Boolean(selectedMilestone && milestoneSet.has(selectedMilestone.pct))}
        onClose={onCloseMilestone}
        onClaim={onClaimMilestone}
      />
      <PolicyDrawer open={policyOpen} onClose={onClosePolicy} />
      <ScanDrawer
        open={scannerOpen}
        userRole={userRole}
        isLoading={scannerBusy}
        result={scannerResult}
        onClose={onCloseScanner}
        onScan={onRunScanner}
      />

      <QrPreviewModal
        open={qrPreviewOpen}
        userName={userName}
        orderCode={orderCode}
        qrValue={qrValue}
        onClose={() => setQrPreviewOpen(false)}
        onChangeTicket={() => {
          setQrPreviewOpen(false);
          onChangeTicket();
        }}
      />

      <FooterNav
        activeTab={activeTab}
        onChange={onTabChange}
        onQrClick={() => {
          if (hasQr) {
            setQrPreviewOpen(true);
            return;
          }
          onOpenQr();
        }}
        hidden={Boolean(
          expandedMission ||
          selectedVoucher ||
          selectedBrand ||
          selectedMilestone ||
          policyOpen ||
          scannerOpen ||
          qrPreviewOpen
        )}
      />
    </div>
  );
};

export default DashboardScreen;
