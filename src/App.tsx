import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';

import { AdminModal, Header, RouterManager } from '@/containers';

import { useMst } from './store';

const App: FC = observer(() => {
  const { isOwner, address } = useMst().user;
  const navigate = useNavigate();

  useEffect(() => {
    if (isOwner && address) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }, [address, isOwner, navigate]);

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
