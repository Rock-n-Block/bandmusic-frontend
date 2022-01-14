import { FC } from 'react';

import { Header, RouterManager } from '@/containers';

const App: FC = () => {
  return (
    <div className="main_wrapper">
      <div className="page_wrapper">
        <Header />
        <RouterManager />
      </div>
    </div>
  );
};
export default App;
