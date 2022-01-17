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
  const [accessTokens, setAccessTokens] = useState<boolean>(false);
  const { user } = useMst();
  const [isVisibleModal, handleOpenModal, handleCloseModal] = useModal(false);
  const handleAccessTokens = useCallback(() => {
    setAccessTokens(true);
    handleOpenModal();
  }, [handleOpenModal]);
  const handleVesting = useCallback(() => {
    setVesting(true);
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
            {!accessTokens && (
              <Button color="filled" className={s.btn} onClick={handleAccessTokens}>
                Access Your $RYLT Tokens
              </Button>
            )}
            <Button color="outline" className={s.btn} onClick={handleVesting}>
              Buy Extra $RYLT Tokens
            </Button>
          </>
        )}
      </div>
      <div className={s.col}>
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
