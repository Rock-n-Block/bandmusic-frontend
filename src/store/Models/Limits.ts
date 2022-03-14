import { Instance, types } from 'mobx-state-tree';

const SingleLimit = types.model({
  saleType: types.string,
  sum: types.string,
});

const ListOfSingleLimits = types.array(SingleLimit);
export type TSingleLimit = Instance<typeof SingleLimit>;
export type TListOfSingleLimits = Instance<typeof ListOfSingleLimits>;

const Limits = types
  .model({
    reservedByTypes: ListOfSingleLimits,
    claimedByTypes: ListOfSingleLimits,
    limitsByTypes: ListOfSingleLimits,
  })
  .actions((self) => ({
    setReserved: (reserved: TListOfSingleLimits) => {
      self.reservedByTypes = reserved;
    },
    setClaimed: (claimed: TListOfSingleLimits) => {
      self.claimedByTypes = claimed;
    },
    setLimits: (limits: TListOfSingleLimits) => {
      self.limitsByTypes = limits;
    },
  }));

export default Limits;
