import { FC, useEffect, useState } from 'react';

import loadingIcon from '@/assets/img/icons/loading.svg';
import okIcon from '@/assets/img/icons/ok.svg';
import { Button, Modal } from '@/components';
import { IModalProps } from '@/types';

import s from './SuccessModal.module.scss';

export interface ISuccessModalProps extends IModalProps {
  text: string;
}

const WalletConnectModal: FC<ISuccessModalProps> = ({ text, visible, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (visible) {
      t = setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
    return () => {
      clearTimeout(t);
    };
  }, [visible]);

  return (
    <Modal className={s.modal_wrapper} visible={visible} onClose={onClose}>
      <div className={s.success_modal_wrapper}>
        {loading ? (
          <div className={s.loading}>
            <img src={loadingIcon} alt="loading" />
          </div>
        ) : (
          <>
            <div className={s.icon}>
              <img src={okIcon} alt="ok" />
            </div>
            <div className={s.title}>{text}</div>
            <Button className={s.btn} color="filled" onClick={onClose}>
              Ok
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default WalletConnectModal;
