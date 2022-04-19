import { VFC } from 'react';

import { ReactComponent as LoaderSVG } from '@/assets/img/icons/loader.svg';

import s from './styles.module.scss';

interface ILoader {
  className?: string;
}

const Loader: VFC<ILoader> = ({ className }) => {
  return <LoaderSVG className={`${className} ${s.loader}`} />;
};

export default Loader;