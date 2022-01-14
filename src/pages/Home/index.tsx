import { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';

import homeImg from '@/assets/img/home.png';
import { Button } from '@/components';
import { useMst } from '@/store';

import s from './Home.module.scss';
import {Vesting} from "@/containers";

const Home: FC = observer(() => {
  const [vestingTemp, setVestingTemp] = useState<boolean>(false);
  const { user } = useMst();
  const handleAccessTokens = useCallback(() => {
    setVestingTemp(true);
  }, []);

  return (
    <div className={s.home_wrapper}>
      <div className={s.col}>
        <div className={s.title}>
          $RYLT Token <span>Holders Access</span> Your Tokens Here
        </div>
        <div className={s.description}>
          Join the only platform that links music fans and artists together through music NFTs,
          tokens, and Bands Music Metaverse. Access your $RYLT tokens now. Connect your wallet that
          you used to buy your $RYLT tokens, and unlock them.
        </div>
        {user.address && (
          <>
            <Button color="filled" className={s.btn} onClick={handleAccessTokens}>
              Access Your $RYLT Tokens
            </Button>
            <Button color="outline" className={s.btn}>
              Buy Extra $RYLT Tokens
            </Button>
          </>
        )}
      </div>
      <div className={s.col}>
        {vestingTemp ? (
          <Vesting />
        ) : (
          <div className={s.home_img}>
            <img src={homeImg} alt="home" />
          </div>
        )}
      </div>
    </div>
  );
});
export default Home;
