import { CSSProperties, FC, PropsWithChildren, RefObject, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { Loader } from '..';

import s from './Button.module.scss';

export interface IButton {
  color?: 'default' | 'filled' | 'outline' | 'disabled' | 'underline';
  size?: 'lg' | 'sm';
  className?: string;
  onClick?: (event: never) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onMouseLeave?: (event: never) => void;
  onMouseOver?: (event: SyntheticEvent) => void;
  style?: CSSProperties;
  href?: string;
  route?: string;
  btnRef?: RefObject<HTMLButtonElement>;
  isLoading?: boolean;
}

const Button: FC<PropsWithChildren<IButton>> = ({
  color = 'default',
  size = 'lg',
  onClick = () => {},
  className,
  type = 'button',
  children,
  disabled,
  href,
  route,
  btnRef,
  onMouseLeave,
  onMouseOver = () => {},
  isLoading = false,
  style,
}) => {
  if (href)
    return (
      <a
        href={href}
        target="_blank"
        className={cn(className, s.button, s[color], {
          [s.disabled]: disabled || color === 'disabled',
        })}
        rel="noreferrer"
        style={style}
      >
        {isLoading ? <Loader className={s.loader} /> : children}
      </a>
    );
  if (route)
    return (
      <Link
        to={route}
        className={cn(className, s.button, s[color], {
          [s.disabled]: disabled || color === 'disabled',
        })}
        style={style}
      >
        {isLoading ? <Loader className={s.loader} /> : children}
      </Link>
    );
  return (
    <button
      ref={btnRef}
      type={type === 'submit' ? 'submit' : 'button'}
      className={cn(s.button, s[color], s[size], className, {
        [s.disabled]: disabled || color === 'disabled',
      })}
      onClick={onClick}
      disabled={disabled}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseOver}
      style={style}
    >
      {isLoading ? <Loader className={s.loader} /> : children}
    </button>
  );
};

export default Button;
