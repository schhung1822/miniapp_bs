import React from 'react';
import { Gift, ListChecks, Target, Tickets } from 'lucide-react';

import beautySummitLogo from '@/assets/logo.png';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

interface GradientIconProps extends IconProps {
  gradientFrom?: string;
  gradientTo?: string;
}

export const BrandMark: React.FC<{ size?: number; className?: string }> = ({
  size = 34,
  className,
}) => (
  <img
    src={beautySummitLogo}
    alt="Beauty Summit"
    className={className}
    style={{
      height: size,
      width: 'auto',
      maxWidth: size * 4.2,
      objectFit: 'contain',
    }}
  />
);

export const MissionIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <span
    className={className}
    style={{
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size,
      flexShrink: 0,
    }}
  >
    <ListChecks
      size={size}
      color={color}
      strokeWidth={2}
      style={{
        position: 'absolute',
        inset: 0,
      }}
    />
    <Target
      size={Math.max(10, Math.round(size * 0.56))}
      color={color}
      strokeWidth={2}
      style={{
        position: 'absolute',
        right: size * -0.02,
        bottom: size * -0.04,
        filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.08))',
      }}
    />
  </span>
);

export const StarIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.4l2.86 5.79 6.39.93-4.62 4.5 1.09 6.38L12 16.99 6.28 20l1.09-6.38-4.62-4.5 6.39-.93L12 2.4Z" />
  </svg>
);

export const VoucherIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <span
    className={className}
    style={{
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size,
      flexShrink: 0,
    }}
  >
    <Tickets
      size={size}
      color={color}
      strokeWidth={1.9}
      style={{
        position: 'absolute',
        inset: 0,
      }}
    />
    <Gift
      size={Math.max(8, Math.round(size * 0.42))}
      color={color}
      strokeWidth={2}
      style={{
        position: 'absolute',
        left: size * 0.24,
        top: size * 0.44,
        transform: 'translate(25%, -10%)',
      }}
    />
  </span>
);

export const VoteIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg
  className={className}
  width={size}
  height={size}
  viewBox="0 0 256 256"
  fill="none"
  stroke={color}
  strokeWidth="8" 
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M190.878,111.272c31.017-11.186,53.254-40.907,53.254-75.733l-0.19-8.509h-48.955V5H64.222v22.03H15.266l-0.19,8.509
	c0,34.825,22.237,64.546,53.254,75.733c7.306,18.421,22.798,31.822,41.878,37.728v20c-0.859,15.668-14.112,29-30,29v18h-16v35H195
	v-35h-16v-18c-15.888,0-29.141-13.332-30-29v-20C168.08,143.094,183.572,129.692,190.878,111.272z M195,44h30.563
	c-0.06,0.427-0.103,1.017-0.171,1.441c-3.02,18.856-14.543,34.681-30.406,44.007C195.026,88.509,195,44,195,44z M33.816,45.441
	c-0.068-0.424-0.111-1.014-0.171-1.441h30.563c0,0-0.026,44.509,0.013,45.448C48.359,80.122,36.837,64.297,33.816,45.441z
	 M129.604,86.777l-20.255,13.52l6.599-23.442L96.831,61.77l24.334-0.967l8.44-22.844l8.44,22.844l24.334,0.967L143.26,76.856
	l6.599,23.442L129.604,86.777z"/>
  
  <line x1="100" y1="125" x2="156" y2="125" strokeWidth="8" />
  <line x1="110" y1="140" x2="146" y2="140" strokeWidth="8" />
</svg>
);

export const ThumbsUpIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

export const PolicyIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 16, color = '#778', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7.5" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const QrIcon: React.FC<GradientIconProps> = ({
  size = 18,
  color = '#fff',
  className,
  gradientFrom,
  gradientTo,
}) => {
  const gradientId = React.useId().replace(/:/g, '');
  const strokeColor =
    gradientFrom && gradientTo ? `url(#${gradientId})` : color;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
    >
      {gradientFrom && gradientTo ? (
        <defs>
          <linearGradient
            id={gradientId}
            x1="3"
            y1="3"
            x2="21"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={gradientFrom} />
            <stop offset="1" stopColor={gradientTo} />
          </linearGradient>
        </defs>
      ) : null}
      <path d="M3 7V3h4" />
      <path d="M17 3h4v4" />
      <path d="M21 17v4h-4" />
      <path d="M7 21H3v-4" />
      <path d="M3 12h18" strokeDasharray="3 2" />
    </svg>
  );
};

export const CopyIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ size = 18, color = '#fff', className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v11" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 20h16" />
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
