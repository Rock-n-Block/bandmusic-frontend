import { createContext, FC, useCallback, useContext, useMemo, useState } from 'react';
import Web3 from 'web3';

import { contracts } from '@/config';
import { ContractService } from '@/servieces';
import { useMst } from '@/store';
import { IContractContext } from '@/types';
import { normalizedValue } from '@/utils';

const ContractContext = createContext<IContractContext>({} as IContractContext);
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

const cService = ContractService;

const ContractProvider: FC = ({ children }) => {
  const { user } = useMst();

  const [tokenContract, setTokenContract] = useState(
    cService.getContract(
      contracts.params.TOKEN[contracts.type].abi,
      contracts.params.TOKEN[contracts.type].address,
    ),
  );

  const [vestingContract, setVestingContract] = useState(
    cService.getContract(
      contracts.params.VESTING[contracts.type].abi,
      contracts.params.VESTING[contracts.type].address,
    ),
  );

  const getOwnerStatus = useCallback(
    async (address: string) => {
      const isOwner = await vestingContract.methods.hasRole(DEFAULT_ADMIN_ROLE, address).call();
      user.setIsOwner(isOwner);
      return isOwner;
    },
    [user, vestingContract.methods],
  );

  const getBalance = useCallback(
    async (address: string, isOwner = false) => {
      const balance = await tokenContract.methods[isOwner ? 'balanceOf' : 'balanceOf'](address)
        .call()
        .then((val: string) => normalizedValue(val));
      user.setBalance(balance);
      return balance;
    },
    [tokenContract.methods, user],
  );

  const getAllowance = useCallback(
    async (from: string, to: string) => {
      const allowance = await tokenContract.methods
        .allowance(from, to)
        .call()
        .then((val: string) => normalizedValue(val));
      return allowance;
    },
    [tokenContract.methods],
  );

  const setProvider = useCallback((newWeb: Web3) => {
    cService.resetWeb3(newWeb);
    setTokenContract(
      cService.getContract(
        contracts.params.TOKEN[contracts.type].abi,
        contracts.params.TOKEN[contracts.type].address,
      ),
    );
    setVestingContract(
      cService.getContract(
        contracts.params.VESTING[contracts.type].abi,
        contracts.params.VESTING[contracts.type].address,
      ),
    );
  }, []);

  const sendApprove = useCallback(
    async (spender: string, amount: string, address: string) => {
      const approved = await tokenContract.methods.approve(spender, amount).send({ from: address });
      return approved;
    },
    [tokenContract.methods],
  );

  const sendTransfer = useCallback(
    async (to: string, amount: string, address: string) => {
      const transaction = await tokenContract.methods.transfer(to, amount).send({ from: address });
      return transaction;
    },
    [tokenContract.methods],
  );

  const claimTokens = useCallback(
    async (amount: string[], timestamp: string[], signature: string[], address: string) => {
      const transaction = await vestingContract.methods
        .claimTokens(amount, timestamp, signature)
        .send({ from: address });
      return transaction;
    },
    [vestingContract.methods],
  );

  const values = useMemo(
    () => ({
      getOwnerStatus,
      getBalance,
      getAllowance,
      sendApprove,
      claimTokens,
      sendTransfer,
      setProvider,
    }),
    [claimTokens, getAllowance, setProvider, getBalance, getOwnerStatus, sendApprove, sendTransfer],
  );
  return <ContractContext.Provider value={values}>{children}</ContractContext.Provider>;
};

export const useContractContext = () => {
  return useContext(ContractContext);
};

export default ContractProvider;
