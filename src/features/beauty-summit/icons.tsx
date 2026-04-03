import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const BrandMark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <div
    className="flex items-center justify-center rounded-xl text-white font-extrabold tracking-[0.18em]"
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #ec4899, #f59e0b)',
      boxShadow: '0 10px 22px rgba(236,72,153,0.28)',
      fontSize: size * 0.32,
    }}
  >
    BS
  </div>
);

export const MissionIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.4l2.86 5.79 6.39.93-4.62 4.5 1.09 6.38L12 16.99 6.28 20l1.09-6.38-4.62-4.5 6.39-.93L12 2.4Z" />
  </svg>
);

export const VoucherIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M2.5 10h19" />
    <path d="M12 6v12" strokeDasharray="2 2" />
  </svg>
);

export const VoteIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M14 9V5a3 3 0 0 0-6 0v4" />
    <rect x="2.5" y="9" width="19" height="12" rx="2" />
    <path d="M8 15l2.5 2.5L16 12" />
  </svg>
);

export const PolicyIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 16, color = '#778', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7.5" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const QrIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M3 7V3h4" />
    <path d="M17 3h4v4" />
    <path d="M21 17v4h-4" />
    <path d="M7 21H3v-4" />
    <path d="M3 12h18" strokeDasharray="3 2" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M3 8.5h4l1.8-2.5h6.4L17 8.5h4a1.5 1.5 0 0 1 1.5 1.5V19a2 2 0 0 1-2 2H3.5a2 2 0 0 1-2-2v-9a1.5 1.5 0 0 1 1.5-1.5Z" />
    <circle cx="12" cy="14" r="4" />
  </svg>
);

export const LinkIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 1 0-7.07-7.07L11.5 5.4" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-2.92 2.92a5 5 0 1 0 7.07 7.07L12.5 18.6" />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 18, color = '#ffd700', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4" />
    <path d="M17 5h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" />
    <path d="M12 14v5" />
    <path d="M8.5 21h7" />
  </svg>
);

export const GiftIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9.5h16v10.5H4z" />
    <path d="M12 9.5V20" />
    <path d="M4 13h16" />
    <path d="M12 9.5H8.6A2.6 2.6 0 1 1 11 5.2L12 6.5l1-1.3a2.6 2.6 0 1 1 2.4 4.3H12Z" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 16, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4.5" width="18" height="17" rx="2" />
    <path d="M8 2.5v4" />
    <path d="M16 2.5v4" />
    <path d="M3 10h18" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 16, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 16, color = '#888', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, color = '#666', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);
