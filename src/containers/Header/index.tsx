import { FC, useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import logo from '@/assets/img/icons/logo.png';
import metamask from '@/assets/img/icons/metamask.png';
import { Button } from '@/components';
import { SuccessModal } from '@/containers';
import useModal from '@/hooks/useModal';
import { useMst } from '@/store';

import s from './Header.module.scss';

const Header: FC = observer(() => {
  const { user } = useMst();
  const [isVisibleModal, handleOpenModal, handleCloseModal] = useModal(false);
  const handleConnect = useCallback(() => {
    user.setAddress('2343r23rtery02392yyws4...122');
    handleOpenModal();
  }, [handleOpenModal, user]);
  return (
    <div className={s.header_wrapper}>
      <div className={s.logo}>
        <img src={logo} alt="logo" />
      </div>
      {user.address ? (
        <Button className={s.btn_connected}>
          <div className={s.icon}>
            <img src={metamask} alt="metamask" />
          </div>
          <div className={s.text}>{user.address}</div>
        </Button>
      ) : (
        <Button color="filled" className={s.btn} onClick={handleConnect}>
          Connect Wallet
        </Button>
      )}
      <SuccessModal
        text="Your wallet has been successfully connected"
        visible={isVisibleModal}
        onClose={handleCloseModal}
      />
    </div>
  );
});

export default Header;
