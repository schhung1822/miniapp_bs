export type ExperienceScreen = 'onboarding' | 'terms' | 'qr' | 'main' | 'reward';

export type TierKey = 'STANDARD' | 'PREMIUM' | 'VIP';

export type BeautyTab = 'missions' | 'vouchers' | 'vote' | 'profile';

export type BeautyUserRole = 'guest' | 'receptionist';

export type MissionPhase = 'before' | 'day1' | 'day2';

export type VoucherTab = 'bpoint' | 'free';

export type ProofType =
  | 'link'
  | 'image'
  | 'scan'
  | 'vote'
  | 'survey'
  | 'referral'
  | 'code'
  | 'quiz'
  | null;

export interface TierMeta {
  key: TierKey;
  name: string;
  color: string;
  gradient: string;
  icon: string;
}

export interface Voucher {
  id: string;
  kind?: VoucherTab;
  brand: string;
  logo: string;
  discount: string;
  desc: string;
  code: string | null;
  color: string;
  cost?: number;
  isGrand?: boolean;
  isActive?: boolean;
}

export interface VoteBrand {
  id: string;
  name: string;
  product?: string;
  summary?: string;
  link?: string;
}

export interface VoteCategory {
  id: string;
  title: string;
  desc: string;
  color: string;
  brands: VoteBrand[];
}

export interface Mission {
  id: string;
  title: string;
  desc: string;
  points: number;
  phase: MissionPhase;
  steps: string[];
  proofType: ProofType;
  proofLabel?: string;
  proofPlaceholder?: string;
  auto?: boolean;
  checkin?: boolean;
}

export interface MissionSet {
  before: Mission[];
  day1: Mission[];
  day2: Mission[];
}

export interface CheckinZone {
  id: string;
  name: string;
  location: string;
  color: string;
  tiers: TierKey[];
  desc: string;
}

export interface CheckinLog {
  id: string;
  zoneId: string;
  zoneName: string;
  color: string;
  time: string;
  day: string;
}

export interface MiniAppTicketOrder {
  code: string;
  name: string;
  phone: string;
  ticketClass: string;
  status: string;
  statusLabel: string;
  checkedIn: boolean;
  checkinTime: string | null;
  createdAt: string | null;
}

export interface MiniAppRewardState {
  completedIds: string[];
  claimedFreeVoucherIds: string[];
  redeemedVoucherIds: string[];
  claimedMilestonePcts: number[];
  votes: Record<string, string>;
  spentPoints: number;
  totalPoints: number;
  availablePoints: number;
}

export interface PolicySection {
  id: string;
  title: string;
  items: string[];
  tone: 'pink' | 'gold' | 'green' | 'blue' | 'red';
}

export interface Milestone {
  pct: number;
  title: string;
  brand: string;
  desc: string;
  color: string;
}

export interface OnboardingSlide {
  id: string;
  badge: string;
  title: string;
  desc: string;
  accent: string;
}
