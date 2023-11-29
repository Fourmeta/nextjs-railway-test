import React, {ButtonHTMLAttributes, CSSProperties, FC} from 'react';

import classNames from 'classnames';

import {ButtonSizeEnum, ButtonVariantEnum} from './types';

type Props = {
  variant?: ButtonVariantEnum;
  size?: ButtonSizeEnum;
  submit?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  text?: string;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_MAPS: Record<ButtonVariantEnum, string> = {
  [ButtonVariantEnum.PRIMARY]: classNames(
    'bg-primary-600 text-white rounded-md shadow-sm',
    'border hover:bg-primary-700 active:bg-primary-800',
    'focus:ring-2 focus:ring-primary-800',
  ),
  [ButtonVariantEnum.SECONDARY]: classNames(
    'bg-white text-neutrals-700 rounded-md shadow-sm',
    'border border-neutrals-200',
    'hover:bg-neutrals-100 active:bg-neutrals-200',
    'focus:ring-2 focus:ring-primary-800',
  ),
  [ButtonVariantEnum.DANGER]: classNames(
    'bg-red-600 text-white rounded-md shadow-sm',
    'hover:bg-red-700 active:bg-red-800',
    'focus:ring-2 focus:ring-primary-50',
  ),
  [ButtonVariantEnum.INVISIBLE]: classNames(
    'bg-transparent px-0 py-0',
    'outline-none focus:outline-none',
  ),
  [ButtonVariantEnum.GHOST]: classNames(
    'px-2 py-2 text-neutrals-500 font-semibold',
    'hover:bg-neutrals-200 hover:text-neutrals-600',
    'active:bg-neutrals-200 active:text-neutrals-600',
    'focus-visible:ring-4 focus-visible:ring-primary-200 transition-shadow outline-none',
  ),
};

const SIZE_MAPS: Record<ButtonSizeEnum | string, string> = {
  [ButtonSizeEnum.EXTRA_SMALL]: 'text-xs py-1 px-2 rounded-md',
  [ButtonSizeEnum.SMALL]: 'text-xs py-2 px-4',
  [ButtonSizeEnum.MEDIUM]: 'text-base py-4 sm:py-2 px-5 sm:px-4',
  [ButtonSizeEnum.LARGE]: 'text-lg rem:py-[10px] px-5',
};

const Button: FC<Props> = ({
  onClick,
  variant = ButtonVariantEnum.PRIMARY,
  size = ButtonSizeEnum.SMALL,
  submit = false,
  disabled = false,
  children,
  className,
  leftIcon,
  rightIcon,
  text,
  style,
}) => (
  <button
    onClick={onClick}
    type={submit ? 'submit' : 'button'}
    disabled={disabled}
    style={style}
    className={classNames(
      'flex flex-row items-center justify-center',
      'font-medium transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-40',
      variant !== ButtonVariantEnum.INVISIBLE && size && SIZE_MAPS[size],
      variant && VARIANT_MAPS[variant],
      className,
    )}>
    <div
      className={classNames(
        'flex content-center items-center justify-between',
      )}>
      {leftIcon && <div className='pr-2'>{leftIcon}</div>}
      {text || children}
      {rightIcon && <div className='pl-2'>{rightIcon}</div>}
    </div>
  </button>
);

export default Button;
