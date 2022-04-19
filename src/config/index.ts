import { chainsEnum, IChainConfig, IConnectWallet, IContracts } from '@/types';

import { TokenAbi, VestingAbi } from './abi';

export const isProduction = true;

export const showLogs = false;

export const chain: IChainConfig = {
  name: isProduction ? 'Ethereum Mainnet' : 'Kovan Testnet',
  id: isProduction ? 1 : 42,
  rpc: isProduction
    ? 'https://mainnet.infura.io/v3/39f3248e472f49409ac0c8151782c2dc'
    : 'https://kovan.infura.io/v3/39f3248e472f49409ac0c8151782c2dc',
  tx: {
    link: isProduction ? '' : '',
  },
  nativeCurrency: {
    name: isProduction ? 'ETH' : 'ETH',
    symbol: isProduction ? 'ETH' : 'ETH',
    decimals: 18,
  },
  blockExp: isProduction ? 'https://etherscan.io/' : 'https://kovan.etherscan.io/',
};

export const connectWalletConfig: IConnectWallet = {
  wallets: ['MetaMask', 'WalletConnect'],
  network: {
    chainName: chain.name,
    chainID: chain.id,
    nativeCurrency: chain.nativeCurrency,
    rpc: chain.rpc,
    blockExplorerUrl: chain.blockExp,
  },
  provider: {
    MetaMask: { name: 'MetaMask' },
    WalletConnect: {
      name: 'WalletConnect',
      useProvider: 'rpc',
      provider: {
        rpc: {
          rpc: {
            [isProduction ? 1 : 42]: isProduction
              ? 'https://mainnet.infura.io/v3/39f3248e472f49409ac0c8151782c2dc'
              : 'https://kovan.infura.io/v3/39f3248e472f49409ac0c8151782c2dc',
          },
          chainId: isProduction ? 1 : 42,
        },
      },
    },
  },
};

/**
 *
 * @param {chainsEnum} chainName - name of the chain name
 * @returns config for connection wallet which includes
 * * wallets
 * * network
 * * provider
 * * settings
 */
export const getConnectWalletConfig = (chainName: chainsEnum): IConnectWallet => {
  return {
    wallets: connectWalletConfig.wallets,
    network: connectWalletConfig.network,
    provider: connectWalletConfig.provider,
    settings: { providerType: true },
  };
};

export const contracts: IContracts = {
  type: isProduction ? 'mainnet' : 'testnet',
  names: ['VESTING', 'TOKEN'],
  params: {
    VESTING: {
      mainnet: {
        address: '0xF250357B9dB9748555daa5c4617Ff5fc186E2003',
        abi: VestingAbi,
      },
      testnet: {
        address: '0xbafB6B6F7b96e4fc6517D8687181340Bd62e5e55',
        abi: VestingAbi,
      },
    },
    TOKEN: {
      mainnet: {
        address: '0x56ff962f6eD95Db6fee659Abca15d183527405E4',
        abi: TokenAbi,
      },
      testnet: {
        address: '0xB8345f0eBE4AFc1fc49C9825d7a57CF322a915eD',
        abi: TokenAbi,
      },
    },
  },
};
