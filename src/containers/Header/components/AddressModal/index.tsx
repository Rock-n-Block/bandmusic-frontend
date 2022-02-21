import { useCallback, VFC } from 'react';

import { ReactComponent as CloseSVG } from '@/assets/img/icons/close.svg';
import { ReactComponent as CopySVG } from '@/assets/img/icons/copy.svg';
import { ReactComponent as LogOutSVG } from '@/assets/img/icons/log-out.svg';
import { Button, Modal } from '@/components';
import { useModal, useWalletContext } from '@/context';
import useClipboard from '@/hooks/useClipboard';
import { useMst } from '@/store';
import { splitAddress } from '@/utils';

import s from '../styles.module.scss';

const AddressModal: VFC = () => {
  const { isOpen, closeModal } = useModal();
  const { disconnect } = useWalletContext();
  const { address } = useMst().user;
  const [clipStatus, onCopyClick] = useClipboard(address);

  const onDisconnectClick = useCallback(() => {
    closeModal('address');
    disconnect();
  }, [disconnect]);

  return (
    <Modal
      className={s.modalWrapper}
      visible={isOpen('address')}
      onClose={() => closeModal('address')}
    >
      <div className={s.wrapper}>
        <button className={s.close} onClick={() => closeModal('address')} type="button">
          <CloseSVG />
        </button>
        <h3 className={s.title}>Account</h3>
        <div className={s.providers}>
          <Button className={s.provider} onClick={() => onCopyClick()}>
            <span className={s.text}>{splitAddress(address)}</span>
            <span className={s.icon}>
              <CopySVG />
            </span>
          </Button>
          <span className={s.notify}>{clipStatus === 1 ? 'clipped!' : ''}</span>
          <Button className={s.provider} color="filled" onClick={onDisconnectClick}>
            <span className={s.text}>Disconnect</span>
            <span className={s.icon}>
              <LogOutSVG />
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddressModal;
