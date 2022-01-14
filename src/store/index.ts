import { createContext, useContext } from 'react';
import { Instance, types } from 'mobx-state-tree';

import User from './Models/User';

const RootModel = types.model({
  user: User,
});

export const Store = RootModel.create({
  user: {
    address: '',
  },
});

const rootStore = Store;

export type RootInstance = Instance<typeof RootModel>;

const RootStoreContext = createContext<RootInstance | null>(null);

export const { Provider } = RootStoreContext;

export function useMst(): any {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw Error('Store cannot be null, please add a context provider');
  }
  return store;
}

export default rootStore;
