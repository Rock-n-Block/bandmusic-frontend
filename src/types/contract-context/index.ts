import Web3 from "web3";

export interface IContractContext {
  getBalance: (address: string, isOwner?: boolean) => Promise<string>;
  getOwnerStatus: (address: string) => Promise<boolean>;
  getAllowance: (from: string, to: string) => Promise<string>;
  sendApprove: (spender: string, amount: string, address: string) => Promise<boolean>;
  claimTokens: (
    amount: string[],
    timestamp: string[],
    signature: string[],
    address: string,
  ) => Promise<any>;
  sendTransfer: (to: string, amount: string, address: string) => Promise<any>;
  setProvider: (newWeb: Web3) => void;
}
