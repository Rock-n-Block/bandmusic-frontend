import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { AdminModal, Header, RouterManager } from '@/containers';


const App: FC = observer(() => {
  return (
    <>
      <AdminModal />
      <div className="main_wrapper">
        <div className="bg_wrapper">
          <div className="bg_ellipses" />
        </div>
        <div className="page_wrapper">
          <Header />
          <RouterManager />
        </div>
      </div>
    </>
  );
});
export default App;
