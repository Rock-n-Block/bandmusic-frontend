import { createContext, FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { cast } from 'mobx-state-tree';

import { login } from '@/api';
import vesting from '@/api/vesting';
import { WalletService } from '@/servieces';
import { useMst } from '@/store';
import { IWalletConnectContext, TAvailableProviders } from '@/types';
import { logger, normalizedValue } from '@/utils';

import { useContractContext, useModal } from '.';

const WalletContext = createContext<IWalletConnectContext>({} as IWalletConnectContext);
const wcService = WalletService;
const tokenLifeTime = 1000 * 60 * 60 * 12;

type TClaimResponseClaim = {
  token_amount: string;
  claimed_at: string;
  signature: string;
  status: string;
  stage: number;
};

const normalizeUserData: any = (newData: TClaimResponseClaim[], key: string) => {
  if (!newData) {
    return [];
  }
  return newData
    .filter((line: TClaimResponseClaim) => line.status === key)
    .map((line: TClaimResponseClaim, k: number) => ({
      amount: String(line.token_amount),
      signature: line.signature,
      timestamp: +line.claimed_at,
      idx: `${key}${k}`,
      stage: line.stage,
    }));
};

const WalletConnectProvider: FC = ({ children }) => {
  const { user, ownerInfo, claimerInfo } = useMst();
  const { getOwnerStatus, setProvider, getBalance } = useContractContext();
  const { openModal } = useModal();

  const loginUser = useCallback(
    async (address, isOwner) => {
      const RawTokenData = localStorage.getItem('bandmusic_token');
      const tokenData = RawTokenData ? JSON.parse(RawTokenData) : null;
      if (
        !tokenData ||
        !tokenData.lifetime ||
        new Date(tokenData.lifetime).getTime() < Date.now()
      ) {
        const msg = await login.getMsg();
        const signedMsg = await wcService.signMsg(address, msg.data);
        const loginData = await login.login(address, msg.data, signedMsg);
        if (loginData.data.key) {
          localStorage.setItem(
            'bandmusic_token',
            JSON.stringify({
              token: loginData.data.key,
              lifetime: Date.now() + tokenLifeTime,
            }),
          );
          user.setUser({ balance: '0', address });
          user.setIsOwner(isOwner);
          return true;
        }
        return false;
      }
      user.setUser({ balance: '0', address });
      user.setIsOwner(isOwner);
      const balance = await getBalance(address, isOwner);
      user.setBalance(balance);
      return true;
    },
    [user],
  );

  const fetchUserData = useCallback(
    async (address, status) => {
      if (status) {
        const loadedFiles = await vesting.getData();
        ownerInfo.setLoadedFiles(
          loadedFiles.data.map((line: any, key: number) => ({
            amount: normalizedValue(line.tokens_bought),
            timestamp: +line.join_at,
            address: line.wallet_address,
            saleType: line.sale_type,
            idx: `db${key}`,
            stage: key + 1,
          })),
        );
      } else {
        const rawClaims = await vesting.getData(address);
        const claims = rawClaims.data[0].claims.map((claim: any, key: number) => ({
          ...claim,
          stage: key + 1,
        }));
        claimerInfo.setConfirmed(normalizeUserData(claims, 'Confirmed'));
        claimerInfo.setPending(normalizeUserData(claims, 'Pending'));
        claimerInfo.setWaiting(normalizeUserData(claims, 'Waiting'));
      }
    },
    [claimerInfo, ownerInfo],
  );

  const disconnect = useCallback(() => {
    localStorage.removeItem('bandmusic-wallet');
    localStorage.removeItem('bandmusic_token');
    wcService.logOut();
    user.setUser({ address: '', balance: '' });
    user.setIsOwner(false);
    ownerInfo.setCurrentFiles({ name: '', content: cast([]) });
  }, [ownerInfo, user]);

  const onAccountChange = useCallback(
    async (address: string) => {
      disconnect();
      const isOwner = await getOwnerStatus(address);
      const logged = await loginUser(address, isOwner);
      if (logged) {
        await fetchUserData(address, isOwner);
      }
    },
    [disconnect, fetchUserData, getOwnerStatus, loginUser],
  );
  const connect = useCallback(
    async (wallet: TAvailableProviders) => {
      const connected = await wcService.initConnect(wallet);
      if (connected) {
        try {
          localStorage.setItem('bandmusic-wallet', wallet);
          setProvider(wcService.Web3());
          const accountInfo: any = await wcService.getAccount(user);
          if (accountInfo.address) {
            const isOwner = await getOwnerStatus(accountInfo.address);
            const logged = await loginUser(accountInfo.address, isOwner);
            if (logged) {
              await fetchUserData(accountInfo.address, isOwner);
              wcService.eventSubscribe(onAccountChange);
              openModal('successConnect');
            }
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        logger('metamask extension', 'Please install Metamask extension', 'warn');
      }
    },
    [fetchUserData, getOwnerStatus, loginUser, onAccountChange, setProvider, user],
  );

  useEffect(() => {
    const network = localStorage.getItem('bandmusic-wallet') as TAvailableProviders;
    if (network) {
      connect(network);
    }
  }, []);

  const values = useMemo(
    () => ({
      connect,
      disconnect,
      fetchUserData,
    }),
    [connect, disconnect, fetchUserData],
  );
  return <WalletContext.Provider value={values}>{children}</WalletContext.Provider>;
};

const useWalletContext = () => {
  return useContext(WalletContext);
};

export { useWalletContext, WalletConnectProvider };
