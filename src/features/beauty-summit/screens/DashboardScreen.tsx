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
  PolicyIcon,
  SearchIcon,
  TrophyIcon,
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
    renderIcon: (active) => <ClockIcon color={active ? '#fff' : '#71717a'} />,
  },
  {
    key: 'day1',
    label: 'Ngày 1',
    sub: '19/06',
    renderIcon: (active) => <CalendarIcon color={active ? '#fff' : '#71717a'} />,
  },
  {
    key: 'day2',
    label: 'Ngày 2',
    sub: '20/06',
    renderIcon: (active) => <CalendarIcon color={active ? '#fff' : '#71717a'} />,
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
}) => {
  const completedSet = new Set(completedIds);
  const claimedFreeSet = new Set(claimedFreeVoucherIds);
  const redeemedSet = new Set(redeemedVoucherIds);
  const milestoneSet = new Set(claimedMilestonePcts);

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
                className={`rounded-[1rem] border px-2 py-3 text-center transition ${
                  active ? 'text-white' : 'border-white/6 bg-white/[0.03] text-zinc-500'
                }`}
                style={
                  active
                    ? {
                        borderColor: `${tier.color}55`,
                        background: `linear-gradient(145deg, ${tier.color}24, rgba(255,255,255,0.05))`,
                      }
                    : undefined
                }
              >
                <div
                  className={`mx-auto mb-2 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                    percent === 100 ? 'bg-emerald-400/12 text-emerald-300' : ''
                  }`}
                  style={
                    percent === 100
                      ? undefined
                      : active
                        ? { background: `${tier.color}22`, color: tier.color }
                        : { background: 'rgba(255,255,255,0.04)', color: '#71717a' }
                  }
                >
                  {percent}%
                </div>
                <div className="mb-1 flex justify-center">{item.renderIcon(active)}</div>
                <div className="text-[11px] font-semibold">{item.label}</div>
                {item.sub ? <div className="mt-1 text-[10px] text-zinc-500">{item.sub}</div> : null}
              </button>
            );
          })}
        </div>
        <div className="space-y-3">
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
      <div className="h-full overflow-y-auto px-4 pb-28 pt-5">
        <div
          className="beauty-glow mb-4 overflow-hidden rounded-[1.5rem] border"
          style={{
            borderColor: `${tier.color}33`,
            background: `linear-gradient(145deg, ${tier.color}16, rgba(255,255,255,0.05))`,
          }}
        >
          <div className="px-5 pb-5 pt-4">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div
                  className="mb-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-[#170d1d]"
                  style={{ background: tier.gradient }}
                >
                  {tier.icon} {tier.name} Pass
                </div>
                <div className="text-2xl font-black text-white">Beauty Summit Dashboard</div>
                <div className="mt-2 max-w-[17rem] text-sm leading-6 text-zinc-300">
                  Theo dõi tiến độ nhiệm vụ, đổi voucher và bình chọn nhãn hàng yêu thích trong cùng một nơi.
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Tiến độ</div>
                <div className="mt-1 text-3xl font-black text-white">{progress}%</div>
              </div>
            </div>

            <div className="mb-3 h-2 rounded-full bg-white/8">
              <div
                className="h-2 rounded-full"
                style={{ width: `${progress}%`, background: tier.gradient }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-[1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
                <div className="text-lg font-black text-amber-200">{availablePoints}</div>
                <div className="mt-1 text-[11px] text-zinc-400">BPoint</div>
              </div>
              <div className="rounded-[1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
                <div className="text-lg font-black text-pink-300">{completedIds.length}</div>
                <div className="mt-1 text-[11px] text-zinc-400">nhiệm vụ xong</div>
              </div>
              <div className="rounded-[1rem] border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
                <div className="text-lg font-black text-sky-300">{Object.keys(votes).length}</div>
                <div className="mt-1 text-[11px] text-zinc-400">hạng mục vote</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {MILESTONES.map((milestone) => {
            const unlocked = progress >= milestone.pct;
            const claimed = milestoneSet.has(milestone.pct);

            return (
              <button
                key={milestone.pct}
                type="button"
                onClick={() => onOpenMilestone(milestone)}
                className={`rounded-[1rem] border px-3 py-4 text-center transition ${
                  claimed ? 'border-emerald-400/25 bg-emerald-400/8' : 'border-white/6 bg-white/[0.03]'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <TrophyIcon size={20} color={claimed ? '#4ade80' : milestone.color} />
                </div>
                <div className="text-[11px] font-semibold text-white">{milestone.pct}%</div>
                <div className="mt-1 text-[10px] text-zinc-500">
                  {claimed ? 'Đã nhận' : unlocked ? 'Mở khóa' : 'Đang khóa'}
                </div>
              </button>
            );
          })}
        </div>

        {activeTab === 'missions' ? null : (
          <div className="mb-5 rounded-[1rem] border border-white/6 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              {activeTab === 'vouchers' ? <VoucherIcon /> : activeTab === 'vote' ? <VoteIcon /> : <PolicyIcon />}
              {activeTab === 'vouchers'
                ? 'Voucher & quà tặng'
                : activeTab === 'vote'
                  ? 'Bình chọn nhãn hàng'
                  : 'Chính sách chương trình'}
            </div>
          </div>
        )}

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
