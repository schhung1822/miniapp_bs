import React from 'react';

import { QRCodeCanvas } from 'qrcode.react';

import beautySummitIcon from '@/assets/icon.png';

interface BeautyQrCodeProps {
  value: string;
  size: number;
  wrapperClassName?: string;
  canvasClassName?: string;
  logoSize?: number;
  logoRingClassName?: string;
}

const BeautyQrCode = React.forwardRef<HTMLDivElement, BeautyQrCodeProps>(
  (
    {
      value,
      size,
      wrapperClassName = '',
      canvasClassName = '',
      logoSize = 18,
      logoRingClassName = '',
    },
    ref,
  ) => {
    const ringSize = logoSize + 16;

    return (
      <div ref={ref} className={`relative inline-flex items-center justify-center ${wrapperClassName}`.trim()}>
        <QRCodeCanvas
          value={value}
          size={size}
          level="H"
          marginSize={2}
          bgColor="#ffffff"
          fgColor="#111111"
          className={canvasClassName}
        />
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white bg-[#f8dfe9] ${logoRingClassName}`.trim()}
          style={{ width: ringSize, height: ringSize }}
        >
          <img
            src={beautySummitIcon}
            alt=""
            className="rounded-full object-cover"
            style={{ width: logoSize, height: logoSize }}
          />
        </div>
      </div>
    );
  },
);

BeautyQrCode.displayName = 'BeautyQrCode';

export default BeautyQrCode;
