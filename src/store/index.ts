import { createContext, useContext } from 'react';
import { Instance, types } from 'mobx-state-tree';

import ClaimerInfo from './Models/Claimer';
import Limits from './Models/Limits';
import ModalState from './Models/Modal';
import OwnerInfo from './Models/Owner';
import User from './Models/User';

const RootModel = types.model({
  user: User,
  ownerInfo: OwnerInfo,
  claimerInfo: ClaimerInfo,
  modal: ModalState,
  limits: Limits,
});

export const Store = RootModel.create({
  user: {
    address: '',
    balance: '',
    isOwner: false,
    provider: '',
  },
  ownerInfo: {
    currentFiles: {
      name: '',
      content: [],
    },
    loadedFiles: [],
  },
  claimerInfo: {
    confirmed: [],
  },
  modal: {
    type: '',
    title: '',
    info: '',
    isActive: false,
  },
  limits: {
    reservedByTypes: [],
    claimedByTypes: [],
    limitsByTypes: [],
  },
});

const rootStore = Store;

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<RootInstance | null>(null);

export const { Provider } = RootStoreContext;

export function useMst(): RootInstance {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw Error('Store cannot be null, please add a context provider');
  }
  return store;
}

export default rootStore;
