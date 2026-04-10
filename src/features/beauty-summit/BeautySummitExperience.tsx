import React from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  configAppView,
  getAccessToken,
  getPhoneNumber,
  getUserID,
  getUserInfo,
  scanQRCode,
} from 'zmp-sdk';
import { getSystemInfo, nativeStorage, openChat, showOAWidget } from 'zmp-sdk/apis';

import {
  CHECKIN_ZONES,
  MILESTONES,
  ONBOARDING_SLIDES,
  TIERS,
  buildMissions,
} from '@/features/beauty-summit/data';
import type { HeaderProps } from '@/components/Header';
import BeautyShell from '@/features/beauty-summit/components/BeautyShell';
import OaWidgetModal from '@/features/beauty-summit/components/OaWidgetModal';
import PermissionNoticeModal from '@/features/beauty-summit/components/PermissionNoticeModal';
import RewardCompletionScreen from '@/features/beauty-summit/components/RewardCompletionScreen';
import TicketHelpModal from '@/features/beauty-summit/components/TicketHelpModal';
import DashboardScreen from '@/features/beauty-summit/screens/DashboardScreen';
import OnboardingScreen from '@/features/beauty-summit/screens/OnboardingScreen';
import QrScreen from '@/features/beauty-summit/screens/QrScreen';
import TermsScreen from '@/features/beauty-summit/screens/TermsScreen';
import type {
  BeautyTab,
  BeautyUserRole,
  CheckinLog,
  ExperienceScreen,
  Milestone,
  MiniAppRewardState,
  MiniAppTicketOrder,
  Mission,
  MissionPhase,
  TierKey,
  Voucher,
  VoteBrand,
  VoteCategory,
} from '@/features/beauty-summit/types';
import apiClient from '@/lib/api-client';

interface BeautySummitExperienceProps {
  onHeaderChange: (config: HeaderProps) => void;
}

const DEFAULT_ZALO_PROFILE = {
  name: 'User Name',
  avatar: 'https://h5.zdn.vn/static/images/avatar.png',
} as const;

const DEFAULT_PHONE_DISPLAY = import.meta.env.VITE_DEFAULT_PHONE_DISPLAY?.trim() || '0912 345 678';
const FALLBACK_ZALO_PHONE = import.meta.env.VITE_FALLBACK_ZALO_PHONE?.trim() || '84123456789';
const ZALO_QR_STORAGE_KEY =
  import.meta.env.VITE_ZALO_QR_STORAGE_KEY?.trim() || 'beauty-summit.qr-checkin';
const OA_WIDGET_ID = 'beautySummitOaWidget';
const BEAUTY_TABS: readonly BeautyTab[] = ['missions', 'vouchers', 'vote', 'profile'];

const isBeautyTab = (value: string | null): value is BeautyTab =>
  Boolean(value && BEAUTY_TABS.includes(value as BeautyTab));

const isZaloRuntime = (): boolean => {
  const { platform } = getSystemInfo();
  return platform === "android";
};

interface CachedZaloUser {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

interface CachedQrTicket {
  userId: string;
  phone: string;
  ticketCode: string;
  qrValue: string;
}

interface ZaloPhoneResponse {
  data?: {
    number?: string;
  };
  error?: number;
  message?: string;
}

interface MiniAppTicketsResponse {
  data?: MiniAppTicketOrder[];
  message?: string;
}

interface ClaimMiniAppTicketResponse {
  data?: MiniAppTicketOrder;
  message?: string;
}

interface MiniAppRewardsResponse {
  data?: {
    state?: MiniAppRewardState;
    vouchers?: {
      bpoint?: Voucher[];
      free?: Voucher[];
    };
    voteCategories?: VoteCategory[];
  };
  message?: string;
}

interface MiniAppRewardActionResponse {
  data?: {
    state?: MiniAppRewardState;
  };
  message?: string;
}

const normalizePhoneValue = (value: string): string => {
  const digits = value.replace(/\D/g, '');

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

const formatPhoneDisplay = (value: string): string => {
  const normalizedValue = normalizePhoneValue(value);
  const localPhone = normalizedValue.startsWith('84') ? `0${normalizedValue.slice(2)}` : normalizedValue;
  const digits = localPhone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return localPhone || value;
};
const normalizeTicketCode = (value: string): string => value.trim().toUpperCase();
const buildCheckinQrValue = (phone: string, ticketCode: string): string =>
  `${normalizePhoneValue(phone)}|${normalizeTicketCode(ticketCode)}`;

const isMeaningfulZaloName = (value: string | null | undefined): boolean => {
  const normalizedValue = String(value ?? '').trim();
  return Boolean(normalizedValue && normalizedValue !== DEFAULT_ZALO_PROFILE.name);
};
const normalizeZaloName = (value: string | null | undefined, fallback?: string): string => {
  const normalizedValue = String(value ?? '').trim();
  const fallbackValue = String(fallback ?? '').trim();

  if (isMeaningfulZaloName(normalizedValue)) {
    return normalizedValue;
  }

  if (isMeaningfulZaloName(fallbackValue)) {
    return fallbackValue;
  }

  return fallbackValue || DEFAULT_ZALO_PROFILE.name;
};
const normalizeZaloAvatar = (value: string | null | undefined, fallback?: string): string => {
  const normalizedValue = String(value ?? '').trim();
  if (normalizedValue) {
    return normalizedValue;
  }

  const fallbackValue = String(fallback ?? '').trim();
  return fallbackValue || DEFAULT_ZALO_PROFILE.avatar;
};
const getNativeStorageItem = (key: string): string | null => {
  try {
    if (isZaloRuntime()) {
      const value = nativeStorage.getItem(key);
      return typeof value === 'string' ? value : null;
    }
  } catch {
    return null;
  }

  return null;
};
const setNativeStorageItem = (key: string, value: string): void => {
  try {
    if (isZaloRuntime()) {
      nativeStorage.setItem(key, value);
      console.log('[BeautySummit] QR cache saved:', value);
    }
  } catch {
    // Ignore storage write errors outside the Zalo runtime.
  }
};
const removeNativeStorageItem = (key: string): void => {
  try {
    if (isZaloRuntime()) {
      nativeStorage.removeItem(key);
    }
  } catch {
    // Ignore storage remove errors outside the Zalo runtime.
  }
};

const isCompleteCachedQrTicket = (
  value: Partial<CachedQrTicket> | null | undefined,
): value is CachedQrTicket =>
  Boolean(value?.userId?.trim() && value?.phone?.trim() && value?.ticketCode?.trim() && value?.qrValue?.trim());

const readCachedQrTicket = (expectedUserId?: string | null, expectedPhone?: string | null): CachedQrTicket | null => {
  try {
    const rawValue = getNativeStorageItem(ZALO_QR_STORAGE_KEY);
    console.log('[BeautySummit] nativeStorage raw qr:', rawValue);

    if (!rawValue) {
      console.log('[BeautySummit] QR cache miss');
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<CachedQrTicket>;
    if (!isCompleteCachedQrTicket(parsedValue)) {
      console.log('[BeautySummit] QR cache incomplete:', parsedValue);
      removeNativeStorageItem(ZALO_QR_STORAGE_KEY);
      return null;
    }

    const cachedQr = {
      userId: parsedValue.userId.trim(),
      phone: normalizePhoneValue(parsedValue.phone),
      ticketCode: normalizeTicketCode(parsedValue.ticketCode),
      qrValue: parsedValue.qrValue.trim(),
    };

    if (expectedUserId?.trim() && cachedQr.userId !== expectedUserId.trim()) {
      console.log('[BeautySummit] QR cache user mismatch, clearing cache');
      removeNativeStorageItem(ZALO_QR_STORAGE_KEY);
      return null;
    }

    if (expectedPhone?.trim() && cachedQr.phone !== normalizePhoneValue(expectedPhone)) {
      const normalizedCachedQr = {
        ...cachedQr,
        phone: normalizePhoneValue(expectedPhone),
        qrValue: buildCheckinQrValue(expectedPhone, cachedQr.ticketCode),
      };
      writeCachedQrTicket(normalizedCachedQr);
      console.log('[BeautySummit] QR cache phone normalized:', normalizedCachedQr);
      return normalizedCachedQr;
    }

    const expectedQrValue = buildCheckinQrValue(cachedQr.phone, cachedQr.ticketCode);
    if (cachedQr.qrValue !== expectedQrValue) {
      const normalizedCachedQr = {
        ...cachedQr,
        qrValue: expectedQrValue,
      };
      writeCachedQrTicket(normalizedCachedQr);
      console.log('[BeautySummit] QR cache normalized:', normalizedCachedQr);
      return normalizedCachedQr;
    }

    console.log('[BeautySummit] QR cache hit:', cachedQr);
    return cachedQr;
  } catch {
    removeNativeStorageItem(ZALO_QR_STORAGE_KEY);
    console.log('[BeautySummit] QR cache parse failed, cache cleared');
    return null;
  };
};

const resolveZaloUserFromSdk = async (options?: {
  requestPermissions?: boolean;
}): Promise<CachedZaloUser> => {


  const { userInfo } = await getUserInfo({
    autoRequestPermission: options?.requestPermissions !== false,
  });
  console.log('[BeautySummit] Zalo userInfo:', userInfo);

  const userID = await getUserID({}).catch(() => '');
  const resolvedId = String(userID || userInfo.id || '').trim();
  const phoneNumber = await resolveZaloPhoneNumber();

  if (!resolvedId) {
    throw new Error('Unable to resolve Zalo user id');
  }

  const resolvedUser = {
    id: resolvedId,
    name: normalizeZaloName(userInfo.name),
    avatar: normalizeZaloAvatar(userInfo.avatar),
    phone: normalizePhoneValue(phoneNumber || FALLBACK_ZALO_PHONE),
  };

  console.log('[BeautySummit] resolved user from SDK:', resolvedUser);
  return resolvedUser;
};

const writeCachedQrTicket = (value: CachedQrTicket): void => {
  setNativeStorageItem(
    ZALO_QR_STORAGE_KEY,
    JSON.stringify({
      userId: value.userId.trim(),
      phone: normalizePhoneValue(value.phone),
      ticketCode: normalizeTicketCode(value.ticketCode),
      qrValue: value.qrValue.trim(),
    }),
  );
  
};

const clearCachedQrTicket = (): void => {
  removeNativeStorageItem(ZALO_QR_STORAGE_KEY);
};

const resolveZaloPhoneNumber = async (): Promise<string> => {
  try {
    const phoneAuth = await getPhoneNumber({});
    const accessToken = await getAccessToken({});
    const phoneNumber = await fetchZaloPhoneNumber(accessToken, phoneAuth.token);

    return normalizePhoneValue(phoneNumber || FALLBACK_ZALO_PHONE);
  } catch (error) {
    console.warn('Falling back to demo phone number', error);
    return FALLBACK_ZALO_PHONE;
  }
};

const fetchZaloPhoneNumber = async (accessToken: string, code: string): Promise<string | null> => {
  const secretKey = import.meta.env.VITE_ZALO_SECRET_KEY?.trim();
  if (!secretKey) {
    return null;
  }

  const response = await fetch('https://graph.zalo.me/v2.0/me/info', {
    headers: {
      access_token: accessToken,
      code,
      secret_key: secretKey,
    },
  });

  const payload = (await response.json()) as ZaloPhoneResponse;
  if (!response.ok || payload.error !== 0) {
    throw new Error(payload.message || 'Failed to fetch phone number');
  }

  return payload.data?.number ?? null;
};

const syncMiniAppUser = async (user: CachedZaloUser): Promise<void> => {
  try {
    await apiClient.post('/api/auth/zalo-miniapp', {
      id: user.id,
      name: user.name,
      phone: normalizePhoneValue(user.phone),
      avatar: user.avatar,
    });
    return;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to sync mini app account';
    throw new Error(message);
  }
};

const formatTicketLabel = (value: string): string => value.trim().toUpperCase();

const fetchMiniAppTicketOrders = async (zid: string, phone: string): Promise<MiniAppTicketOrder[]> => {
  const response = await apiClient.post<MiniAppTicketsResponse>('/api/tickets', {
    action: 'list',
    id: zid.trim(),
    phone: normalizePhoneValue(phone),
  });

  return response.data.data ?? [];
};

const claimMiniAppTicketOrder = async (
  ticketCode: string,
  user: CachedZaloUser,
): Promise<MiniAppTicketOrder> => {
  const response = await apiClient.post<ClaimMiniAppTicketResponse>('/api/tickets', {
    action: 'claim',
    code: normalizeTicketCode(ticketCode),
    id: user.id,
    name: user.name,
    phone: normalizePhoneValue(user.phone),
    avatar: user.avatar,
  });

  if (!response.data.data) {
    throw new Error(response.data.message || 'Unable to claim ticket');
  }

  return response.data.data;
};

const loadMiniAppRewards = async (user: CachedZaloUser): Promise<{
  state: MiniAppRewardState;
  vouchers: {
    bpoint: Voucher[];
    free: Voucher[];
  };
  voteCategories: VoteCategory[];
}> => {
  const response = await apiClient.post<MiniAppRewardsResponse>('/api/rewards', {
    action: 'load',
    id: user.id,
    name: user.name,
    phone: normalizePhoneValue(user.phone),
    avatar: user.avatar,
  });

  const rewardsData = response.data.data;
  const state = rewardsData?.state;
  if (!state) {
    throw new Error(response.data.message || 'Unable to load reward state');
  }

  return {
    state,
    vouchers: {
      bpoint: rewardsData?.vouchers?.bpoint ?? [],
      free: rewardsData?.vouchers?.free ?? [],
    },
    voteCategories: rewardsData?.voteCategories ?? [],
  };
};

const updateMiniAppRewardState = async (
  user: CachedZaloUser,
  action: 'complete-mission' | 'claim-voucher' | 'redeem-voucher' | 'claim-milestone' | 'toggle-vote',
  payload: Record<string, unknown>,
): Promise<MiniAppRewardState> => {
  const response = await apiClient.post<MiniAppRewardActionResponse>('/api/rewards', {
    action,
    id: user.id,
    name: user.name,
    phone: normalizePhoneValue(user.phone),
    avatar: user.avatar,
    ...payload,
  });

  const state = response.data.data?.state;
  if (!state) {
    throw new Error(response.data.message || 'Unable to update reward state');
  }

  return state;
};

const readApiErrorMessage = (error: unknown, fallback: string): string => {
  const response = (error as { response?: { data?: { message?: string } } } | null)?.response;
  return response?.data?.message || (error instanceof Error ? error.message : fallback);
};
const shouldRetryTicketFetchAfterSync = (error: unknown): boolean => {
  const response = (error as { response?: { status?: number; data?: { message?: string } } } | null)?.response;
  const status = response?.status;
  const message = response?.data?.message || (error instanceof Error ? error.message : '');

  return status === 401 || status === 403 || /not authorized|unauthorized/i.test(message);
};

const BeautySummitExperience: React.FC<BeautySummitExperienceProps> = ({ onHeaderChange }) => {
  const [searchParams] = useSearchParams();
  const [screen, setScreen] = React.useState<ExperienceScreen>('onboarding');
  const [slideIndex, setSlideIndex] = React.useState<number>(0);
  const [tier, setTier] = React.useState<TierKey>('PREMIUM');
  const [agreed, setAgreed] = React.useState<boolean>(false);
  const [orderCode, setOrderCode] = React.useState<string>('');
  const [qrGenerated, setQrGenerated] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<BeautyTab>('missions');
  const [activePhase, setActivePhase] = React.useState<MissionPhase>('before');
  const [voucherTab, setVoucherTab] = React.useState<'bpoint' | 'free'>('bpoint');
  const [completedIds, setCompletedIds] = React.useState<string[]>([]);
  const [claimedFreeVoucherIds, setClaimedFreeVoucherIds] = React.useState<string[]>([]);
  const [redeemedVoucherIds, setRedeemedVoucherIds] = React.useState<string[]>([]);
  const [spentPoints, setSpentPoints] = React.useState<number>(0);
  const [bpointVouchers, setBpointVouchers] = React.useState<Voucher[]>([]);
  const [freeVouchers, setFreeVouchers] = React.useState<Voucher[]>([]);
  const [voteCategories, setVoteCategories] = React.useState<VoteCategory[]>([]);
  const [claimedMilestonePcts, setClaimedMilestonePcts] = React.useState<number[]>([]);
  const [votes, setVotes] = React.useState<Record<string, string>>({});
  const [voteQuery, setVoteQuery] = React.useState<string>('');
  const [proofInputs, setProofInputs] = React.useState<Record<string, string>>({});
  const [expandedMissionId, setExpandedMissionId] = React.useState<string | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = React.useState<string | null>(null);
  const [selectedMilestonePct, setSelectedMilestonePct] = React.useState<number | null>(null);
  const [rewardScreenSeen, setRewardScreenSeen] = React.useState<boolean>(false);
  const [selectedBrandKey, setSelectedBrandKey] = React.useState<{
    categoryId: string;
    brandId: string;
  } | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const [checkinLog, setCheckinLog] = React.useState<CheckinLog[]>([]);
  const [ticketHelpOpen, setTicketHelpOpen] = React.useState<boolean>(false);
  const [oaPromptOpen, setOaPromptOpen] = React.useState<boolean>(false);
  const [permissionStep, setPermissionStep] = React.useState<'profile' | null>(null);
  const [permissionIntent, setPermissionIntent] = React.useState<'activate' | 'generate-qr' | null>(
    null,
  );
  const [permissionsGranted, setPermissionsGranted] = React.useState<boolean>(false);
  const [policyOpen, setPolicyOpen] = React.useState<boolean>(false);
  const [scannerOpen, setScannerOpen] = React.useState<boolean>(false);
  const [scannerBusy, setScannerBusy] = React.useState<boolean>(false);
  const [scannerResult, setScannerResult] = React.useState<string | null>(null);
  const [zaloProfile, setZaloProfile] = React.useState(DEFAULT_ZALO_PROFILE);
  const [displayPhone, setDisplayPhone] = React.useState(DEFAULT_PHONE_DISPLAY);
  const [zaloPhone, setZaloPhone] = React.useState<string>('');
  const [zaloUserId, setZaloUserId] = React.useState<string>('');
  const [qrValue, setQrValue] = React.useState<string>('');
  const [ticketOrders, setTicketOrders] = React.useState<MiniAppTicketOrder[]>([]);
  const [ticketsLoading, setTicketsLoading] = React.useState<boolean>(false);
  const [ticketsError, setTicketsError] = React.useState<string | null>(null);
  const [miniAppLoading, setMiniAppLoading] = React.useState<boolean>(false);
  const [appBootstrapping, setAppBootstrapping] = React.useState<boolean>(true);

  const toastTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (isBeautyTab(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  React.useEffect(() => {
    configAppView({
      headerColor: '#ffffff',
      headerTextColor: 'black',
      actionBar: { hide: true },
    }).catch(() => {});
  }, []);

  const buildCurrentMiniAppUser = React.useCallback((): CachedZaloUser | null => {
    const resolvedId = zaloUserId.trim();
    const resolvedPhone = normalizePhoneValue(zaloPhone);

    if (!resolvedId || !resolvedPhone) {
      return null;
    }

    return {
      id: resolvedId,
      name: normalizeZaloName(zaloProfile.name),
      avatar: normalizeZaloAvatar(zaloProfile.avatar),
      phone: resolvedPhone,
    };
  }, [zaloPhone, zaloProfile.avatar, zaloProfile.name, zaloUserId]);

  const applyRewardState = React.useCallback((state: MiniAppRewardState): void => {
    setCompletedIds(state.completedIds);
    setClaimedFreeVoucherIds(state.claimedFreeVoucherIds);
    setRedeemedVoucherIds(state.redeemedVoucherIds);
    setSpentPoints(state.spentPoints);
    setClaimedMilestonePcts(state.claimedMilestonePcts);
    setVotes(state.votes);
  }, []);

  const applyResolvedUser = React.useCallback((user: CachedZaloUser): void => {
    const resolvedId = user.id.trim();
    const normalizedPhone = normalizePhoneValue(user.phone);
    setZaloUserId(resolvedId);
    setZaloProfile({
      name: normalizeZaloName(user.name),
      avatar: normalizeZaloAvatar(user.avatar),
    });
    setZaloPhone(normalizedPhone);
    setDisplayPhone(formatPhoneDisplay(normalizedPhone));

    // Kiểm tra object window.zalo
      // Zalo Mini App đang chạy trên ứng dụng Zalo thực
      const cachedQr = readCachedQrTicket(resolvedId, normalizedPhone);
      if (cachedQr) {
        setOrderCode(cachedQr.ticketCode);
        setQrValue(cachedQr.qrValue);
        setQrGenerated(true);
        return;
      }

    setOrderCode('');
    setQrValue('');
    setQrGenerated(false);
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const bootstrapUser = async (): Promise<void> => {
      try {
        const resolvedUser = await resolveZaloUserFromSdk({
          requestPermissions: false,
        });

        if (cancelled) {
          return;
        }

        applyResolvedUser(resolvedUser);
        setPermissionsGranted(true);
        setScreen('main');
        console.log('[BeautySummit] bootstrap sdk user resolved, opening dashboard');

        try {
          await syncMiniAppUser(resolvedUser);
        } catch (error) {
          console.warn('[BeautySummit] silent user sync failed after sdk bootstrap:', error);
        }
      } catch (error) {
        console.warn('[BeautySummit] bootstrap sdk user unavailable, opening onboarding:', error);
        if (!cancelled) {
          setZaloUserId('');
          setZaloPhone('');
          setTicketOrders([]);
          setTicketsError(null);
          setOrderCode('');
          setQrValue('');
          setQrGenerated(false);
          setPermissionsGranted(false);
          setScreen('onboarding');
        }
      } finally {
        if (!cancelled) {
          setAppBootstrapping(false);
        }
      }
    };

    void bootstrapUser();

    return () => {
      cancelled = true;
    };
  }, [applyResolvedUser]);

  React.useEffect(() => {
    const resolvedId = zaloUserId.trim();
    if (!resolvedId) {
      return;
    }

    const cachedQr = readCachedQrTicket(resolvedId, zaloPhone);
    if (!cachedQr) {
      return;
    }

    setOrderCode(cachedQr.ticketCode);
    setQrValue(cachedQr.qrValue);
    setQrGenerated(true);
    console.log('[BeautySummit] QR cache restored after bootstrap:', cachedQr);
  }, [zaloUserId]);

  React.useEffect(() => {
    return () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const openPermissionNotice = React.useCallback((): void => {
    setOaPromptOpen(false);
    setPermissionIntent('activate');
    setPermissionStep('profile');
  }, []);

  React.useEffect(() => {
    if (!oaPromptOpen) {
      return;
    }

    showOAWidget({
      id: OA_WIDGET_ID,
      guidingText: 'Quan tâm Beauty Summit Vietnam trên Zalo',
      color: '#0068FF',
      onStatusChange: (status:any) => {
        console.log('[BeautySummit] OA widget status:', status);
        if (status === true) {
          openPermissionNotice();
        }
      },
      onError: (error:any) => {
        console.warn('[BeautySummit] OA widget error:', error);
      },
    }).catch((error) => {
      console.warn('[BeautySummit] showOAWidget failed:', error);
    });
  }, [oaPromptOpen, openPermissionNotice]);

  const missions = buildMissions(tier);
  const allMissions = [...missions.before, ...missions.day1, ...missions.day2];
  const currentPhaseMissions = missions[activePhase];
  const completedSet = new Set(completedIds);
  const totalPoints = allMissions
    .filter((mission) => completedSet.has(mission.id))
    .reduce((accumulator, mission) => accumulator + mission.points, 0);
  const availablePoints = totalPoints - spentPoints;
  const progress =
    allMissions.length === 0 ? 0 : Math.round((completedIds.length / allMissions.length) * 100);
  const currentTier = TIERS[tier];
  const accessibleZones = CHECKIN_ZONES.filter((zone) => zone.tiers.includes(tier));

  const phaseProgressMap: Record<MissionPhase, number> = {
    before: Math.round(
      (missions.before.filter((mission) => completedSet.has(mission.id)).length /
        Math.max(missions.before.length, 1)) *
        100,
    ),
    day1: Math.round(
      (missions.day1.filter((mission) => completedSet.has(mission.id)).length /
        Math.max(missions.day1.length, 1)) *
        100,
    ),
    day2: Math.round(
      (missions.day2.filter((mission) => completedSet.has(mission.id)).length /
        Math.max(missions.day2.length, 1)) *
        100,
    ),
  };

  const expandedMission: Mission | null =
    allMissions.find((mission) => mission.id === expandedMissionId) ?? null;
  const selectedVoucher: Voucher | null =
    [...bpointVouchers, ...freeVouchers].find((voucher) => voucher.id === selectedVoucherId) ??
    null;
  const selectedMilestone: Milestone | null =
    MILESTONES.find((milestone) => milestone.pct === selectedMilestonePct) ?? null;
  const selectedCategory: VoteCategory | null =
    voteCategories.find((category) => category.id === selectedBrandKey?.categoryId) ?? null;
  const selectedBrand: VoteBrand | null =
    selectedCategory?.brands.find((brand) => brand.id === selectedBrandKey?.brandId) ?? null;
  const currentTicket = ticketOrders.find((ticket) => ticket.code === normalizeTicketCode(orderCode));
  const currentTicketLabel = formatTicketLabel(currentTicket?.ticketClass || currentTier.name);

  const showToast = React.useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const handleOpenSupportOaChat = React.useCallback(async (): Promise<void> => {
    try {
      await openChat({
        type: 'oa',
        id: '3374320125227368636',
        message: 'Xin chào, tôi cần hỗ trợ tìm mã vé Beauty Summit.',
      });
    } catch (error) {
      console.warn('[BeautySummit] unable to open OA chat:', error);
      showToast('Không thể mở Zalo OA trong môi trường hiện tại');
    }
  }, [showToast]);

  const loadTicketOrders = React.useCallback(async (zid: string, phone: string): Promise<void> => {
    const normalizedZid = zid.trim();
    const normalizedPhone = normalizePhoneValue(phone);
    if (!normalizedZid || !normalizedPhone) {
      return;
    }

    setTicketsLoading(true);
    setTicketsError(null);
    setMiniAppLoading(true);

    try {
      const orders = await fetchMiniAppTicketOrders(normalizedZid, normalizedPhone);
      if (orders.length === 0) {
        console.log('[BeautySummit] ticket list loaded with no orders for phone:', normalizedPhone);
      }

      setTicketOrders(orders);
    } catch (error) {
      if (shouldRetryTicketFetchAfterSync(error)) {
        console.warn('[BeautySummit] ticket list unauthorized, retrying after user sync:', error);

        try {
          const syncUser = {
            id: normalizedZid,
            name: normalizeZaloName(zaloProfile.name),
            avatar: normalizeZaloAvatar(zaloProfile.avatar),
            phone: normalizedPhone,
          };

          await syncMiniAppUser(syncUser);
          const retryOrders = await fetchMiniAppTicketOrders(normalizedZid, normalizedPhone);
          setTicketOrders(retryOrders);
          setTicketsError(null);
          return;
        } catch (retryError) {
          console.warn('[BeautySummit] ticket list retry after sync failed:', retryError);
          setTicketsError(readApiErrorMessage(retryError, 'Không thể tải danh sách vé. Vui lòng thử lại.'));
          return;
        }
      }

      console.warn('[BeautySummit] unable to fetch ticket orders:', error);
      setTicketsError(readApiErrorMessage(error, 'Không thể tải danh sách vé. Vui lòng thử lại.'));
    } finally {
      setTicketsLoading(false);
      setMiniAppLoading(false);
    }
  }, [zaloProfile.avatar, zaloProfile.name]);

  const loadRewardBundle = React.useCallback(async (zid: string, phone: string): Promise<void> => {
    const normalizedZid = zid.trim();
    const normalizedPhone = normalizePhoneValue(phone);
    if (!normalizedZid || !normalizedPhone) {
      return;
    }

    setMiniAppLoading(true);

    const currentUser = {
      id: normalizedZid,
      name: normalizeZaloName(zaloProfile.name),
      avatar: normalizeZaloAvatar(zaloProfile.avatar),
      phone: normalizedPhone,
    };

    try {
      const rewards = await loadMiniAppRewards(currentUser);
      applyRewardState(rewards.state);
      setBpointVouchers(rewards.vouchers.bpoint);
      setFreeVouchers(rewards.vouchers.free);
      setVoteCategories(rewards.voteCategories);
    } catch (error) {
      if (shouldRetryTicketFetchAfterSync(error)) {
        try {
          await syncMiniAppUser(currentUser);
          const retryRewards = await loadMiniAppRewards(currentUser);
          applyRewardState(retryRewards.state);
          setBpointVouchers(retryRewards.vouchers.bpoint);
          setFreeVouchers(retryRewards.vouchers.free);
          setVoteCategories(retryRewards.voteCategories);
          return;
        } catch (retryError) {
          console.warn('[BeautySummit] reward state retry after sync failed:', retryError);
        }
      }

      console.warn('[BeautySummit] unable to load reward bundle:', error);
    } finally {
      setMiniAppLoading(false);
    }
  }, [applyRewardState, zaloProfile.avatar, zaloProfile.name]);

  const runRewardStateUpdate = React.useCallback(
    async (
      action: 'complete-mission' | 'claim-voucher' | 'redeem-voucher' | 'claim-milestone' | 'toggle-vote',
      payload: Record<string, unknown>,
    ): Promise<MiniAppRewardState> => {
      const currentUser = buildCurrentMiniAppUser();
      if (!currentUser) {
        throw new Error('Unable to load account information');
      }

      try {
        const nextState = await updateMiniAppRewardState(currentUser, action, payload);
        applyRewardState(nextState);
        return nextState;
      } catch (error) {
        if (shouldRetryTicketFetchAfterSync(error)) {
          await syncMiniAppUser(currentUser);
          const retryState = await updateMiniAppRewardState(currentUser, action, payload);
          applyRewardState(retryState);
          return retryState;
        }

        throw error;
      }
    },
    [applyRewardState, buildCurrentMiniAppUser],
  );

  React.useEffect(() => {
    if (screen !== 'main' || !permissionsGranted || !zaloPhone || !zaloUserId) {
      return;
    }

    void loadTicketOrders(zaloUserId, zaloPhone);
  }, [loadTicketOrders, permissionsGranted, screen, zaloPhone, zaloUserId]);

  React.useEffect(() => {
    if (screen !== 'main' || !permissionsGranted || !zaloPhone || !zaloUserId) {
      return;
    }

    void loadRewardBundle(zaloUserId, zaloPhone);
  }, [loadRewardBundle, permissionsGranted, screen, zaloPhone, zaloUserId]);

  const markMissionComplete = React.useCallback(
    async (missionId: string, message = 'Nhiệm vụ đã hoàn thành'): Promise<boolean> => {
      if (completedSet.has(missionId)) {
        return true;
      }

      try {
        await runRewardStateUpdate('complete-mission', { missionId });
        showToast(message);
        return true;
      } catch (error) {
        showToast(readApiErrorMessage(error, 'Không thể cập nhật nhiệm vụ'));
        return false;
      }
    },
    [completedSet, runRewardStateUpdate, showToast],
  );

  React.useEffect(() => {
    if (progress < 100) {
      setRewardScreenSeen(false);
      return;
    }

    if (screen === 'main' && progress === 100 && !rewardScreenSeen) {
      setRewardScreenSeen(true);
      setScreen('reward');
    }
  }, [progress, rewardScreenSeen, screen]);

  React.useEffect(() => {
    if (Object.keys(votes).length >= 2) {
      const voteMissionId = `${tier}-d1-vote`;
      if (!completedSet.has(voteMissionId)) {
        void markMissionComplete(voteMissionId, 'Đã mở khóa nhiệm vụ vote');
      }
    }
  }, [tier, votes, completedSet, markMissionComplete]);

  const handleSubmitMission = (): void => {
    if (!expandedMission) {
      return;
    }

    const value = proofInputs[expandedMission.id] ?? '';
    const needsValue =
      expandedMission.proofType === 'link' ||
      expandedMission.proofType === 'code' ||
      expandedMission.proofType === 'image' ||
      expandedMission.proofType === 'survey' ||
      expandedMission.proofType === 'referral';

    if (needsValue && value.trim().length === 0) {
      showToast('Vui lòng hoàn thành bước xác nhận trước');
      return;
    }

    void (async () => {
      const success = await markMissionComplete(expandedMission.id);
      if (success) {
        setExpandedMissionId(null);
      }
    })();
  };

  const handleToggleVote = (category: VoteCategory, brand: VoteBrand): void => {
    void (async () => {
      try {
        await runRewardStateUpdate('toggle-vote', {
          categoryId: category.id,
          brandId: brand.id,
          orderCode,
        });
        if (zaloUserId && zaloPhone) {
          await loadRewardBundle(zaloUserId, zaloPhone);
        }
        showToast(`Đã cập nhật vote cho ${brand.name}`);
      } catch (error) {
        showToast(readApiErrorMessage(error, 'Không thể cập nhật vote'));
      }
    })();
  };

  const handleTermsContinue = async (): Promise<void> => {
    if (!agreed || miniAppLoading) {
      return;
    }

    setOaPromptOpen(true);
  };

  const handleSelectTicket = (ticketCode: string): void => {
    setOrderCode(normalizeTicketCode(ticketCode));
  };

  const handleRefreshTicketOrders = (): void => {
    if (!zaloPhone || !zaloUserId) {
      setTicketsError('Không thấy số điện thoại để tải danh sách vé.');
      return;
    }

    void loadTicketOrders(zaloUserId, zaloPhone);
  };

  const handleCopyTicketCode = async (ticketCode: string): Promise<void> => {
    const normalizedCode = normalizeTicketCode(ticketCode);
    if (!normalizedCode) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(normalizedCode);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = normalizedCode;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      showToast('Đã copy mã vé');
    } catch {
      showToast('Không thể copy mã vé');
    }
  };

  const handleGenerateQr = async (): Promise<void> => {
    const normalizedCode = normalizeTicketCode(orderCode);
    if (!normalizedCode) {
      return;
    }

    let selectedTicket = ticketOrders.find((ticket) => ticket.code === normalizedCode);
    if (!selectedTicket) {
      const resolvedUserId = zaloUserId.trim();
      const resolvedPhone = normalizePhoneValue(zaloPhone);
      if (!resolvedUserId || !resolvedPhone) {
        showToast('Unable to load account information');
        return;
      }

      setMiniAppLoading(true);

      try {
        selectedTicket = await claimMiniAppTicketOrder(normalizedCode, {
          id: resolvedUserId,
          name: normalizeZaloName(zaloProfile.name),
          avatar: normalizeZaloAvatar(zaloProfile.avatar),
          phone: resolvedPhone,
        });
        setTicketOrders((current) => {
          const withoutClaimed = current.filter((ticket) => ticket.code !== selectedTicket?.code);
          return selectedTicket ? [selectedTicket, ...withoutClaimed] : current;
        });
        showToast('Mã vé đã được cập nhật thông tin');
      } catch (error) {
        showToast(readApiErrorMessage(error, 'Không thể cập nhật mã vé'));
        return;
      } finally {
        setMiniAppLoading(false);
      }
    }

    if (selectedTicket.checkedIn) {
      showToast('Mã vé này đã check-in');
      return;
    }

    setOrderCode(normalizedCode);

    if (permissionsGranted) {
      finalizeQr(normalizedCode);
      return;
    }

    setPermissionIntent('generate-qr');
    setPermissionStep('profile');
  };

  const finalizeQr = (nextTicketCode?: string, nextUserId?: string): void => {
    const normalizedCode = normalizeTicketCode(nextTicketCode ?? orderCode);
    const resolvedUserId = nextUserId?.trim() || zaloUserId.trim();

    if (!normalizedCode || !resolvedUserId) {
      showToast('Unable to load account information');
      return;
    }

    const resolvedPhone = normalizePhoneValue(zaloPhone);
    if (!resolvedPhone) {
      showToast('Unable to load account information');
      return;
    }

    const nextQrValue = buildCheckinQrValue(resolvedPhone, normalizedCode);
    writeCachedQrTicket({
      userId: resolvedUserId,
      phone: resolvedPhone,
      ticketCode: normalizedCode,
      qrValue: nextQrValue,
    });

    setPermissionStep(null);
    setOrderCode(normalizedCode);
    setQrValue(nextQrValue);
    setQrGenerated(true);
    void markMissionComplete(`${tier}-b1`, 'QR created successfully');
    showToast('App is ready for check-in');
  };
  const handleEditTicketCode = (): void => {
    clearCachedQrTicket();
    setQrGenerated(false);
    setQrValue('');
    setOrderCode('');
  };
  const handlePermissionDenied = async () => {
    if (miniAppLoading) {
      return;
    }

    setPermissionStep(null);
    setPermissionIntent(null);
    setPermissionsGranted(false);

    if (permissionIntent === 'activate') {
      setAgreed(false);
      setSlideIndex(0);
      setScreen('onboarding');
    }
  };
  const handlePermissionApproved = async (): Promise<void> => {
    const intent = permissionIntent;
    if (miniAppLoading) {
      return;
    }

    setPermissionStep(null);
    setPermissionIntent(null);

    setMiniAppLoading(true);

    try {
      const resolvedUser = await resolveZaloUserFromSdk({
        requestPermissions: true,
      });

      applyResolvedUser(resolvedUser);

      try {
        await syncMiniAppUser(resolvedUser);
      } catch {
        showToast('Loi dong bo tai khoan, vui long thu lai!');
      }

      setPermissionsGranted(true);
      if (intent === 'generate-qr') {
        finalizeQr(undefined, resolvedUser.id);
      } else {
        setScreen('main');
        showToast('Da kich hoat app thanh cong');
      }
      return;
    } catch (error: any) {
      if (error.code === -1401 || error.code === -201) {
        setPermissionsGranted(false);
        setAgreed(false);
        setSlideIndex(0);
        setScreen('onboarding');
        return;
      }

      showToast('Khong the kich hoat app trong moi truong hien tai');
      return;
    } finally {
      setMiniAppLoading(false);
    }
  };

  const handleDemoCheckin = (zoneId: string): void => {
    const zone = accessibleZones.find((item) => item.id === zoneId);
    if (!zone) {
      return;
    }

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const gateCheckins = checkinLog.filter((item) => item.zoneId === 'gate').length;
    const day = gateCheckins === 0 ? 'Ngày 1' : 'Ngày 2';

    setCheckinLog((current) => [
      {
        id: `${zone.id}-${Date.now()}`,
        zoneId: zone.id,
        zoneName: zone.name,
        color: zone.color,
        time,
        day,
      },
      ...current,
    ]);

    if (zone.id === 'gate') {
      const missionId = gateCheckins === 0 ? `${tier}-d1-1` : `${tier}-d2-1`;
      void markMissionComplete(missionId, `Da ghi nhan check-in ${day.toLowerCase()}`);
    }

    showToast(`Đã quét tại ${zone.name}`);
  };

  const handleRedeemVoucher = (voucher: Voucher): void => {
    const cost = voucher.cost ?? 0;
    if (availablePoints < cost || redeemedVoucherIds.includes(voucher.id)) {
      return;
    }

    void (async () => {
      try {
        await runRewardStateUpdate('redeem-voucher', { voucherId: voucher.id });
        setSelectedVoucherId(voucher.id);
        showToast(`Doi voucher thanh cong - ${cost} BP`);
      } catch (error) {
        showToast(readApiErrorMessage(error, 'Khong the doi voucher'));
      }
    })();
  };

  const handleClaimVoucher = (voucher: Voucher): void => {
    void (async () => {
      try {
        if (!claimedFreeVoucherIds.includes(voucher.id)) {
          await runRewardStateUpdate('claim-voucher', { voucherId: voucher.id });
          showToast(`Đã nhận voucher ${voucher.brand}`);
        }
        setSelectedVoucherId(voucher.id);
      } catch (error) {
        showToast(readApiErrorMessage(error, 'Khong the nhan voucher'));
      }
    })();
  };

  const handleClaimMilestone = (): void => {
    if (!selectedMilestone) {
      return;
    }

    if (progress < selectedMilestone.pct) {
      showToast('Bạn chưa đạt đủ tiến độ cho mốc quà này');
      return;
    }

    if (claimedMilestonePcts.includes(selectedMilestone.pct)) {
      return;
    }

    void (async () => {
      try {
        await runRewardStateUpdate('claim-milestone', { milestonePct: selectedMilestone.pct });
        showToast(`Đã nhận mốc quà ${selectedMilestone.pct}%`);
      } catch (error) {
        showToast(readApiErrorMessage(error, 'Không thể nhận mốc quà'));
      }
    })();
  };

  const handleRunScanner = async (): Promise<void> => {
    setScannerBusy(true);

    try {
      const { content } = await scanQRCode();
      setScannerResult(content);
      showToast('Đã quét mã thành công');
    } catch {
      showToast('Không thể mở trình quét trong môi trường hiện tại');
    } finally {
      setScannerBusy(false);
    }
  };

  const handleReturnToDashboard = React.useCallback((): void => {
    if (scannerOpen) {
      setScannerOpen(false);
      return;
    }

    if (policyOpen) {
      setPolicyOpen(false);
      return;
    }

    if (expandedMissionId) {
      setExpandedMissionId(null);
      return;
    }

    if (selectedVoucherId) {
      setSelectedVoucherId(null);
      return;
    }

    if (selectedBrandKey) {
      setSelectedBrandKey(null);
      return;
    }

    if (selectedMilestonePct !== null) {
      setSelectedMilestonePct(null);
      return;
    }

    if (screen === 'qr' || screen === 'reward') {
      setScreen('main');
    }
  }, [
    expandedMissionId,
    policyOpen,
    scannerOpen,
    screen,
    selectedBrandKey,
    selectedMilestonePct,
    selectedVoucherId,
  ]);

  React.useEffect(() => {
    const openedFromDashboard =
      screen === 'qr' ||
      screen === 'reward' ||
      (screen === 'main' &&
        Boolean(
          expandedMissionId ||
            selectedVoucherId ||
            selectedBrandKey ||
            selectedMilestonePct ||
            policyOpen ||
            scannerOpen,
        ));

    if (openedFromDashboard) {
      onHeaderChange({
        variant: 'back',
        onBack: handleReturnToDashboard,
      });
      return;
    }

    onHeaderChange({ variant: 'logo' });
  }, [
    expandedMissionId,
    handleReturnToDashboard,
    onHeaderChange,
    screen,
    selectedBrandKey,
    selectedMilestonePct,
    selectedVoucherId,
    policyOpen,
    scannerOpen,
  ]);

  React.useEffect(() => {
    return () => {
      onHeaderChange({ variant: 'logo' });
    };
  }, [onHeaderChange]);

  let userName = 'Minh Hoàng';
  userName = zaloProfile.name || userName;
  const userAvatar = zaloProfile.avatar || DEFAULT_ZALO_PROFILE.avatar;
  const userPhone = displayPhone;
  const userRole: BeautyUserRole = 'guest';
  if (appBootstrapping) {
    return <BeautyShell loading loadingLabel="Checking account..." toast={toast} />;
  }

  return (
    <BeautyShell loading={miniAppLoading} loadingLabel="Loading account..." toast={toast}>
      {screen === 'onboarding' ? (
        <OnboardingScreen
          slides={ONBOARDING_SLIDES}
          slideIndex={slideIndex}
          onSelect={setSlideIndex}
          onSkip={() => setScreen('terms')}
          onNext={() => {
            if (slideIndex === ONBOARDING_SLIDES.length - 1) {
              setScreen('terms');
              return;
            }
            setSlideIndex((current) => current + 1);
          }}
        />
      ) : null}

      {screen === 'terms' ? (
        <TermsScreen
          agreed={agreed}
          onToggleAgree={() => setAgreed((current) => !current)}
          onContinue={handleTermsContinue}
        />
      ) : null}

      {screen === 'qr' ? (
        <QrScreen
          tier={currentTier}
          ticketLabel={currentTicketLabel}
          orderCode={orderCode}
          qrGenerated={qrGenerated}
          availablePoints={availablePoints}
          totalPoints={totalPoints}
          userName={userName}
          userAvatar={userAvatar}
          userPhone={userPhone}
          qrValue={qrValue}
          zones={accessibleZones}
          checkinLog={checkinLog}
          ticketOrders={ticketOrders}
          ticketsLoading={ticketsLoading}
          ticketsError={ticketsError}
          onOrderCodeChange={setOrderCode}
          onSelectTicket={handleSelectTicket}
          onGenerate={handleGenerateQr}
          onEditTicketCode={handleEditTicketCode}
          onCopyTicketCode={handleCopyTicketCode}
          onRefreshTickets={handleRefreshTicketOrders}
          onDemoCheckin={handleDemoCheckin}
          onOpenTicketHelp={() => setTicketHelpOpen(true)}
        />
      ) : null}

      {screen === 'main' ? (
        <DashboardScreen
          tier={currentTier}
          ticketLabel={currentTicketLabel}
          activeTab={activeTab}
          activePhase={activePhase}
          voucherTab={voucherTab}
          bpointVouchers={bpointVouchers}
          freeVouchers={freeVouchers}
          proofValue={expandedMission ? proofInputs[expandedMission.id] ?? '' : ''}
          progress={progress}
          totalPoints={totalPoints}
          spentPoints={spentPoints}
          availablePoints={availablePoints}
          qrGenerated={qrGenerated}
          voteCategories={voteCategories}
          userName={userName}
          userAvatar={userAvatar}
          userPhone={userPhone}
          userRole={userRole}
          orderCode={orderCode}
          qrValue={qrValue}
          currentPhaseMissions={currentPhaseMissions}
          allMissionCount={allMissions.length}
          completedIds={completedIds}
          claimedFreeVoucherIds={claimedFreeVoucherIds}
          redeemedVoucherIds={redeemedVoucherIds}
          claimedMilestonePcts={claimedMilestonePcts}
          votes={votes}
          voteQuery={voteQuery}
          selectedVoucher={selectedVoucher}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedMilestone={selectedMilestone}
          expandedMission={expandedMission}
          policyOpen={policyOpen}
          scannerOpen={scannerOpen}
          scannerBusy={scannerBusy}
          scannerResult={scannerResult}
          phaseProgressMap={phaseProgressMap}
          onTabChange={setActiveTab}
          onPhaseChange={setActivePhase}
          onVoucherTabChange={setVoucherTab}
          onProofValueChange={(value) => {
            if (!expandedMission) {
              return;
            }
            setProofInputs((current) => ({ ...current, [expandedMission.id]: value }));
          }}
          onOpenMission={(mission) => setExpandedMissionId(mission.id)}
          onCloseMission={() => setExpandedMissionId(null)}
          onSubmitMission={handleSubmitMission}
          onVoteQueryChange={setVoteQuery}
          onToggleVote={handleToggleVote}
          onOpenBrand={(category, brand) =>
            setSelectedBrandKey({ categoryId: category.id, brandId: brand.id })
          }
          onCloseBrand={() => setSelectedBrandKey(null)}
          onOpenVoucher={(voucher) => setSelectedVoucherId(voucher.id)}
          onCloseVoucher={() => setSelectedVoucherId(null)}
          onRedeemVoucher={handleRedeemVoucher}
          onClaimVoucher={handleClaimVoucher}
          onOpenMilestone={(milestone) => setSelectedMilestonePct(milestone.pct)}
          onCloseMilestone={() => setSelectedMilestonePct(null)}
          onClaimMilestone={handleClaimMilestone}
          onOpenQr={() => setScreen('qr')}
          onChangeTicket={() => {
            handleEditTicketCode();
            setScreen('qr');
          }}
          onOpenPolicy={() => setPolicyOpen(true)}
          onClosePolicy={() => setPolicyOpen(false)}
          onOpenScanner={() => setScannerOpen(true)}
          onCloseScanner={() => setScannerOpen(false)}
          onRunScanner={handleRunScanner}
        />
      ) : null}

      {screen === 'reward' ? (
        <RewardCompletionScreen tier={tier} orderCode={orderCode} onBack={() => setScreen('main')} />
      ) : null}

      <TicketHelpModal
        open={ticketHelpOpen}
        onClose={() => setTicketHelpOpen(false)}
        onOpenSupportChat={() => {
          void handleOpenSupportOaChat();
        }}
      />

      <OaWidgetModal open={oaPromptOpen} widgetId={OA_WIDGET_ID} onSkip={openPermissionNotice} />

      <PermissionNoticeModal
        open={Boolean(permissionStep)}
        loading={miniAppLoading}
        onApprove={handlePermissionApproved}
        onDeny={handlePermissionDenied}
      />

      {screen === 'qr' && qrGenerated ? (
        <button
          type="button"
          onClick={() => setScreen('main')}
          className="absolute right-4 bottom-4 z-30 rounded-full bg-[linear-gradient(135deg,#ec4899,#f59e0b)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(236,72,153,0.28)]"
        >
          Về dashboard
        </button>
      ) : null}
    </BeautyShell>
  );
};

export default BeautySummitExperience;

