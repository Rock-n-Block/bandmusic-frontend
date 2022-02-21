import { FC, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

import s from './Timer.module.scss';

interface ITimerProps {
  deadline: number;
  onTimerEnd: () => void;
  className?: string;
}
const Timer: FC<ITimerProps> = ({ deadline, onTimerEnd, className }) => {
  const timer = useRef<NodeJS.Timer | null>(null);
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const getCountdown = useCallback(() => {
    const now = new Date();
    const diff = differenceInMilliseconds(deadline, now);
    let difDays: string | number = '00';
    let difHours: string | number = '00';
    let difMinutes: string | number = '00';
    let difSeconds: string | number = '00';

    if (diff > 0) {
      difDays = differenceInDays(deadline, now);
      difHours = differenceInHours(deadline, now);
      difMinutes = differenceInMinutes(deadline, now) % 60;
      difSeconds = differenceInSeconds(deadline, now) % 60;

      setCountdown({
        days: difDays < 10 ? `0${difDays}` : difDays.toString(),
        hours: difHours < 10 ? `0${difHours}` : difHours.toString(),
        minutes: difMinutes < 10 ? `0${difMinutes}` : difMinutes.toString(),
        seconds: difSeconds < 10 ? `0${difSeconds}` : difSeconds.toString(),
      });
    } else if (timer.current) {
      onTimerEnd();
      clearInterval(timer.current);
    }
  }, [deadline, onTimerEnd]);

  useEffect(() => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        getCountdown();
      }, 1000);
    }
  }, [getCountdown, timer]);

  return (
    <div className={cn(className, s.timer_wrapper)}>
      {+countdown.days > 0
        ? `${+countdown.days} ${+countdown.days > 1 ? 'days' : 'day'}`
        : `${countdown.hours}:${countdown.minutes}:${countdown.seconds}`}
    </div>
  );
};

export default Timer;
