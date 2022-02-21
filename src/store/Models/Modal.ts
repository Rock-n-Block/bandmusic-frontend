import { types } from 'mobx-state-tree';

const ModalState = types
  .model({
    type: types.string,
    title: types.string,
    info: types.string,
    isActive: types.boolean,
  })
  .actions((self) => ({
    openModal: (type: string, title: string, info = '') => {
      self.info = info;
      self.title = title;
      self.type = type;
      self.isActive = true;
    },
    closeModal: () => {
      self.isActive = false;
    },
  }));

export default ModalState;
