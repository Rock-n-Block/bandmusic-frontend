import { FC, useCallback, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import logo from '@/assets/img/icons/logo.svg';
import { ReactComponent as MetaMaskSVG } from '@/assets/img/icons/metamask.svg';
import { ReactComponent as WalletConnectSVG } from '@/assets/img/icons/walletconnect.svg';
import { Button } from '@/components';
import { useModal } from '@/context';
import { useMst } from '@/store';
import { TAvailableProviders } from '@/types';
import { splitAddress } from '@/utils';

import { SuccessModal } from '..';

import { AddressModal, ConnectModal } from './components';

import s from './Header.module.scss';

const getIcon = (provider: TAvailableProviders) => {
  switch (provider) {
    case 'MetaMask': {
      return <MetaMaskSVG />;
    }
    case 'WalletConnect': {
      return <WalletConnectSVG />;
    }
    default: {
      return <WalletConnectSVG />;
    }
  }
};

const Header: FC = observer(() => {
  const { user } = useMst();

  const { openModal, closeModal, isOpen } = useModal();

  const handleModalOpen = useCallback(() => {
    openModal('chooseWallet');
  }, [openModal]);

  const openAddress = useCallback(() => {
    openModal('address');
  }, [openModal]);

  useEffect(() => {
    if (user.address) {
      closeModal('chooseWallet');
    }
  }, [user.address]);

  const links = useMemo(
    () => [
      { link: '/admin', name: 'Vesting', id: 1 },
      { link: '/limits', name: 'Limits', id: 2 },
    ],
    [],
  );

  return (
    <div className={s.header_wrapper}>
      <div className={s.logo}>
        <img src={logo} alt="logo" />
      </div>
      {user.isOwner && (
        <div className={s.linkWrapper}>
          {links.map((l) => (
            <NavLink
              className={({ isActive }) => cn(s.link, { [s.active]: isActive })}
              to={l.link}
              key={l.id}
            >
              {l.name}
            </NavLink>
          ))}
        </div>
      )}
      {user.address ? (
        <div className={s.connectWrapper}>
          <Button className={s.btn_connected} onClick={openAddress}>
            <div className={s.icon}>
              {getIcon(localStorage.getItem('bandmusic-wallet') as TAvailableProviders)}
            </div>
            <div className={s.text}>{splitAddress(user.address, 22, 3)}</div>
            <div className={s.mobileText}>{splitAddress(user.address, 10, 3)}</div>
          </Button>
        </div>
      ) : (
        <Button color="filled" className={s.btn} onClick={handleModalOpen}>
          Connect Wallet
        </Button>
      )}
      <SuccessModal
        visible={isOpen('successConnect')}
        text="Your wallet has been successfully connected"
        onClose={() => closeModal('successConnect')}
      />
      <ConnectModal />
      <AddressModal />
    </div>
  );
});

export default Header;
