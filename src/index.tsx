import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from '@/App';
import rootStore, { Provider } from '@/store';

import { ContractProvider, WalletConnectProvider } from './context';
import { combineProviders } from './utils';

import '@/styles/index.scss';

const root = document.getElementById('root');
const CombinedProviders = combineProviders([
  WalletConnectProvider,
  ContractProvider,
  Router,
  [Provider, { value: rootStore }],
]);
const app = (
  <CombinedProviders>
    <App />
  </CombinedProviders>
);

ReactDOM.render(app, root);
