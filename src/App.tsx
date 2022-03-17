import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';

import { AdminModal, Header, RouterManager } from '@/containers';

import { useMst } from './store';

const App: FC = observer(() => {
  const { address } = useMst().user;
  const navigator = useNavigate();
  useEffect(() => {
    if (address.length === 0) {
      navigator('/');
    }
  }, [address.length, navigator]);
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
