import { types } from 'mobx-state-tree';

import { TUser } from '@/types';

const User = types
  .model({
    address: types.string,
    balance: types.string,
    isOwner: types.boolean,
    provider: types.string,
  })
  .actions((self) => ({
    setAddress: (address: string) => {
      self.address = address;
    },
    setBalance: (balance: string) => {
      self.balance = balance;
    },
    setIsOwner: (status: boolean) => {
      self.isOwner = status;
    },
    setUser: ({ address, balance }: TUser) => {
      self.address = address;
      self.balance = balance;
    },
    setProvider: (provider: string) => {
      self.provider = provider;
    },
  }));
export default User;
