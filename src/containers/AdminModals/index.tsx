import { VFC } from 'react';
import { observer } from 'mobx-react-lite';

import { ReactComponent as CloseSVG } from '@/assets/img/icons/close.svg';
import { ReactComponent as ErrorSVG } from '@/assets/img/icons/error.svg';
import { ReactComponent as SuccessSVG } from '@/assets/img/icons/success.svg';
import { ReactComponent as WarningSVG } from '@/assets/img/icons/warning.svg';
import { Button, Modal } from '@/components';
import { useMst } from '@/store';
import { TModalStatus } from '@/types';

import s from './styles.module.scss';

const getSvgStatus = (type: TModalStatus) => {
  switch (type) {
    case 'warning':
      return (
        <div className={s.warnWrapper}>
          <WarningSVG />
          <span className={s.warnTitle}>Warning</span>
        </div>
      );
    case 'error':
      return <ErrorSVG />;
    case 'success':
      return <SuccessSVG />;
    default:
      return <div />;
  }
};

const AdminModal: VFC = observer(() => {
  const { type, title, info, isActive, closeModal } = useMst().modal;

  return (
    <Modal className={s.modalWrapper} visible={isActive} onClose={() => closeModal()}>
      <div className={s.wrapper}>
        <button onClick={() => closeModal()} type="button" className={s.cross}>
          <CloseSVG />
        </button>
        <div className={s.status}>{getSvgStatus(type as TModalStatus)}</div>
        <span className={s.text}>{title}</span>
        {info && <div className={s.info}>{info}</div>}
        <Button className={s.button} onClick={() => closeModal()} color="filled">
          OK
        </Button>
      </div>
    </Modal>
  );
});

export default AdminModal;
