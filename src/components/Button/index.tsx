import { CSSProperties, FC, PropsWithChildren, RefObject, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import s from './Button.module.scss';

export interface IButton {
  color?: 'filled' | 'accent' | 'disabled';
  className?: string;
  onClick?: (event: never) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onMouseLeave?: (event: never) => void;
  onMouseOver?: (event: SyntheticEvent) => void;
  style?: CSSProperties;
  href?: string;
  btnRef?: RefObject<HTMLButtonElement>;
}

const Button: FC<PropsWithChildren<IButton>> = ({
  color = '',
  onClick = () => {},
  className,
  type = 'button',
  children,
  disabled,
  href,
  btnRef,
  onMouseLeave,
  onMouseOver = () => {},
}) => {
  if (href)
    return (
      <Link
        to={href}
        className={cn(s.button, s[color], className, {
          [s.disabled]: disabled || color === 'disabled',
        })}
      >
        {children}
      </Link>
    );
  return (
    <button
      ref={btnRef}
      type={type === 'submit' ? 'submit' : 'button'}
      className={cn(s.button, s[color], className, {
        [s.disabled]: disabled || color === 'disabled',
      })}
      onClick={onClick}
      disabled={disabled}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseOver}
    >
      {children}
    </button>
  );
};

export default Button;
