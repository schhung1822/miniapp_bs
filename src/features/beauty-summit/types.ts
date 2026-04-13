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
  logo?: string;
  voteCount?: number;
  rank?: number;
  progressPct?: number;
}

export interface VoteCategory {
  id: string;
  title: string;
  desc: string;
  color: string;
  totalVotes?: number;
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
  actionUrl?: string;
  actionLabel?: string;
  autoCompleteOnAction?: boolean;
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
  disabled?: boolean;
  transferLocked?: boolean;
  canOpen?: boolean;
  checkinTime: string | null;
  createdAt: string | null;
  buyerName?: string;
  buyerPhone?: string;
  holderName?: string;
  holderPhone?: string;
}

export type MiniAppTicketLockReason = 'checked-in' | 'transferred';

type MiniAppTicketAvailability = Pick<
  MiniAppTicketOrder,
  | 'checkedIn'
  | 'disabled'
  | 'transferLocked'
  | 'canOpen'
  | 'phone'
  | 'buyerPhone'
  | 'holderPhone'
  | 'status'
  | 'statusLabel'
>;

const normalizeMiniAppPhone = (value: string | null | undefined): string => {
  const digits = String(value ?? '').replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('84')) {
    return digits;
  }

  if (digits.startsWith('0')) {
    return `84${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    return `84${digits}`;
  }

  return digits;
};

const normalizeMiniAppStatus = (value: string | null | undefined): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const getMiniAppTicketLockReason = (
  ticket: MiniAppTicketAvailability | null | undefined,
  viewerPhone?: string | null,
): MiniAppTicketLockReason | null => {
  if (!ticket) {
    return null;
  }

  const viewerDigits = normalizeMiniAppPhone(viewerPhone);
  const holderDigits = normalizeMiniAppPhone(ticket.holderPhone || ticket.phone);
  const buyerDigits = normalizeMiniAppPhone(ticket.buyerPhone);
  const normalizedStatus = normalizeMiniAppStatus(ticket.status);
  const normalizedStatusLabel = normalizeMiniAppStatus(ticket.statusLabel);
  const markedTransferred =
    ticket.transferLocked ||
    ticket.disabled ||
    ticket.canOpen === false ||
    normalizedStatus.includes('transfer') ||
    normalizedStatus.includes('chuyen') ||
    normalizedStatusLabel.includes('transfer') ||
    normalizedStatusLabel.includes('chuyen');
  const inferredTransferred =
    Boolean(viewerDigits && holderDigits && viewerDigits !== holderDigits && (!buyerDigits || buyerDigits === viewerDigits)) ||
    Boolean(!viewerDigits && buyerDigits && holderDigits && buyerDigits !== holderDigits && markedTransferred);

  if (markedTransferred || inferredTransferred) {
    return 'transferred';
  }

  if (ticket.checkedIn) {
    return 'checked-in';
  }

  return null;
};

export const isMiniAppTicketDisabled = (
  ticket: MiniAppTicketAvailability | null | undefined,
  viewerPhone?: string | null,
): boolean => getMiniAppTicketLockReason(ticket, viewerPhone) !== null;

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
