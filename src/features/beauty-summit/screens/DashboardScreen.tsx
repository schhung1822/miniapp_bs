import React from 'react';

import goldTicketBadge from '@/assets/gold.svg';
import logoOnboarding from '@/assets/logo-onboarding.png';
import bpointStarBadge from '@/assets/star.svg';
import vipTicketBadge from '@/assets/vip.svg';

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
} from '@/features/beauty-summit/icons';
import BrandDetailDrawer from '@/features/beauty-summit/components/BrandDetailDrawer';
import BeautyQrCode from '@/features/beauty-summit/components/BeautyQrCode';
import DeveloperInfoDrawer from '@/features/beauty-summit/components/DeveloperInfoDrawer';
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
  developerInfoOpen: boolean;
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
  onOpenDeveloperInfo: () => void;
  onLogout: () => void;
  onClosePolicy: () => void;
  onCloseDeveloperInfo: () => void;
  onOpenScanner: () => void;
  onCloseScanner: () => void;
  onRunScanner: () => void;
}

const HOME_PHASE_ACTIVE_ICON = '#fff3ff';
const HOME_PHASE_INACTIVE_ICON = '#d8b4fe';
const HOME_MISSION_ACCENT = '#f4b2ff';

const HoangTuWordmark: React.FC = () => (
  <div className="text-center">
    <div className="text-[10px] font-medium uppercase leading-none tracking-[0.05em] text-[#ffffff]">HOANG TU</div>
    <div className="mt-[1px] text-[6px] font-medium leading-none tracking-[0.24em] text-[#f4dfff]">HOLDINGS</div>
  </div>
);

const phaseItems: Array<{
  key: MissionPhase;
  label: string;
  sub?: string;
  renderIcon: (active: boolean) => React.ReactNode;
}> = [
  {
    key: 'before',
    label: 'NHIỆM VỤ\nTRƯỚC SỰ KIỆN',
    renderIcon: (active) => (
      <ClockIcon size={18} color={active ? HOME_PHASE_ACTIVE_ICON : HOME_PHASE_INACTIVE_ICON} />
    ),
  },
  {
    key: 'day1',
    label: 'NHIỆM VỤ NGÀY 1',
    sub: '19.06.2026',
    renderIcon: (active) => (
      <CalendarIcon size={18} color={active ? HOME_PHASE_ACTIVE_ICON : HOME_PHASE_INACTIVE_ICON} />
    ),
  },
  {
    key: 'day2',
    label: 'NHIỆM VỤ NGÀY 2',
    sub: '20.06.2026',
    renderIcon: (active) => (
      <CalendarIcon size={18} color={active ? HOME_PHASE_ACTIVE_ICON : HOME_PHASE_INACTIVE_ICON} />
    ),
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
    developerInfoOpen,
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
    onOpenDeveloperInfo,
    onLogout,
    onClosePolicy,
    onCloseDeveloperInfo,
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
  const normalizedTicketLabel = ticketLabel.trim().toUpperCase();
  const displayTicketLabel = normalizedTicketLabel.startsWith('VÉ ')
    ? normalizedTicketLabel
    : `VÉ ${normalizedTicketLabel}`;
  const passHolderName = userName.trim().length > 0 ? userName.trim().toUpperCase() : userName;
  const showVipTicketImage = normalizedTicketLabel.includes('VIP');

  const phaseMissionsPending = React.useMemo(
    () => currentPhaseMissions.filter((mission) => !completedSet.has(mission.id)),
    [completedSet, currentPhaseMissions]
  );
  const phaseMissionsDone = React.useMemo(
    () => currentPhaseMissions.filter((mission) => completedSet.has(mission.id)),
    [completedSet, currentPhaseMissions]
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
    <div className="
      beauty-glow beauty-crisp-edge mb-4 overflow-hidden 
      rounded-[1rem] 
      border-[2px] border-[#f24ab2] 
      bg-[linear-gradient(135deg,rgba(149,25,171,0.94)_0%,rgba(141,22,162,0.96)_52%,rgba(111,14,153,0.96)_100%)] 
      
    ">  
      <div className="relative p-3">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(255,173,232,0.22)_0%,rgba(255,173,232,0)_72%)]" />
        <div className="pointer-events-none absolute right-4 top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(129,92,255,0.2)_0%,rgba(129,92,255,0)_72%)]" />
        <div className="grid grid-cols-[minmax(0,1fr)_110px] items-start gap-3 sm:grid-cols-[minmax(0,1fr)_126px] sm:gap-4">
          <div className="min-w-0">
            <div className="flex flex-col sm:min-h-[186px]">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={logoOnboarding}
                    alt="Beauty Summit"
                    className="h-[22px] w-auto max-w-[92px] object-contain sm:h-[26px]"
                  />
                  <HoangTuWordmark />
                </div>
                <div className="mt-2 text-[1rem] truncate font-black uppercase leading-[0.95] tracking-[-0.03em] text-[#ffffff] sm:text-[2.05rem]">
                  {passHolderName}
                </div>
                <div className="mt-0.5">
                  {showVipTicketImage ? (
                    <img
                      src={vipTicketBadge}
                      alt={displayTicketLabel}
                      className="h-[2.1rem] w-auto max-w-[7.2rem] object-contain drop-shadow-[0_10px_20px_rgba(95,28,144,0.28)]"
                    />
                  ) : (
                    <div className="relative inline-flex h-[2.1rem] min-w-[6.95rem] items-center justify-center px-4">
                      <img
                        src={goldTicketBadge}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-fill"
                      />
                      <span className="relative text-[0.65rem] font-black uppercase leading-none tracking-[-0.02em] text-[#fff4db]">
                        {displayTicketLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-1.5 inline-flex w-fit items-center  rounded-[0.5rem] border border-[#7f1d88] bg-[rgba(88,10,106,0.84)] text-[#ffffff] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <img
                  src={bpointStarBadge}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 object-contain"
                />
                <div className="flex items-end gap-1">
                  <span className="ms-1 text-[1.3rem] font-black leading-[1.1] tracking-[-0.1em] text-[#ffffff]">
                    {availablePoints}
                  </span>
                  <span className="pb-1 text-[1rem] text-[#f1d4ff]">BP</span>
                </div>
              </div>
            </div>
          </div>

          <button type="button" onClick={onOpenQr} className="shrink-0 text-center">
            <div className="flex relative justify-center items-center bg-[rgba(39,7,74,0.96)] beauty-crisp-edge rounded-[1.45rem] border border-[#7f49ff] p-2.5 shadow-[0_12px_24px_rgba(43,2,72,0.34)]">
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
                <div className="flex h-[82px] w-[82px] flex-col items-center justify-center rounded-[0.8rem] sm:h-[92px] sm:w-[92px]">
                  <QrIcon size={36} color="#ffffff" />
                  <p className="text-[#ffffff]">Tạo mã QR</p>
                </div>
              )}
              {hasQr ? (
                <div className="absolute bottom-[-10px] left-5.5 rounded-full border border-white/24 bg-[linear-gradient(90deg,#ff5fb8_0%,#ff8a63_100%)] px-2 text-[9px] font-black text-[#ffffff]">
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
      <div className="mb-4 rounded-[1.55rem] border border-white/50 bg-[linear-gradient(180deg,rgba(119,17,161,0.94)_0%,rgba(102,11,148,0.96)_100%)] px-4 py-4 shadow-[0_18px_34px_rgba(68,5,108,0.24)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-[14px] font-semibold text-[#ffffff]">Tiến độ nhiệm vụ</div>
          <div className="text-[15px] font-black text-[#ff69c9]">
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
                ? '#fff4ff'
                : '#d7b7ef';
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
                        ? '#ff8bd7'
                        : item.unlocked
                          ? 'rgba(255,255,255,0.78)'
                          : isFinal
                            ? 'rgba(255,255,255,0.55)'
                            : 'rgba(255,255,255,0.18)',
                      background: claimed
                        ? 'linear-gradient(135deg, #ff62c4, #8d65ff)'
                        : item.unlocked
                          ? 'rgba(255,255,255,0.16)'
                          : isFinal
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(56,7,92,0.9)',
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
                        ? 'linear-gradient(135deg, #ff62c4, #8d65ff)'
                        : 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <span
                      className={`text-[18px] leading-none ${item.unlocked ? 'text-[#ffffff]' : 'text-[#d7b7ef]'}`}
                    >
                      ✓
                    </span>
                  </div>
                )}
                  <div
                    className="ms-1 mt-1 text-[12px] font-black"
                    style={{
                      color: claimed
                        ? '#ffe5fa'
                        : item.unlocked || isFinal
                          ? '#ffffff'
                          : '#d7b7ef',
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
                <div className="mt-[15px] h-[5px] flex-1 rounded-full bg-[rgba(255,255,255,0.18)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: item.unlocked ? '100%' : '0%',
                      background: 'linear-gradient(90deg, #8c73ff, #ff6fc9)',
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
      <div className="mb-4">
        <div className="mb-2 px-1 text-[12px] font-semibold text-[#f3cfff]">Giai đoạn nhiệm vụ</div>
        <div className="grid grid-cols-3 gap-2.5">
          {phaseItems.map((item) => {
            const active = item.key === activePhase;
            const percent = phaseProgressMap[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPhaseChange(item.key)}
                className={`relative flex flex-col items-center overflow-hidden rounded-[1rem] border px-2 pb-2 pt-1.5 text-center transition ${
                  active
                    ? 'border-[#ff85d5] bg-[linear-gradient(180deg,rgba(142,34,185,0.94)_0%,rgba(118,24,169,0.97)_100%)] shadow-[0_14px_28px_rgba(96,10,141,0.24)]'
                    : 'border-[#ff91d6] bg-[linear-gradient(180deg,rgba(228,57,143,0.14)_0%,rgba(223,39,87,0.1)_100%)] shadow-[0_10px_20px_rgba(88,8,104,0.12)]'
                }`}
              >
                <span
                  className={`rounded-[0.42rem] mt-2 px-2 py-0.5 text-[10px] font-black leading-none ${
                    active
                      ? 'bg-[rgba(114,12,125,0.86)] text-[#ffffff]'
                      : 'bg-[rgba(122,11,105,0.78)] text-[#ffffff]'
                  }`}
                >
                  {percent}%
                </span>
                <div
                  className={`mt-1 mb-1 flex justify-center text-center text-[0.7rem] font-black uppercase leading-[1.4] tracking-[-0.02em] ${
                    item.key === 'before' ? 'whitespace-pre-line' : 'whitespace-nowrap'
                  } ${
                    active ? 'text-[#ffffff]' : 'text-[#fff3fb]'
                  }`}
                >
                  {item.label}
                </div>
                <div
                  className={`mt-0.25 min-h-[0.72rem] text-[10px] leading-none ${
                    active ? 'text-[#ffe7f7]' : 'text-[#ffe7f4]'
                  }`}
                >
                  <span className={item.sub ? '' : 'opacity-0'}>{item.sub}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {phaseMissionsPending.length > 0 ? (
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] font-bold text-[#ffffff]">Cần làm ngay</div>
          <div className="rounded-full border border-white/14 bg-[rgba(182,21,127,0.88)] px-2.5 py-1 text-[10px] font-semibold text-[#ffffff]">
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
              accentColor={HOME_MISSION_ACCENT}
              delay={index * 60}
              onOpen={onOpenMission}
            />
          ))
        ) : (
          <div className="rounded-[1.15rem] border border-dashed border-white/24 bg-[rgba(72,10,108,0.52)] px-4 py-5 text-center">
            <div className="text-[13px] font-semibold text-[#ffffff]">
              Không còn nhiệm vụ đang mở
            </div>
            <div className="mt-1 text-[11px] text-[#f1d0ff]">
              Bạn đã hoàn thành hết nhiệm vụ trong giai đoạn này.
            </div>
          </div>
        )}
      </div>

      {phaseMissionsDone.length > 0 ? (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-bold text-[#ffffff]">Đã hoàn thành</div>
            <div className="rounded-full border border-white/14 bg-[rgba(98,18,141,0.88)] px-2.5 py-1 text-[10px] font-semibold text-[#ffe6ff]">
              {phaseMissionsDone.length} mục
            </div>
          </div>
          <div className="space-y-2.5">
            {phaseMissionsDone.map((mission, index) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                completed
                accentColor={HOME_MISSION_ACCENT}
                delay={index * 40}
                onOpen={onOpenMission}
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );

  const renderVoucherTab = (): React.ReactNode => {
    const voucherHelper =
      voucherTab === 'bpoint'
        ? 'Dùng BPoint tích được từ nhiệm vụ để đổi voucher'
        : 'Voucher miễn phí từ nhãn hàng — nhấn để nhận mã ngay';
    const actionBoxClass =
      'flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.5rem] border border-white/18 bg-[linear-gradient(180deg,rgba(168,36,199,0.3)_0%,rgba(113,15,145,0.9)_100%)] px-1.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]';

    return (
      <div className="space-y-4">
        <div className="rounded-[1.45rem] border border-[#f09de0] bg-[linear-gradient(135deg,rgba(121,22,167,0.96)_0%,rgba(122,21,171,0.96)_58%,rgba(103,14,155,0.98)_100%)] px-5 py-3 shadow-[0_18px_34px_rgba(77,4,108,0.22)]">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="text-[0.9rem] font-medium text-white/88">BPoint khả dụng</div>
              <div className="mt-2 flex items-end gap-1 text-white">
                <span className="text-[1.5rem] font-black text-white/90 leading-none">{availablePoints}</span>
                <span className="pb-0.5 text-[1.15rem] font-semibold leading-none text-white/70">
                  /{totalPoints}
                </span>
                <span className="pb-[0.22rem] text-[1rem] font-medium leading-none text-white/75">
                  tổng
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[0.95rem] font-medium text-white/88">Đã dùng</div>
              <div className="mt-2 text-[1.5rem] font-black leading-none text-white/70">{spentPoints}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { key: 'bpoint', label: 'Đổi BPoint' },
              { key: 'free', label: 'Miễn Phí' },
            ] as const
          ).map((item) => {
            const active = voucherTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onVoucherTabChange(item.key)}
                className={`rounded-[0.4rem] border px-3 py-1.5 text-sm font-bold transition ${
                  active ? 'text-[#8f1ab0]' : 'text-white/92'
                }`}
                style={{
                  borderColor: active ? 'rgba(255,255,255,0.95)' : 'rgba(255, 202, 242, 0.9)',
                  background: active
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,220,245,0.94))'
                    : 'rgba(255,255,255,0.03)',
                  boxShadow: active
                    ? '0 10px 22px rgba(110, 13, 116, 0.16), inset 0 1px 0 rgba(255,255,255,0.88)'
                    : 'none',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="px-2 text-center text-[0.8rem] leading-relaxed text-white/88">{voucherHelper}</div>

        {voucherTab === 'bpoint' ? (
          <div className="space-y-3">
            {bpointVouchers.map((voucher) => {
              const redeemed = redeemedSet.has(voucher.id);
              const grandPrize = voucher.isGrand;
              const canAfford = availablePoints >= (voucher.cost ?? 0);
              const canClaimGrandPrize = progress >= 100;

              return (
                <div
                  key={voucher.id}
                  className={`rounded-[1.25rem] border px-3.5 py-3 shadow-[0_16px_30px_rgba(68,6,109,0.22)] ${
                    grandPrize ? 'beauty-grand-prize-card beauty-crisp-edge' : ''
                  }`}
                  style={{
                    borderColor: grandPrize ? 'rgba(255,214,115,0.68)' : '#f09de0',
                    background: grandPrize
                      ? undefined
                      : 'linear-gradient(135deg, rgba(123,25,173,0.96) 0%, rgba(111,20,167,0.97) 58%, rgba(96,13,155,0.98) 100%)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <VoucherLogoBadge
                      logo={voucher.logo}
                      brand={voucher.brand}
                      color={voucher.color}
                      className="h-11 w-11 shrink-0 rounded-[0.95rem]"
                      grandPrize={grandPrize}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`min-w-0 truncate text-[0.98rem] font-black leading-tight ${grandPrize ? '' : 'text-white/90'}`}>
                          {voucher.discount}
                        </div>
                      </div>
                      <div className={`mt-1 truncate text-[0.84rem] leading-[1.25] ${grandPrize ? '' : 'text-white/70'}`}>
                        {voucher.desc}
                      </div>
                    </div>
                    <div className="">
                      {redeemed ? (
                        <button
                          type="button"
                          onClick={() => onOpenVoucher(voucher)}
                          className={`text-[0.56rem] font-bold uppercase leading-[1.05]`}
                        >
                          Đã nhận
                        </button>
                      ) : voucher.isGrand ? (
                        <button
                          type="button"
                          onClick={() => onRedeemVoucher(voucher)}
                          disabled={!canClaimGrandPrize}
                          className="beauty-grand-prize-button min-w-[4.9rem] rounded-full py-1.5 text-center text-[0.82rem] font-black uppercase leading-none disabled:cursor-not-allowed "
                        >
                          MAX
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRedeemVoucher(voucher)}
                          disabled={!canAfford}
                          className={`${actionBoxClass} text-[0.9rem] uppercase tracking-[-0.03em] text-white/90 disabled:cursor-not-allowed`}
                        >
                          {voucher.cost}BP
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
                  className="flex w-full items-center gap-3 rounded-[1.25rem] border border-[#f09de0] bg-[linear-gradient(135deg,rgba(123,25,173,0.96)_0%,rgba(111,20,167,0.97)_58%,rgba(96,13,155,0.98)_100%)] px-3.5 py-3 text-left shadow-[0_16px_30px_rgba(68,6,109,0.22)]"
                >
                  <VoucherLogoBadge
                    logo={voucher.logo}
                    brand={voucher.brand}
                    color={voucher.color}
                    className="h-11 w-11 shrink-0 rounded-[0.95rem]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.98rem] leading-tight text-white/90">
                      {voucher.discount}
                    </div>
                    <div className="mt-1 truncate text-[0.84rem] leading-[1.25] text-white/70">
                      {voucher.desc}
                    </div>
                  </div>
                  <div
                    className={`${actionBoxClass} text-[0.56rem] font-bold uppercase leading-[1.05] !text-white`}
                    style={
                      claimed
                        ? undefined
                        : {
                            background:
                              'linear-gradient(180deg, rgba(255,118,202,0.38) 0%, rgba(163,34,169,0.58) 100%)',
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
  };

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
      onOpenDeveloperInfo={onOpenDeveloperInfo}
      onLogout={onLogout}
    />
  );

  return (
    <div className="relative h-full">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#5816b7_0%,#8916b1_28%,#bf118f_62%,#dd0f76_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_74%)]" />
      <div className="pointer-events-none absolute left-[-5rem] top-[14rem] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(96,199,255,0.14)_0%,rgba(96,199,255,0)_72%)]" />
      <div className="pointer-events-none absolute bottom-[6rem] right-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,162,221,0.18)_0%,rgba(255,162,221,0)_72%)]" />
      <div
        ref={scrollContainerRef}
        className="beauty-scroll relative z-[1] h-full overflow-y-auto px-4 pb-40 pt-5"
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
      <DeveloperInfoDrawer open={developerInfoOpen} onClose={onCloseDeveloperInfo} />
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
          developerInfoOpen ||
          scannerOpen ||
          qrPreviewOpen
        )}
      />
    </div>
  );
};

export default DashboardScreen;
