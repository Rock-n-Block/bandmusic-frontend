import { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import homeImg from '@/assets/img/home.png';
import { Button } from '@/components';
import { Vesting } from '@/containers';
import { useMst } from '@/store';

import s from './Home.module.scss';

const Home: FC = observer(() => {
  const [vesting, setVesting] = useState<boolean>(false);
  const { user, claimerInfo } = useMst();

  const handleVesting = useCallback(() => {
    setVesting(true);
  }, []);

  return (
    <div className={cn(s.home_wrapper, { [s.vesting]: vesting })}>
      <h1 className={s.title}>
        $RYLT Token <span>Holders Mint</span> Your Tokens Here
      </h1>
      <div className={s.description}>
        Join the only platform that links music fans and artists together through music NFTs,
        tokens, and Bands Music Metaverse. Access your $RYLT tokens now. Connect your wallet that
        you used to buy your $RYLT tokens, and unlock them.
        <div className={s.btns}>
          {user.address && (
            <>
              {!vesting && claimerInfo.waiting.length !== 0 && (
                <Button color="filled" className={s.btn} onClick={handleVesting}>
                  Access Your $RYLT Tokens
                </Button>
              )}
              <Button color="outline" className={s.btn} href="https://bandroyalty.io/">
                Buy Extra $RYLT Tokens
              </Button>
            </>
          )}
        </div>
      </div>
      <div className={s.content}>
        {vesting ? (
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
