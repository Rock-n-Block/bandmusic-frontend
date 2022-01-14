import { types } from 'mobx-state-tree';

const User = types
  .model({
    address: types.maybeNull(types.string),
  })
  .actions((self) => ({
    setAddress: (address: string) => {
      self.address = address;
    },
  }));
export default User;
