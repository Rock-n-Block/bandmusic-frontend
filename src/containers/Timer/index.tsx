import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  // differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

import s from './Timer.module.scss';

interface ITimerProps {
  deadline: number;
}
const Timer: FC<ITimerProps> = ({ deadline }) => {
  const timer = useRef<any>(null);
  const [countdown, setCountdown] = useState({
    // days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const getCountdown = useCallback(() => {
    const now = new Date();
    const diff = differenceInMilliseconds(deadline, now);
    // let difDays: string | number = '00';
    let difHours: string | number = '00';
    let difMinutes: string | number = '00';
    let difSeconds: string | number = '00';
    if (diff > 0) {
      difHours = differenceInHours(deadline, now);
      difMinutes = differenceInMinutes(deadline, now) % 60;
      difSeconds = differenceInSeconds(deadline, now) % 60;

      setCountdown({
        // days: difDays < 10 ? `0${difDays}` : difDays.toString(),
        hours: difHours < 10 ? `0${difHours}` : difHours.toString(),
        minutes: difMinutes < 10 ? `0${difMinutes}` : difMinutes.toString(),
        seconds: difSeconds < 10 ? `0${difSeconds}` : difSeconds.toString(),
      });
    } else if (timer.current) {
      clearInterval(timer.current);
    }
  }, [deadline, timer]);

  useEffect(() => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        getCountdown();
      }, 1000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [getCountdown, timer]);

  return (
    <div className={s.timer_wrapper}>
      {countdown.hours}:{countdown.minutes}:{countdown.seconds}
    </div>
  );
};

export default Timer;
