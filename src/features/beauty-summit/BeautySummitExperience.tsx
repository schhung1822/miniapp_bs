import React from 'react';

import {
  configAppView,
  getAccessToken,
  getPhoneNumber,
  getUserID,
  getUserInfo,
  scanQRCode,
} from 'zmp-sdk';

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
  Mission,
  MissionPhase,
  TierKey,
  Voucher,
  VoteBrand,
  VoteCategory,
} from '@/features/beauty-summit/types';
import { generateQrMarkup } from '@/features/beauty-summit/utils';

interface BeautySummitExperienceProps {
  onHeaderChange: (config: HeaderProps) => void;
}

const DEFAULT_ZALO_PROFILE = {
  name: 'User Name',
  avatar: 'https://h5.zdn.vn/static/images/avatar.png',
} as const;

const DEFAULT_PHONE_DISPLAY = '0912 345 678';

interface ZaloPhoneResponse {
  data?: {
    number?: string;
  };
  error?: number;
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

const BeautySummitExperience: React.FC<BeautySummitExperienceProps> = ({ onHeaderChange }) => {
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

  const toastTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    configAppView({
      headerColor: '#ffffff',
      headerTextColor: 'black',
      actionBar: { hide: true },
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    return () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

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

  const handleGenerateQr = (): void => {
    if (!orderCode.trim()) {
      return;
    }

    if (permissionsGranted) {
      finalizeQr();
      return;
    }

    setPermissionIntent('generate-qr');
    setPermissionStep('profile');
  };

  const finalizeQr = (): void => {
    setPermissionStep(null);
    setQrGenerated(true);
    markMissionComplete(`${tier}-b1`, 'QR đã được tạo thành công');
    showToast('App đã sẵn sàng để check-in');
  };
  const handlePermissionDenied = async () => {
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

    setPermissionStep(null);
    setPermissionIntent(null);
    if (intent == 'generate-qr') {
      setPermissionsGranted(true);
      finalizeQr();
      return;
    } 

    try {
      const { userInfo } = await getUserInfo({
        autoRequestPermission: true,
      });
      const userID = await getUserID({});
      const phoneAuth = await getPhoneNumber({});
      const accessToken = await getAccessToken({}); 
      console.log('userId theo App:' + userID);
      console.log('code:' + phoneAuth.token);
      console.log('accessToken:' + accessToken);
      console.log(userInfo);
      setZaloProfile({
        name: userInfo.name || DEFAULT_ZALO_PROFILE.name,
        avatar: userInfo.avatar || DEFAULT_ZALO_PROFILE.avatar,
      });
      try {
        const phoneNumber = await fetchZaloPhoneNumber(accessToken, phoneAuth.token);
        if (phoneNumber) {
          setDisplayPhone(formatPhoneDisplay(phoneNumber));
        }
      } catch (phoneError) {
        console.log(phoneError);
      }
      //check số điện thoại tại đây
      

      setPermissionsGranted(true);

      
    } catch (error: any) {
      if (error.code == -1401 || error.code == -201) {
          // console.log(error);
          // Người dùng từ chối quay về trang giới thiệu
          setPermissionsGranted(false);
          setAgreed(false);
          setSlideIndex(0);
          setScreen('onboarding');
          return;
        }

    }

    setScreen('main');
    showToast('Đã kích hoạt app thành công');
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
      <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-white/8 bg-[#121320] px-5 pb-8 pt-3 shadow-[0_-24px_60px_rgba(0,0,0,0.45)]">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/12" />
          <div className="mb-5 text-center">
            <div className="mb-4 flex justify-center">
              <BrandMark size={56} />
            </div>
            <div className="text-lg font-bold text-white">Cho phép nhận thông tin từ Zalo</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">
              App sẽ lấy tên và số điện thoại của bạn để hiển thị thẻ check-in trong app.
            </div>
          </div>
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">Tên Zalo</div>
                <div className="text-xs text-zinc-500">Hiển thị trên thẻ check-in</div>
              </div>
              <div className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300">
                Đang bật
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">Số điện thoại Zalo</div>
                <div className="text-xs text-zinc-500">Dùng để xác nhận check-in</div>
              </div>
              <div className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300">
                Đang bật
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handlePermissionDenied}
              className="rounded-2xl bg-white/8 px-4 py-3 text-sm font-semibold text-zinc-300"
            >
              Từ chối
            </button>
            <button
              type="button"
              onClick={handlePermissionApproved}
              className="rounded-2xl bg-[linear-gradient(135deg,#0ea5e9,#38bdf8)] px-4 py-3 text-sm font-semibold text-white"
            >
              {permissionIntent === 'activate' ? 'Về dashboard' : 'Cho phép'}
            </button>
          </div>
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
  const qrMarkup = generateQrMarkup(`BS26-${tier}-${orderCode || 'DEMO'}`);

  return (
    <BeautyShell toast={toast}>
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
          onContinue={() => {
            if (!agreed) {
              return;
            }
            setPermissionIntent('activate');
            setPermissionStep('profile');
          }}
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
          onOrderCodeChange={setOrderCode}
          onGenerate={handleGenerateQr}
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
