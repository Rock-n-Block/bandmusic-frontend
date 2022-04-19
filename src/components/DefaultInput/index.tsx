import { FormEvent, useCallback, useState, VFC } from 'react';
import cn from 'classnames';

import { checkMinMax, onlyNumber } from '@/utils';

import s from './styles.module.scss';

interface IDefaultInput {
  name: string;
  value: string;
  setValue: (value: string) => void;
  label?: string;
  editable?: boolean;
  numeric?: boolean;
  min?: string | number;
  max?: string | number;
  className?: string;
}

const DefaultInput: VFC<IDefaultInput> = ({
  name,
  value,
  setValue,
  label = '',
  editable = false,
  numeric = true,
  min,
  max,
  className,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const onFocusHandler = useCallback((e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsActive(true);
  }, []);

  const onBlurHandler = useCallback((e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsActive(false);
  }, []);

  const onChangeHandler = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const currentValue = e.currentTarget.value;
      if (!editable) {
        return;
      }
      if (numeric) {
        if (!onlyNumber(currentValue)) {
          return;
        }
        if (min || max) {
          if (!checkMinMax(currentValue, min, max)) {
            return;
          }
        }
      }
      setValue(currentValue);
    },
    [editable, max, min, numeric, setValue],
  );

  return (
    <section className={cn(s.input, className)}>
      {label && (
        <label
          className={cn(s.inputLabel, {
            [s.active]: isActive || value.length,
            [s.disabled]: !editable,
          })}
          htmlFor={`default_input_${name}`}
        >
          {label}
        </label>
      )}
      <input
        className={cn(s.inputMain, { [s.disabled]: !editable })}
        id={`default_input_${name}`}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        value={value}
      />
    </section>
  );
};

export default DefaultInput;
