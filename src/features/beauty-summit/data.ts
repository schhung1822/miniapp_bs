import type {
  CheckinZone,
  Milestone,
  Mission,
  MissionSet,
  OnboardingSlide,
  PolicySection,
  TierKey,
  TierMeta,
  VoteCategory,
} from '@/features/beauty-summit/types';

export const TIERS: Record<TierKey, TierMeta> = {
  STANDARD: {
    key: 'STANDARD',
    name: 'Standard',
    color: '#8B7355',
    gradient: 'linear-gradient(135deg, #8B7355, #C4A882)',
    icon: '✦',
  },
  PREMIUM: {
    key: 'PREMIUM',
    name: 'Premium',
    color: '#B8860B',
    gradient: 'linear-gradient(135deg, #B8860B, #FFD700)',
    icon: '✧',
  },
  VIP: {
    key: 'VIP',
    name: 'VIP',
    color: '#C41E7F',
    gradient: 'linear-gradient(135deg, #C41E7F, #FF6FB5)',
    icon: '♛',
  },
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'qr',
    badge: 'Bước 1/3',
    title: 'Tạo mã QR check-in',
    desc: 'Nhập mã vé để lấy QR cá nhân, dùng xuyên suốt hai ngày sự kiện tại Beauty Summit 2026.',
    accent: '#FFD700',
  },
  {
    id: 'mission',
    badge: 'Bước 2/3',
    title: 'Làm nhiệm vụ, tích BPoint',
    desc: 'Hoàn thành các thử thách trước sự kiện và tại booth để tích điểm, mở khóa quà và ưu đãi.',
    accent: '#FF6FB5',
  },
  {
    id: 'reward',
    badge: 'Bước 3/3',
    title: 'Đổi voucher và săn grand prize',
    desc: 'Dùng BPoint đổi voucher ngay trong app. Hoàn thành toàn bộ nhiệm vụ để đủ điều kiện bốc thăm giải lớn.',
    accent: '#5BC8D8',
  },
];


export const VOTE_CATEGORIES: VoteCategory[] = [
  {
    id: 'vc1',
    title: 'Sản phẩm yêu thích nhất',
    desc: 'Vote cho sản phẩm làm đẹp bạn yêu thích nhất năm 2026.',
    color: '#0EA5E9',
    brands: [
      { id: 'vc1-01', name: 'Sulwhasoo First Care Serum' },
      { id: 'vc1-02', name: 'SK-II Facial Treatment Essence' },
      { id: 'vc1-03', name: 'La Roche-Posay Anthelios' },
      { id: 'vc1-04', name: 'Estée Lauder Advanced Night Repair' },
      { id: 'vc1-05', name: 'Lancôme Génifique Serum' },
      { id: 'vc1-06', name: 'Paula’s Choice 2% BHA' },
      { id: 'vc1-07', name: 'Laneige Water Sleeping Mask' },
      { id: 'vc1-08', name: 'Rare Beauty Soft Pinch Blush' },
    ],
  },
  {
    id: 'vc2',
    title: 'Thương hiệu yêu thích nhất',
    desc: 'Thương hiệu nào chiếm trọn trái tim bạn?',
    color: '#E11D48',
    brands: [
      { id: 'vc2-01', name: 'Sulwhasoo' },
      { id: 'vc2-02', name: 'SK-II' },
      { id: 'vc2-03', name: 'La Roche-Posay' },
      { id: 'vc2-04', name: 'MAC Cosmetics' },
      { id: 'vc2-05', name: 'Charlotte Tilbury' },
      { id: 'vc2-06', name: 'Dior Beauty' },
      { id: 'vc2-07', name: 'Rare Beauty' },
      { id: 'vc2-08', name: 'innisfree' },
    ],
  },
  {
    id: 'vc3',
    title: 'Máy mỹ phẩm yêu thích nhất',
    desc: 'Thiết bị làm đẹp nào bạn muốn sở hữu nhất?',
    color: '#8B5CF6',
    brands: [
      { id: 'vc3-01', name: 'Dyson Airwrap' },
      { id: 'vc3-02', name: 'Dyson Supersonic' },
      { id: 'vc3-03', name: 'Foreo Luna 4' },
      { id: 'vc3-04', name: 'NuFace Trinity+' },
      { id: 'vc3-05', name: 'ZIIP Halo' },
      { id: 'vc3-06', name: 'CurrentBody LED Mask' },
      { id: 'vc3-07', name: 'Therabody TheraFace' },
      { id: 'vc3-08', name: 'Ulike Sapphire Air3' },
    ],
  },
  {
    id: 'vc4',
    title: 'Công nghệ làm đẹp yêu thích',
    desc: 'Xu hướng công nghệ nào bạn quan tâm nhất?',
    color: '#F59E0B',
    brands: [
      { id: 'vc4-01', name: 'AI Skin Analysis' },
      { id: 'vc4-02', name: 'Virtual Try-On AR' },
      { id: 'vc4-03', name: 'Personalized Skincare AI' },
      { id: 'vc4-04', name: 'LED Light Therapy' },
      { id: 'vc4-05', name: 'RF (Radio Frequency)' },
      { id: 'vc4-06', name: 'DNA-Based Skincare' },
      { id: 'vc4-07', name: 'Microbiome Analysis' },
      { id: 'vc4-08', name: 'Waterless Beauty' },
    ],
  },
];

export const CHECKIN_ZONES: CheckinZone[] = [
  {
    id: 'gate',
    name: 'Cổng vào sự kiện',
    location: 'VEC Hà Nội - cổng chính',
    color: '#C41E7F',
    tiers: ['STANDARD', 'PREMIUM', 'VIP'],
    desc: 'Check-in xác nhận tham dự tại cổng.',
  },
  {
    id: 'coach',
    name: 'Phòng Coach 1:1',
    location: 'Tầng 2 - phòng V2',
    color: '#8B5CF6',
    tiers: ['PREMIUM', 'VIP'],
    desc: 'Khu vực tư vấn riêng cùng chuyên gia.',
  },
  {
    id: 'seminar',
    name: 'Phòng hội thảo',
    location: 'Hội trường A - tầng 1',
    color: '#0EA5E9',
    tiers: ['VIP'],
    desc: 'Panel và masterclass dành cho khách VIP.',
  },
];

export const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'general',
    title: 'Quy định chung',
    tone: 'pink',
    items: [
      'Mini App áp dụng cho khách tham dự Beauty Summit 2026 tại VEC Hà Nội.',
      'Mỗi số điện thoại chỉ được đăng ký một tài khoản duy nhất.',
      'Hạng vé được xác định theo vé mua và không thay đổi sau khi kích hoạt.',
    ],
  },
  {
    id: 'missions',
    title: 'Quy định nhiệm vụ',
    tone: 'gold',
    items: [
      'Nhiệm vụ chia làm 3 giai đoạn: trước sự kiện, ngày 1 và ngày 2.',
      'Bằng chứng nhiệm vụ được duyệt thủ công hoặc tự động theo loại nhiệm vụ.',
      'Bài đăng mạng xã hội phải ở chế độ công khai và đúng hashtag yêu cầu.',
    ],
  },
  {
    id: 'voucher',
    title: 'Quy định voucher & BPoint',
    tone: 'green',
    items: [
      'BPoint tích lũy khi hoàn thành nhiệm vụ và dùng để đổi voucher.',
      'Voucher đã đổi không hoàn lại và không quy đổi thành tiền mặt.',
      'Grand prize yêu cầu hoàn thành 100% nhiệm vụ.',
    ],
  },
  {
    id: 'privacy',
    title: 'Quyền riêng tư & dữ liệu',
    tone: 'blue',
    items: [
      'Số điện thoại dùng để định danh tài khoản, check-in và gửi thông báo.',
      'Thông tin cá nhân không chia sẻ ngoài phạm vi đã cam kết với đối tác.',
      'Bạn có thể yêu cầu xóa dữ liệu sau sự kiện qua kênh hỗ trợ.',
    ],
  },
  {
    id: 'violation',
    title: 'Xử lý vi phạm',
    tone: 'red',
    items: [
      'Gian lận nhiệm vụ có thể bị hủy toàn bộ BPoint và voucher.',
      'Dùng nhiều tài khoản cho cùng một người sẽ bị khóa toàn bộ tài khoản liên quan.',
      'Quyết định cuối cùng thuộc về Ban tổ chức.',
    ],
  },
];

export const MILESTONES: Milestone[] = [
  {
    pct: 30,
    title: 'Bộ sample cao cấp',
    brand: 'Sulwhasoo × La Roche-Posay',
    desc: 'Mở khóa quà sample tại quầy Gift Station khi đạt 30% nhiệm vụ.',
    color: '#B8860B',
  },
  {
    pct: 50,
    title: 'Vòng quay may mắn',
    brand: 'Beauty Summit Lucky Spin',
    desc: 'Mở khóa một lượt quay nhận quà khi đạt 50% tiến độ.',
    color: '#C41E7F',
  },
  {
    pct: 100,
    title: 'Grand Prize VinFast VF3',
    brand: 'Beauty Summit 2026',
    desc: 'Hoàn thành toàn bộ nhiệm vụ để đủ điều kiện bốc thăm xe VinFast VF3.',
    color: '#FFD700',
  },
];

const createBaseMissions = (tier: TierKey): MissionSet => {
  const shared: MissionSet = {
    before: [
      {
        id: `${tier}-b1`,
        title: 'Tạo mã QR check-in',
        desc: 'Nhập mã vé để tạo QR cá nhân dùng cho toàn bộ sự kiện.',
        points: 10,
        phase: 'before',
        steps: [
          'Mở tab QR trong app.',
          'Nhập mã đơn hàng từ email hoặc Zalo xác nhận vé.',
          'Xác nhận quyền truy cập thông tin để tạo QR.',
        ],
        proofType: null,
        auto: true,
      },
      {
        id: `${tier}-b2`,
        title: 'Follow fanpage Beauty Summit',
        desc: 'Like và Follow fanpage chính thức trên Facebook.',
        points: 10,
        phase: 'before',
        steps: [
          'Truy cập fanpage Beauty Summit Vietnam trên Facebook.',
          'Like và Follow fanpage.',
          'Hệ thống sẽ ghi nhận sau khi bạn mở fanpage từ app.',
        ],
        proofType: 'link',
        proofLabel: 'Mở fanpage Beauty Summit Vietnam',
        actionLabel: 'Mở fanpage',
        actionUrl: 'https://www.facebook.com/BeautySummitVietnam',
        autoCompleteOnAction: true,
      },
      {
        id: `${tier}-b3`,
        title: 'Đăng bài chia sẻ sự kiện',
        desc: 'Đăng bài công khai kèm hashtag chính thức của sự kiện.',
        points: 15,
        phase: 'before',
        steps: [
          'Đăng một bài viết ở chế độ công khai trên Facebook.',
          'Nội dung chia sẻ về Beauty Summit 2026.',
          'Bắt buộc có hashtag #BeautySummit2026 #BeautyVerse.',
          'Dán link bài viết vào app để gửi duyệt.',
        ],
        proofType: 'link',
        proofLabel: 'Dán link bài Facebook của bạn',
        proofPlaceholder: 'https://facebook.com/...',
      },
    ],
    day1: [
      {
        id: `${tier}-d1-1`,
        title: 'Check-in cổng sự kiện ngày 1',
        desc: 'Đưa mã QR cho nhân viên quét tại cổng chính ngày đầu tiên.',
        points: 15,
        phase: 'day1',
        steps: [
          'Đến VEC Hà Nội vào ngày 1 của sự kiện.',
          'Mở QR cá nhân trong app.',
          'Đưa QR cho staff quét tại cổng check-in.',
        ],
        proofType: 'scan',
        proofLabel: 'Quét bởi nhân viên tại cổng',
        checkin: true,
      },
      {
        id: `${tier}-d1-2`,
        title: 'Tham quan gian hàng',
        desc: 'Quét QR tại nhiều booth để mở khóa điểm tích lũy.',
        points: 15,
        phase: 'day1',
        steps: [
          'Di chuyển qua khu booth nhãn hàng.',
          tier === 'VIP'
            ? 'Quét QR tại ít nhất 7 gian hàng.'
            : tier === 'PREMIUM'
              ? 'Quét QR tại ít nhất 5 gian hàng.'
              : 'Quét QR tại ít nhất 3 gian hàng.',
          'Tiến độ được cập nhật khi staff ghi nhận đủ số lượt.',
        ],
        proofType: 'scan',
        proofLabel: 'Check-in booth nhãn hàng',
      },
      {
        id: `${tier}-d1-3`,
        title: 'Check-in photo booth',
        desc: 'Chụp ảnh tại photo booth và đăng story.',
        points: 10,
        phase: 'day1',
        steps: [
          'Đến khu vực photo booth chính của sự kiện.',
          'Chụp ảnh với backdrop Beauty Summit 2026.',
          'Đăng story và tag @beautysummitvn.',
          'Tải ảnh màn hình story vào app.',
        ],
        proofType: 'image',
        proofLabel: 'Tải ảnh chụp story',
      },
      {
        id: `${tier}-d1-vote`,
        title: 'Vote nhãn hàng yêu thích',
        desc: 'Bình chọn ít nhất 2 hạng mục trong tab Vote.',
        points: 15,
        phase: 'day1',
        steps: [
          'Chuyển sang tab Vote ở thanh điều hướng nội bộ.',
          'Chọn thương hiệu hoặc sản phẩm yêu thích.',
          'Hoàn thành ít nhất 2 hạng mục để mở khóa nhiệm vụ.',
        ],
        proofType: 'vote',
        proofLabel: 'Mở tab Vote',
      },
    ],
    day2: [
      {
        id: `${tier}-d2-1`,
        title: 'Check-in cổng sự kiện ngày 2',
        desc: 'Check-in lại ở cổng trong ngày thứ hai.',
        points: 15,
        phase: 'day2',
        steps: [
          'Trở lại cổng chính vào ngày 2.',
          'Mở QR trong app và đưa staff quét.',
          'Hệ thống tự ghi nhận khi check-in thành công.',
        ],
        proofType: 'scan',
        proofLabel: 'Quét bởi nhân viên tại cổng',
        checkin: true,
      },
      {
        id: `${tier}-d2-2`,
        title: 'Đánh giá sự kiện',
        desc: 'Hoàn thành khảo sát nhanh về trải nghiệm tại Beauty Summit 2026.',
        points: 10,
        phase: 'day2',
        steps: [
          'Bấm nút mở form khảo sát.',
          'Trả lời ngắn gọn về trải nghiệm của bạn.',
          'Gửi biểu mẫu để được ghi nhận tự động.',
        ],
        proofType: 'survey',
        proofLabel: 'Mở khảo sát',
      },
    ],
  };

  if (tier === 'PREMIUM' || tier === 'VIP') {
    shared.before.push({
      id: `${tier}-b4`,
      title: 'Mời bạn bè tham gia',
      desc:
        tier === 'VIP'
          ? 'Mời 3 bạn bè đăng ký sự kiện bằng link giới thiệu.'
          : 'Mời 2 bạn bè đăng ký sự kiện bằng link giới thiệu.',
      points: 10,
      phase: 'before',
      steps: [
        'Sao chép link giới thiệu từ app.',
        'Gửi link qua Zalo hoặc Messenger.',
        'Khi đủ số lượt đăng ký, nhiệm vụ sẽ được ghi nhận.',
      ],
      proofType: 'referral',
      proofLabel: 'Sao chép link giới thiệu',
    });

    shared.day1.push({
      id: `${tier}-d1-4`,
      title: 'Tham gia workshop',
      desc:
        tier === 'VIP'
          ? 'Check-in một masterclass dành cho khách VIP.'
          : 'Check-in một workshop trong khuôn khổ sự kiện.',
      points: 10,
      phase: 'day1',
      steps: [
        'Xem lịch workshop trong app.',
        'Đến đúng khung giờ và quét QR tại phòng.',
        'Ở lại đến cuối để được ghi nhận.',
      ],
      proofType: 'scan',
      proofLabel: 'Quét QR tại phòng workshop',
    });

    shared.day2.push({
      id: `${tier}-d2-3`,
      title: 'Tham gia mini game',
      desc:
        tier === 'VIP'
          ? 'Hoàn thành 2 mini game tại khu trải nghiệm.'
          : 'Hoàn thành 1 mini game tại khu trải nghiệm.',
      points: 10,
      phase: 'day2',
      steps: [
        'Đến khu mini game tại sảnh chính.',
        'Nhận mã xác nhận từ staff sau khi hoàn thành.',
        'Nhập mã vào app để ghi nhận điểm.',
      ],
      proofType: 'code',
      proofLabel: 'Nhập mã mini game',
      proofPlaceholder: 'VD: MG-2026-XXXX',
    });
  }

  if (tier === 'VIP') {
    shared.before.push({
      id: `${tier}-b5`,
      title: 'Quiz BeautyVerse',
      desc: 'Trả lời 5 câu hỏi nhanh về làm đẹp và công nghệ.',
      points: 10,
      phase: 'before',
      steps: [
        'Mở bài quiz trong app.',
        'Trả lời ít nhất 3/5 câu hỏi đúng.',
        'Gửi kết quả để hoàn thành nhiệm vụ.',
      ],
      proofType: 'quiz',
      proofLabel: 'Bắt đầu quiz',
    });

    shared.day1.push({
      id: `${tier}-d1-5`,
      title: 'Networking VIP session',
      desc: 'Tham gia phiên networking dành riêng cho khách VIP.',
      points: 10,
      phase: 'day1',
      steps: [
        'Đến VIP lounge đúng giờ.',
        'Quét QR xác nhận tham dự tại quầy lễ tân.',
        'Ở lại trọn phiên để được ghi nhận.',
      ],
      proofType: 'scan',
      proofLabel: 'Quét bởi nhân viên VIP lounge',
    });
  }

  return shared;
};

export const buildMissions = (tier: TierKey): MissionSet => createBaseMissions(tier);
