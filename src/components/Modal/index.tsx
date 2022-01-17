import { FC, PropsWithChildren } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import Dialog from 'rc-dialog';

import { IModalProps } from '@/types';

import s from './Modal.module.scss';

const Modal: FC<PropsWithChildren<IModalProps>> = observer(
  ({ className, visible, onClose, children }) => {
    return (
      <Dialog
        prefixCls="modal"
        zIndex={1000}
        destroyOnClose
        className={cn(s.modal_wrapper, className)}
        closable={false}
        visible={visible}
        maskClosable
        onClose={onClose}
      >
        {children}
      </Dialog>
    );
  },
);

export default Modal;
