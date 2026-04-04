import React from 'react';
import { Icon } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';

import { BrandMark } from '@/features/beauty-summit/icons';

export type HeaderProps =
  | { variant: 'logo' }
  | { variant: 'back'; title?: string; onBack?: () => void };

const Header: React.FC<HeaderProps> = (props) => {
  const navigate = useNavigate();

  return (
    <div className="z-10 bg-white">
      {props.variant === 'logo' ? (
        <div className="flex h-12 items-center gap-2 px-3">
          <BrandMark size={28} />
          <span className="whitespace-nowrap font-semibold text-title-lg text-primary">
            BeatySubmit 2026
          </span>
        </div>
      ) : (
        <div className="flex h-11 items-center gap-2 px-2">
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center text-primary"
            onClick={() => {
              if (props.onBack) {
                props.onBack();
                return;
              }
              navigate(-1);
            }}
          >
            <Icon icon="zi-arrow-left" size={24} />
          </button>
          {props.title ? (
            <span className="font-medium text-title-lg text-primary">{props.title}</span>
          ) : null}
        </div>
      )}
      <div className="h-px bg-divider" />
    </div>
  );
};

export default Header;
