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
const tokenLifeTime = 60 * 60 * 12;

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
    .map((line: TClaimResponseClaim) => ({
      amount: String(line.token_amount),
      signature: line.signature,
      timestamp: +line.claimed_at,
      idx: `${key}${line.stage}`,
      stage: line.stage,
    }));
};

const normalizeLimitsData: any = (newData: any) => {
  if (!newData) {
    return [];
  }
  return newData.map((l: any) => {
    if (l.sum) {
      if (l.sale_type) {
        return { saleType: l.sale_type, sum: l.sum ? String(l.sum) : '' };
      }
      return { saleType: l.user__sale_type, sum: l.sum ? String(l.sum) : '' };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { saleType: l.sale_type, sum: l.limit ? String(l.limit) : '' };
  });
};

const WalletConnectProvider: FC = ({ children }) => {
  const { user, ownerInfo, claimerInfo, limits } = useMst();
  const { getOwnerStatus, setProvider, getBalance } = useContractContext();
  const { openModal } = useModal();

  const loginUser = useCallback(
    async (address, isOwner) => {
      const RawTokenData = localStorage.getItem('bandmusic_token');
      const tokenData = RawTokenData ? JSON.parse(RawTokenData) : null;
      if (
        !tokenData ||
        !tokenData.lifetime ||
        new Date(tokenData.lifetime * 1000).getTime() < Date.now()
      ) {
        const msg = await login.getMsg();
        const signedMsg = await wcService.signMsg(address, msg.data);
        const loginData = await login.login(address, msg.data, signedMsg);
        if (loginData.data.key) {
          localStorage.setItem(
            'bandmusic_token',
            JSON.stringify({
              token: loginData.data.key,
              lifetime: +(Date.now() / 1000) + tokenLifeTime,
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
            address: line.username,
            saleType: line.sale_type,
            idx: `db${key}`,
            stage: key + 1,
          })),
        );
        const stats = await vesting.getStats();
        limits.setReserved(normalizeLimitsData(stats.data.reserved_by_types));
        limits.setClaimed(normalizeLimitsData(stats.data.claimed_by_types));
        limits.setLimits(normalizeLimitsData(stats.data.limits_by_types));
      } else {
        const rawClaims = await vesting.getData(address);
        const claims = rawClaims.data[0]?.claims
          .sort((f: any, s: any) => f.claimed_at - s.claimed_at)
          .map((claim: any, key: number) => ({
            ...claim,
            stage: key + 1,
          }));
        claimerInfo.setConfirmed(normalizeUserData(claims, 'Confirmed'));
        claimerInfo.setPending(normalizeUserData(claims, 'Pending'));
        claimerInfo.setWaiting(normalizeUserData(claims, 'Waiting'));
      }
    },
    [claimerInfo, limits, ownerInfo],
  );

  const clearLocalData = useCallback(() => {
    localStorage.removeItem('bandmusic_token');
    wcService.logOut();
    user.setUser({ address: '', balance: '' });
    user.setIsOwner(false);
    ownerInfo.setCurrentFiles({ name: '', content: cast([]) });
  }, [ownerInfo, user]);

  const disconnect = useCallback(() => {
    localStorage.removeItem('bandmusic-wallet');
    user.setProvider('');
    clearLocalData();
  }, [clearLocalData, user]);

  const onAccountChange = useCallback(
    async (address: string) => {
      clearLocalData();
      const isOwner = await getOwnerStatus(address);
      const logged = await loginUser(address, isOwner);
      if (logged) {
        await fetchUserData(address, isOwner);
      }
    },
    [clearLocalData, fetchUserData, getOwnerStatus, loginUser],
  );
  const connect = useCallback(
    async (wallet: TAvailableProviders) => {
      const connected = await wcService.initConnect(wallet);
      if (connected) {
        try {
          localStorage.setItem('bandmusic-wallet', wallet);
          user.setProvider(wallet);
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
