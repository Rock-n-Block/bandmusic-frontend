import { FC } from 'react';

import { Button } from '@/components';
import { Timer } from '@/containers';

import { stages } from './mock';

import s from './Vesting.module.scss';

const Vesting: FC = () => {
  return (
    <div className={s.vesting_wrapper}>
      <div className={s.count}>
        0,3287<span>RYLT</span>
      </div>
      <div className={s.timer_tracking}>Timer Tracking</div>
      {stages.map((stage) => (
        <div key={stage.number} className={s.stage}>
          <div className={s.stage_number}>{stage.number} stage</div>
          <Timer deadline={stage.time} />
          <Button
            size="sm"
            className={s.stage_btn}
            color="filled"
            disabled={stage.status === 'disabled'}
          >
            Claim
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Vesting;
