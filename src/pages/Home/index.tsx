import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import s from './Home.module.scss';

const Home: FC = observer(() => {
  return (
    <div className={s.home_wrapper}>
      Home
    </div>
  );
});
export default Home;
