import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from '@/App';
import rootStore, { Provider } from '@/store';

import '@/styles/index.scss';

const root = document.getElementById('root');
const app = (
  <Provider value={rootStore}>
    <Router>
      <App />
    </Router>
  </Provider>
);

ReactDOM.render(app, root);
