import { TAvailableProviders } from "..";

export interface IWalletConnectContext {
  connect: (wallet: TAvailableProviders) => any;
  disconnect: () => void;
  fetchUserData: (address: string, status: boolean) => void;
}
