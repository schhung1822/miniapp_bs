import React from 'react';

import { apiConfig } from '@/lib/api-client';

interface VoucherLogoBadgeProps {
  logo: string;
  brand: string;
  color: string;
  className?: string;
  grandPrize?: boolean;
}

const IMAGE_SOURCE_PATTERN = /^(data:image\/|https?:\/\/|\/?(avatars|images|public)\/)/i;
const IMAGE_FILE_PATTERN = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i;

const buildFallbackLabel = (logo: string, brand: string): string => {
  const normalizedLogo = logo.trim();
  if (normalizedLogo && !IMAGE_SOURCE_PATTERN.test(normalizedLogo) && !IMAGE_FILE_PATTERN.test(normalizedLogo)) {
    return normalizedLogo.slice(0, 3).toUpperCase();
  }

  return brand
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

const isImageLogo = (logo: string): boolean => {
  const normalizedLogo = logo.trim();
  return IMAGE_SOURCE_PATTERN.test(normalizedLogo) || IMAGE_FILE_PATTERN.test(normalizedLogo);
};

const getAbsoluteImageUrl = (logo: string): string => {
  const normalizedLogo = logo.trim();
  if (!normalizedLogo) {
    return normalizedLogo;
  }

  if (/^(https?:\/\/|data:image\/)/i.test(normalizedLogo)) {
    return normalizedLogo;
  }

  const path = normalizedLogo.startsWith('/') ? normalizedLogo : `/${normalizedLogo}`;
  return `${apiConfig.baseURL}${path}`;
};

const VoucherLogoBadge: React.FC<VoucherLogoBadgeProps> = ({
  logo,
  brand,
  color,
  className = '',
  grandPrize = false,
}) => {
  const normalizedLogo = logo.trim();
  const imageUrl = getAbsoluteImageUrl(normalizedLogo);

  if (isImageLogo(normalizedLogo)) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[1rem] ${className}`.trim()}
        style={{
          background: grandPrize
            ? `linear-gradient(135deg, ${color}22, ${color}14)`
            : '#ffffff',
          border: grandPrize ? `1px solid ${color}` : undefined,
          boxShadow: grandPrize ? '0 8px 18px rgba(236, 72, 153, 0.12)' : undefined,
        }}
      >
        <img
          src={imageUrl}
          alt={brand}
          className={`h-full w-full object-contain ${grandPrize ? 'p-1.5' : 'p-1.5'}`}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-[1rem] text-sm font-black !text-white ${className}`.trim()}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        border: grandPrize ? `1px solid ${color}` : undefined,
        boxShadow: grandPrize ? '0 8px 18px rgba(236, 72, 153, 0.12)' : undefined,
      }}
    >
      {buildFallbackLabel(normalizedLogo, brand)}
    </div>
  );
};

export default VoucherLogoBadge;
