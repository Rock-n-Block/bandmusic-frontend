import { ConnectWallet } from '@amfi/connect-wallet';
import { IError } from '@amfi/connect-wallet/dist/interface';
import Web3 from 'web3';

import { connectWalletConfig } from '@/config';
import { IWalletConnectService, TAvailableProviders, TUser } from '@/types';
import { logger } from '@/utils';

export class WalletConnect implements IWalletConnectService {
  private connectWallet: ConnectWallet;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public initConnect(wallet: TAvailableProviders): Promise<boolean> {
    return new Promise((resolve) => {
      const { provider, network, settings } = connectWalletConfig;
      const connecting = this.connectWallet
        .connect(provider[wallet], network, settings)
        .then((connected: any) => {
          return connected;
        })
        .catch((e: IError) => {
          console.error('initWalletConnect providerWallet err: ', e);
        });

      Promise.all([connecting]).then((connect: any) => {
        resolve(connect[0]);
      });
    });
  }

  public logOut(): void {
    this.connectWallet.resetConect();
  }

  public signMsg(address: string, msg: string) {
    return this.connectWallet.signMsg(address, msg);
  }

  public eventSubscribe(onAccountChange: (address: string) => void): void {
    this.connectWallet.eventSubscriber().subscribe(
      (data: any) => {
        if (data.name === 'accountsChanged') {
          onAccountChange(data.address);
        }
      },
      (error: any) => {
        if (error.code === 6) {
          setTimeout(() => window.location.reload(), 2000);
        }
        this.eventSubscribe(onAccountChange);
      },
    );
  }

  public Web3(): Web3 {
    return this.connectWallet.currentWeb3();
  }

  public getAccount(account: TUser): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.connectWallet.getAccounts().then(
        async (userAccount: any) => {
          if (!account || userAccount.address !== account.address) {
            resolve(userAccount);
          }
        },
        (err: any) => {
          if (err.code && err.code === 6) {
            logger('Account disconnected!', 'success');
          } else {
            logger('err', err, 'error');
            reject(err);
          }
        },
      );
    });
  }

  public getBalance(address: string): Promise<string | number> {
    return this.connectWallet.getBalance(address);
  }
}

export default new WalletConnect();
