import { useCallback, VFC } from 'react';

import { ReactComponent as CloseSVG } from '@/assets/img/icons/close.svg';
import { ReactComponent as MetaMaskSVG } from '@/assets/img/icons/metamask.svg';
import { ReactComponent as WalletConnectSVG } from '@/assets/img/icons/walletconnect.svg';
import { Button, Modal } from '@/components';
import { connectWalletConfig } from '@/config';
import { useModal, useWalletContext } from '@/context';
import { TAvailableProviders } from '@/types';

import s from '../styles.module.scss';

const availableWallets = connectWalletConfig.wallets;

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

const ConnectModal: VFC = () => {
  const { isOpen, closeModal } = useModal();
  const { connect } = useWalletContext();

  const handleConnect = useCallback(
    (provider: TAvailableProviders) => {
      return () => {
        connect(provider);
      };
    },
    [connect],
  );

  return (
    <Modal
      className={s.modalWrapper}
      visible={isOpen('chooseWallet')}
      onClose={() => closeModal('chooseWallet')}
    >
      <div className={s.wrapper}>
        <button className={s.close} onClick={() => closeModal('chooseWallet')} type="button">
          <CloseSVG />
        </button>
        <h3 className={s.title}>Choose wallet</h3>
        <div className={s.providers}>
          {availableWallets.map((provider) => (
            <Button onClick={handleConnect(provider)} className={s.provider} key={provider}>
              <span className={s.icon}>{getIcon(provider)}</span>
              <span className={s.text}>{provider}</span>
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ConnectModal;
