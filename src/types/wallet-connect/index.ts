import { TAvailableProviders, TUser } from "..";

export interface IWalletConnectService {
  initConnect(wallet: TAvailableProviders): Promise<boolean>;
  logOut(): void;
  getAccount(account: TUser): Promise<any>;
}