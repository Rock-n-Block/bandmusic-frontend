export * from './store';
export * from './wallet-connect';
export * from './config';
export * from './contract-context';
export * from './wallet-context';
export * from './components';

export type TNullable<T> = T | null;
export type TOptionable<T> = T | undefined;

export interface IModalProps {
  className?: string;
  visible: boolean;
  onClose: () => void;
}
