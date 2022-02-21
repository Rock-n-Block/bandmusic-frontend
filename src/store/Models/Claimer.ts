import { Instance, types } from 'mobx-state-tree';

const ClaimLine = types.model({
  amount: types.string,
  timestamp: types.number,
  signature: types.string,
  idx: types.string,
});

const DataType = types.array(ClaimLine);
export type SingleClaim = Instance<typeof ClaimLine>;
export type TDataType = Instance<typeof DataType>;

const ClaimerInfo = types
  .model({
    confirmed: DataType,
    pending: DataType,
    waiting: DataType,
  })
  .actions((self) => ({
    setConfirmed: (confirmed: TDataType) => {
      self.confirmed = confirmed;
    },
    setPending: (pending: TDataType) => {
      self.pending = pending;
    },
    setWaiting: (waiting: TDataType) => {
      self.waiting = waiting;
    },
  }));

export default ClaimerInfo;
