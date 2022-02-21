import { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';

import homeImg from '@/assets/img/home.png';
import { Button } from '@/components';
import { SuccessModal, Vesting } from '@/containers';
import useModal from '@/hooks/useModal';
import { useMst } from '@/store';

import s from './Home.module.scss';

const Home: FC = observer(() => {
  const [vesting, setVesting] = useState<boolean>(false);
  const { user, claimerInfo } = useMst();
  const [isVisibleModal, handleCloseModal] = useModal(false);

  const handleVesting = useCallback(() => {
    setVesting(true);
  }, []);

  return (
    <div className={s.home_wrapper}>
      <h1 className={s.title}>
        $RYLT Token <span>Holders Access</span> Your Tokens Here
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
      <SuccessModal
        text="RYLT is credited to your wallet"
        visible={isVisibleModal}
        onClose={handleCloseModal}
      />
    </div>
  );
});
export default Home;
