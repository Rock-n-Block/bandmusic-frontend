import { useCallback, useRef, useState, VFC } from 'react';
import cn from 'classnames';

import { useClickOutside } from '@/hooks';
import { TSelectorOption } from '@/types';

import s from './styles.module.scss';

interface ISelector {
  options: TSelectorOption[];
  value: TSelectorOption;
  setValue: (value: TSelectorOption) => void;
  className?: string;
}

interface ISelectorOption extends TSelectorOption {
  setValue: (value: TSelectorOption) => void;
  selected: boolean;
}

const SelectorOption: VFC<ISelectorOption> = ({ name, id, setValue, selected }) => {
  const onOptionClick = useCallback(() => {
    setValue({ name, id });
  }, [id, name, setValue]);
  return (
    <button
      className={cn(s.selectorOption, { [s.selected]: selected })}
      type="button"
      onClick={onOptionClick}
      disabled={selected}
    >
      {name}
    </button>
  );
};

const Selector: VFC<ISelector> = ({ options, value, setValue, className }) => {
  const headRef = useRef<HTMLButtonElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState<boolean>(false);

  const onEmptySpaceClick = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside(bodyRef, onEmptySpaceClick, headRef);

  const onSelectorHeadClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const setOptionValue = useCallback(
    (val: TSelectorOption) => {
      setValue(val);
      setOpen(false);
    },
    [setValue],
  );

  return (
    <section className={cn(s.selector, className)}>
      <button ref={headRef} onClick={onSelectorHeadClick} type="button" className={s.selectorHead}>
        {value.name}
      </button>
      <div ref={bodyRef} className={cn(s.selectorBody, { [s.active]: open })}>
        {options.map((o) => (
          <SelectorOption
            key={o.id}
            selected={o.id === value.id}
            {...o}
            setValue={setOptionValue}
          />
        ))}
      </div>
    </section>
  );
};

export default Selector;
