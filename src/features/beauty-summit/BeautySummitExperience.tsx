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
import { authorize, nativeStorage, showOAWidget } from 'zmp-sdk/apis';

import {
  BPOINT_VOUCHERS,
  CHECKIN_ZONES,
  FREE_VOUCHERS,
  MILESTONES,
  ONBOARDING_SLIDES,
  TIERS,
  VOTE_CATEGORIES,
  buildMissions,
} from '@/features/beauty-summit/data';
import type { HeaderProps } from '@/components/Header';
import BeautyShell from '@/features/beauty-summit/components/BeautyShell';
import { BrandMark, CloseIcon, TrophyIcon } from '@/features/beauty-summit/icons';
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
  MiniAppTicketOrder,
  Mission,
  MissionPhase,
  TierKey,
  Voucher,
  VoteBrand,
  VoteCategory,
} from '@/features/beauty-summit/types';
import apiClient from '@/lib/api-client';
import { generateQrMarkup } from '@/features/beauty-summit/utils';

interface BeautySummitExperienceProps {
  onHeaderChange: (config: HeaderProps) => void;
}

const DEFAULT_ZALO_PROFILE = {
  name: 'User Name',
  avatar: 'https://h5.zdn.vn/static/images/avatar.png',
} as const;

const DEFAULT_PHONE_DISPLAY = import.meta.env.VITE_DEFAULT_PHONE_DISPLAY?.trim() || '0912 345 678';
const FALLBACK_ZALO_PHONE = import.meta.env.VITE_FALLBACK_ZALO_PHONE?.trim() || '84123456789';
const ZALO_USER_STORAGE_KEY =
  import.meta.env.VITE_ZALO_USER_STORAGE_KEY?.trim() || 'beauty-summit.zalo-user';
const ZALO_QR_STORAGE_KEY =
  import.meta.env.VITE_ZALO_QR_STORAGE_KEY?.trim() || 'beauty-summit.qr-checkin';
const OA_WIDGET_ID = 'beautySummitOaWidget';
const FORCE_ONBOARDING_PERMISSION_TEST =
  import.meta.env.VITE_FORCE_ONBOARDING_PERMISSION_TEST === 'true';
const BEAUTY_TABS: readonly BeautyTab[] = ['missions', 'vouchers', 'vote', 'profile'];

const isBeautyTab = (value: string | null): value is BeautyTab =>
  Boolean(value && BEAUTY_TABS.includes(value as BeautyTab));

interface CachedZaloUser {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

interface CachedQrTicket {
  userId: string;
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

const formatPhoneDisplay = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('84')) {
    const local = `0${digits.slice(2)}`;
    return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return value;
};

const normalizePhoneValue = (value: string): string => value.replace(/\s/g, '');
const normalizeTicketCode = (value: string): string => value.trim().toUpperCase();
const buildCheckinQrValue = (_userId: string, ticketCode: string): string => normalizeTicketCode(ticketCode);

const isCompleteZaloUser = (value: Partial<CachedZaloUser> | null | undefined): value is CachedZaloUser =>
  Boolean(value?.id?.trim() && value?.avatar?.trim() && value?.phone?.trim());
const isCompleteCachedQrTicket = (
  value: Partial<CachedQrTicket> | null | undefined,
): value is CachedQrTicket =>
  Boolean(value?.userId?.trim() && value?.ticketCode?.trim() && value?.qrValue?.trim());

const readCachedZaloUser = (): CachedZaloUser | null => {
  if (FORCE_ONBOARDING_PERMISSION_TEST) {
    console.log('[BeautySummit] nativeStorage user cache disabled for permission test');
    return null;
  }

  try {
    console.log('[BeautySummit] checking nativeStorage key:', ZALO_USER_STORAGE_KEY);
    const rawValue = nativeStorage.getItem(ZALO_USER_STORAGE_KEY);
    console.log('[BeautySummit] nativeStorage raw user:', rawValue);

    if (!rawValue) {
      console.log('[BeautySummit] nativeStorage cache miss');
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<CachedZaloUser>;
    if (!isCompleteZaloUser(parsedValue)) {
      console.log('[BeautySummit] nativeStorage cache incomplete:', parsedValue);
      nativeStorage.removeItem(ZALO_USER_STORAGE_KEY);
      return null;
    }

    const cachedUser = {
      id: parsedValue.id.trim(),
      name: parsedValue.name?.trim() || DEFAULT_ZALO_PROFILE.name,
      avatar: parsedValue.avatar.trim(),
      phone: normalizePhoneValue(parsedValue.phone),
    };
    console.log('[BeautySummit] nativeStorage cache hit:', cachedUser);
    return cachedUser;
  } catch {
    // Kiểm tra object window.zalo
    if (window.zalo) {
      nativeStorage.clear();
    } 
    return null;
  }
};

const writeCachedZaloUser = (value: CachedZaloUser): void => {
  nativeStorage.setItem(
    ZALO_USER_STORAGE_KEY,
    JSON.stringify({
      ...value,
      phone: normalizePhoneValue(value.phone),
    }),
  );
};

const readCachedQrTicket = (expectedUserId?: string | null): CachedQrTicket | null => {
  try {
    const rawValue = nativeStorage.getItem(ZALO_QR_STORAGE_KEY);
    console.log('[BeautySummit] nativeStorage raw qr:', rawValue);

    if (!rawValue) {
      console.log('[BeautySummit] QR cache miss');
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<CachedQrTicket>;
    if (!isCompleteCachedQrTicket(parsedValue)) {
      console.log('[BeautySummit] QR cache incomplete:', parsedValue);
      nativeStorage.removeItem(ZALO_QR_STORAGE_KEY);
      return null;
    }

    const cachedQr = {
      userId: parsedValue.userId.trim(),
      ticketCode: normalizeTicketCode(parsedValue.ticketCode),
      qrValue: parsedValue.qrValue.trim(),
    };

    if (expectedUserId?.trim() && cachedQr.userId !== expectedUserId.trim()) {
      console.log('[BeautySummit] QR cache user mismatch, clearing cache');
      nativeStorage.removeItem(ZALO_QR_STORAGE_KEY);
      return null;
    }

    const expectedQrValue = buildCheckinQrValue(cachedQr.userId, cachedQr.ticketCode);
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
    nativeStorage.removeItem(ZALO_QR_STORAGE_KEY);
    console.log('[BeautySummit] QR cache parse failed, cache cleared');
    return null;
  };
};

const writeCachedQrTicket = (value: CachedQrTicket): void => {
  nativeStorage.setItem(
    ZALO_QR_STORAGE_KEY,
    JSON.stringify({
      userId: value.userId.trim(),
      ticketCode: normalizeTicketCode(value.ticketCode),
      qrValue: value.qrValue.trim(),
    }),
  );
};

const clearCachedQrTicket = (): void => {
  nativeStorage.removeItem(ZALO_QR_STORAGE_KEY);
};

const requestZaloPermissions = async (): Promise<void> => {
  const permissions = await authorize({
    scopes: ['scope.userInfo', 'scope.userPhonenumber'],
  });
  console.log('[BeautySummit] Zalo permissions granted:', permissions);

  if (!permissions['scope.userInfo'] || !permissions['scope.userPhonenumber']) {
    throw new Error('Required Zalo permissions were not granted');
  }
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

const readApiErrorMessage = (error: unknown, fallback: string): string => {
  const response = (error as { response?: { data?: { message?: string } } } | null)?.response;
  return response?.data?.message || (error instanceof Error ? error.message : fallback);
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
  const [claimedMilestonePcts, setClaimedMilestonePcts] = React.useState<number[]>([]);
  const [votes, setVotes] = React.useState<Record<string, string>>({});
  const [voteQuery, setVoteQuery] = React.useState<string>('');
  const [proofInputs, setProofInputs] = React.useState<Record<string, string>>({});
  const [expandedMissionId, setExpandedMissionId] = React.useState<string | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = React.useState<string | null>(null);
  const [selectedMilestonePct, setSelectedMilestonePct] = React.useState<number | null>(null);
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

  const applyResolvedUser = React.useCallback((user: CachedZaloUser): void => {
    const resolvedId = user.id.trim();
    const normalizedPhone = normalizePhoneValue(user.phone);
    setZaloUserId(resolvedId);
    setZaloProfile({
      name: user.name || DEFAULT_ZALO_PROFILE.name,
      avatar: user.avatar || DEFAULT_ZALO_PROFILE.avatar,
    });
    setZaloPhone(normalizedPhone);
    setDisplayPhone(formatPhoneDisplay(normalizedPhone));

    // Kiểm tra object window.zalo
    if (window.zalo) {
      // Zalo Mini App đang chạy trên ứng dụng Zalo thực
      const cachedQr = readCachedQrTicket(resolvedId);
      if (cachedQr) {
        setOrderCode(cachedQr.ticketCode);
        setQrValue(cachedQr.qrValue);
        setQrGenerated(true);
        return;
      }
    }

    setOrderCode('');
    setQrValue('');
    setQrGenerated(false);
  }, []);

  React.useEffect(() => {
    const cachedUser = readCachedZaloUser();

    if (cachedUser) {
      applyResolvedUser(cachedUser);
      setPermissionsGranted(true);
      setScreen('main');
      console.log('[BeautySummit] bootstrap cache hit, opening dashboard');
    } else {
      setZaloUserId('');
      setZaloPhone('');
      setTicketOrders([]);
      setTicketsError(null);
      setOrderCode('');
      setQrValue('');
      setQrGenerated(false);
      setPermissionsGranted(false);
      setScreen('onboarding');
      console.log('[BeautySummit] bootstrap cache miss, opening onboarding');
    }

    setAppBootstrapping(false);
  }, [applyResolvedUser]);

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
      onStatusChange: (status) => {
        console.log('[BeautySummit] OA widget status:', status);
        if (status === true) {
          openPermissionNotice();
        }
      },
      onError: (error) => {
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
    [...BPOINT_VOUCHERS, ...FREE_VOUCHERS].find((voucher) => voucher.id === selectedVoucherId) ??
    null;
  const selectedMilestone: Milestone | null =
    MILESTONES.find((milestone) => milestone.pct === selectedMilestonePct) ?? null;
  const selectedCategory: VoteCategory | null =
    VOTE_CATEGORIES.find((category) => category.id === selectedBrandKey?.categoryId) ?? null;
  const selectedBrand: VoteBrand | null =
    selectedCategory?.brands.find((brand) => brand.id === selectedBrandKey?.brandId) ?? null;

  const showToast = React.useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

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
      setTicketOrders(orders);
    } catch (error) {
      console.warn('[BeautySummit] unable to fetch ticket orders:', error);
      setTicketOrders([]);
      setTicketsError('Không thể tải danh sách vé. Vui lòng thử lại.');
    } finally {
      setTicketsLoading(false);
      setMiniAppLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (screen !== 'main' || !permissionsGranted || !zaloPhone || !zaloUserId) {
      return;
    }

    void loadTicketOrders(zaloUserId, zaloPhone);
  }, [loadTicketOrders, permissionsGranted, screen, zaloPhone, zaloUserId]);

  const markMissionComplete = React.useCallback(
    (missionId: string, message = 'Nhiệm vụ đã hoàn thành') => {
      setCompletedIds((current) => {
        if (current.includes(missionId)) {
          return current;
        }

        showToast(message);
        return [...current, missionId];
      });
    },
    [showToast],
  );

  React.useEffect(() => {
    if (screen === 'main' && progress === 100) {
      setScreen('reward');
    }
  }, [progress, screen]);

  React.useEffect(() => {
    if (Object.keys(votes).length >= 2) {
      const voteMissionId = `${tier}-d1-vote`;
      if (!completedSet.has(voteMissionId)) {
        markMissionComplete(voteMissionId, 'Đã mở khóa nhiệm vụ vote');
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

    markMissionComplete(expandedMission.id);
    setExpandedMissionId(null);
  };

  const handleToggleVote = (category: VoteCategory, brand: VoteBrand): void => {
    setVotes((current) => {
      if (current[category.id] === brand.id) {
        const next = { ...current };
        delete next[category.id];
        return next;
      }

      return { ...current, [category.id]: brand.id };
    });

    showToast(`Đã cập nhật vote cho ${brand.name}`);
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
          name: zaloProfile.name || DEFAULT_ZALO_PROFILE.name,
          avatar: zaloProfile.avatar || DEFAULT_ZALO_PROFILE.avatar,
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

    const nextQrValue = buildCheckinQrValue(resolvedUserId, normalizedCode);
    writeCachedQrTicket({
      userId: resolvedUserId,
      ticketCode: normalizedCode,
      qrValue: nextQrValue,
    });

    setPermissionStep(null);
    setOrderCode(normalizedCode);
    setQrValue(nextQrValue);
    setQrGenerated(true);
    markMissionComplete(`${tier}-b1`, 'QR created successfully');
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
  }
  const handlePermissionApproved = async (): Promise<void> => {
    const intent = permissionIntent;
    if (miniAppLoading) {
      return;
    }

    setPermissionStep(null);
    setPermissionIntent(null);

    if (intent === 'generate-qr') {
      const cachedUser = readCachedZaloUser();
      if (cachedUser) {
        applyResolvedUser(cachedUser);
        setPermissionsGranted(true);
        finalizeQr(undefined, cachedUser.id);
        return;
      }
    }

    setMiniAppLoading(true);

    try {
      let resolvedUser = readCachedZaloUser();
      if (!resolvedUser) {
        if (window.zalo) {
          await requestZaloPermissions();
        }
        const { userInfo } = await getUserInfo({
          autoRequestPermission: false,
        });
        const userID = await getUserID({}).catch(() => '');
        const resolvedId = userID || userInfo.id || '';
        const phoneNumber = await resolveZaloPhoneNumber();

        if (!resolvedId) {
          throw new Error('Không thể xác định ID người dùng Zalo!');
        }

        resolvedUser = {
          id: resolvedId,
          name: userInfo.name || DEFAULT_ZALO_PROFILE.name,
          avatar: userInfo.avatar || DEFAULT_ZALO_PROFILE.avatar,
          phone: normalizePhoneValue(phoneNumber),
        };
        // Kiểm tra object window.zalo
        if (window.zalo) {
          writeCachedZaloUser(resolvedUser);
          
        }
      }

      applyResolvedUser(resolvedUser);

      try {
        await syncMiniAppUser(resolvedUser);
      } catch (syncError) {
        showToast('Lỗi đồng bộ tài khoản, vui lòng thử lại!');
      }

      setPermissionsGranted(true);
      setScreen('main');
      showToast('Đã kích hoạt app thành công');
      return;
    } catch (error: any) {
      if (error.code === -1401 || error.code === -201) {
        setPermissionsGranted(false);
        setAgreed(false);
        setSlideIndex(0);
        setScreen('onboarding');
        return;
      }

      // console.error(error);
      showToast('Không thể kích hoạt app trong môi trường hiện tại');
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
      markMissionComplete(missionId, `Đã ghi nhận check-in ${day.toLowerCase()}`);
    }

    showToast(`Đã quét tại ${zone.name}`);
  };

  const handleRedeemVoucher = (voucher: Voucher): void => {
    const cost = voucher.cost ?? 0;
    if (availablePoints < cost || redeemedVoucherIds.includes(voucher.id)) {
      return;
    }

    setRedeemedVoucherIds((current) => [...current, voucher.id]);
    setSpentPoints((current) => current + cost);
    setSelectedVoucherId(voucher.id);
    showToast(`Đổi voucher thành công - ${cost} BP`);
  };

  const handleClaimVoucher = (voucher: Voucher): void => {
    if (!claimedFreeVoucherIds.includes(voucher.id)) {
      setClaimedFreeVoucherIds((current) => [...current, voucher.id]);
      showToast(`Đã nhận voucher ${voucher.brand}`);
    }
    setSelectedVoucherId(voucher.id);
  };

  const handleClaimMilestone = (): void => {
    if (!selectedMilestone) {
      return;
    }

    if (progress < selectedMilestone.pct) {
      showToast('Bạn chưa đạt đủ tiến độ cho mốc quà này');
      return;
    }

    if (!claimedMilestonePcts.includes(selectedMilestone.pct)) {
      setClaimedMilestonePcts((current) => [...current, selectedMilestone.pct]);
      showToast(`Đã nhận mốc quà ${selectedMilestone.pct}%`);
    }
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

  const renderTicketHelp = (): React.ReactNode => {
    if (!ticketHelpOpen) {
      return null;
    }

    return (
      <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-white/8 bg-[#121320] px-5 pb-8 pt-3 shadow-[0_-24px_60px_rgba(0,0,0,0.45)]">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/12" />
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-white">Tìm mã vé ở đâu?</div>
              <div className="mt-1 text-sm text-zinc-400">Hai tình huống nhận mã phổ biến.</div>
            </div>
            <button type="button" onClick={() => setTicketHelpOpen(false)} className="rounded-full bg-white/6 p-2 text-zinc-400">
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.1rem] border border-amber-300/18 bg-amber-300/6 p-4">
              <div className="mb-2 text-sm font-bold text-amber-200">1. Khách mua vé trực tiếp</div>
              <div className="text-sm leading-6 text-zinc-300">
                Mã vé được gửi qua email hoặc tin nhắn Zalo tại thời điểm thanh toán thành công.
              </div>
            </div>
            <div className="rounded-[1.1rem] border border-violet-300/18 bg-violet-300/6 p-4">
              <div className="mb-2 text-sm font-bold text-violet-200">2. Khách nhận vé từ đối tác</div>
              <div className="text-sm leading-6 text-zinc-300">
                Mã vé sẽ được chuyển qua nhãn hàng hoặc đối tác mời tham dự. Bạn có thể liên hệ trực tiếp đầu mối đã gửi thư mời.
              </div>
            </div>
            <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300">
              Vẫn chưa tìm thấy mã? Liên hệ hotline hoặc nhắn Zalo OA Beauty Summit Vietnam để được hỗ trợ.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPermissionModal = (): React.ReactNode => {
    if (!permissionStep) {
      return null;
    }

    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm">
        <div className="w-full max-w-[21rem] rounded-[1.5rem] bg-white px-4 py-7 text-center shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="mb-4 flex justify-center">
            <BrandMark size={36} />
          </div>
          <div className="whitespace-pre-line text-[1.45rem] font-black leading-tight text-[#111827]">
            {'Chào mừng bạn đến với\nBeauty Summit'}
          </div>
          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center text-lg text-[#0d7cff]">
                📱
              </div>
              <div className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#2f3137]">
                Tạo mã QR để check-in nhanh chóng
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center text-lg text-[#0d7cff]">
                🎁
              </div>
              <div className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#2f3137]">
                Làm nhiệm vụ tích điểm nhận voucher
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center text-lg text-[#0d7cff]">
                🪪
              </div>
              <div className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#2f3137]">
                Định danh khách hàng xuyên suốt sự kiện
              </div>
            </div>
          </div>
          <div className="mt-5 text-left text-[13px] leading-5 text-[#2f3137]">
            Vui lòng đồng ý chia sẻ số điện thoại để liên kết với tài khoản của bạn trên hệ thống
            Beauty Summit.
          </div>
          <div className="mt-7 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handlePermissionApproved}
              disabled={miniAppLoading}
              className={`relative w-full rounded-full bg-[#0d7cff] px-4 py-4 text-base font-bold !text-white shadow-[0_12px_30px_rgba(13,124,255,0.25)] disabled:cursor-wait disabled:opacity-70 ${
                miniAppLoading ? 'text-transparent' : ''
              }`}
            >
              Liên kết số điện thoại
            </button>
            <button
              type="button"
              onClick={handlePermissionDenied}
              disabled={miniAppLoading}
              className="px-4 py-1 text-base font-bold text-[#ef4444] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Từ chối và Thoát
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderOaWidgetModal = (): React.ReactNode => {
    if (!oaPromptOpen) {
      return null;
    }

    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm">
        <div className="w-full max-w-[24rem] overflow-hidden rounded-[1.4rem] bg-white text-center shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
          <div className="bg-white px-5 py-4">
            <div id={OA_WIDGET_ID} className="min-h-[82px] w-full" />
          </div>
          <div className="px-5 pb-4 pt-2 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 shrink-0 text-center text-lg">🔔</span>
                <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-[#374151]">
                  Nhận thông báo check-in & nhiệm vụ realtime
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 shrink-0 text-center text-lg">🎁</span>
                <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-[#374151]">
                  Voucher & ưu đãi gửi trực tiếp qua Zalo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 shrink-0 text-center text-lg">🗓️</span>
                <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-[#374151]">
                  Cập nhật lịch trình & thay đổi sự kiện
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 shrink-0 text-center text-lg">📸</span>
                <span className="whitespace-nowrap text-[13px] font-semibold leading-5 text-[#374151]">
                  Thông báo phần thưởng & hình ảnh sự kiện
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={openPermissionNotice}
            className="w-full border-t border-[#eef0f4] bg-white px-4 py-4 text-[15px] font-bold text-[#ef4444]"
          >
            Để sau
          </button>
        </div>
      </div>
    );
  };

  const renderRewardScreen = (): React.ReactNode => (
    <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="beauty-float mb-5 rounded-full border border-amber-300/25 bg-amber-300/10 p-5">
        <TrophyIcon size={52} color="#ffd970" />
      </div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
        100% nhiệm vụ hoàn thành
      </div>
      <h2 className="bg-[linear-gradient(135deg,#fff,#ffd970,#f59e0b)] bg-clip-text font-serif text-4xl font-black leading-tight text-transparent">
        Chúc mừng
      </h2>
      <p className="mt-4 max-w-[18rem] text-sm leading-7 text-zinc-300">
        Bạn đã đủ điều kiện tham gia bốc thăm grand prize VinFast VF3 và mở khóa toàn bộ quyền lợi Beauty Summit 2026.
      </p>
      <div className="mt-8 w-full rounded-[1.4rem] border border-pink-400/20 bg-[linear-gradient(145deg,rgba(236,72,153,0.16),rgba(245,158,11,0.08))] p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Mã tham gia</div>
        <div className="mt-3 text-xl font-black tracking-[0.3em] text-emerald-200">
          VF3-{tier[0]}-{orderCode.slice(-4) || '0000'}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setScreen('main')}
        className="mt-8 rounded-[1.15rem] bg-white/8 px-5 py-3 text-sm font-semibold text-white"
      >
        Quay lại dashboard
      </button>
    </div>
  );

  let userName = 'Minh Hoàng';
  userName = zaloProfile.name || userName;
  const userAvatar = zaloProfile.avatar || DEFAULT_ZALO_PROFILE.avatar;
  const userPhone = displayPhone;
  const userRole: BeautyUserRole = 'guest';
  const qrMarkup = generateQrMarkup(qrValue || `BS26-${tier}-${orderCode || 'DEMO'}`);

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
          orderCode={orderCode}
          qrGenerated={qrGenerated}
          availablePoints={availablePoints}
          totalPoints={totalPoints}
          userName={userName}
          userAvatar={userAvatar}
          userPhone={userPhone}
          qrMarkup={qrMarkup}
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
          activeTab={activeTab}
          activePhase={activePhase}
          voucherTab={voucherTab}
          proofValue={expandedMission ? proofInputs[expandedMission.id] ?? '' : ''}
          progress={progress}
          totalPoints={totalPoints}
          spentPoints={spentPoints}
          availablePoints={availablePoints}
          qrGenerated={qrGenerated}
          userName={userName}
          userAvatar={userAvatar}
          userPhone={userPhone}
          userRole={userRole}
          orderCode={orderCode}
          qrMarkup={qrMarkup}
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
          onOpenPolicy={() => setPolicyOpen(true)}
          onClosePolicy={() => setPolicyOpen(false)}
          onOpenScanner={() => setScannerOpen(true)}
          onCloseScanner={() => setScannerOpen(false)}
          onRunScanner={handleRunScanner}
        />
      ) : null}

      {screen === 'reward' ? renderRewardScreen() : null}

      {renderTicketHelp()}
      {renderOaWidgetModal()}
      {renderPermissionModal()}

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

