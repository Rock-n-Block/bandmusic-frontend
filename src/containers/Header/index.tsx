import { FC, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import logo from '@/assets/img/icons/logo.png';
import walletConnectPath from '@/assets/img/icons/walletconnect.svg';
import { Button } from '@/components';
import { useWalletContext } from '@/context';
import { useMst } from '@/store';
import { splitAddress } from '@/utils';

import { SuccessModal } from '..';

import s from './Header.module.scss';

const Header: FC = observer(() => {
  const { user } = useMst();
  const { connect, disconnect } = useWalletContext();

  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const handleConnect = useCallback(() => {
    connect('WalletConnect');
  }, [connect]);

  const handlerToggleDisconnect = useCallback(() => {
    setIsDisconnectOpen((prev) => !prev);
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    if (!user.address) {
      setIsDisconnectOpen(false);
    }
  }, [user.address]);

  useEffect(() => {
    if (user.address) {
      setIsConnectModalOpen(true);
    }
  }, [user.address]);

  return (
    <div className={s.header_wrapper}>
      <div className={s.logo}>
        <img src={logo} alt="logo" />
      </div>
      {user.address ? (
        <div className={s.connectWrapper}>
          <Button className={s.btn_connected} onClick={handlerToggleDisconnect}>
            <div className={s.icon}>
              <img src={walletConnectPath} alt="WalletConnectIcon" />
            </div>
            <div className={s.text}>{splitAddress(user.address, 22, 3)}</div>
            <div className={s.mobileText}>{splitAddress(user.address, 10, 3)}</div>
          </Button>
          <div className={cn(s.disconnect, { [s.active]: isDisconnectOpen })}>
            <Button className={cn(s.btn_disconnected)} onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <Button color="filled" className={s.btn} onClick={handleConnect}>
          Connect Wallet
        </Button>
      )}
      <SuccessModal
        visible={isConnectModalOpen}
        text="Your wallet has been successfully connected"
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
});

export default Header;
