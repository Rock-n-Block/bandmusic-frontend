import { ReactElement } from 'react';

import { TRequirements } from '@/containers/GuardRoute';
import { Admin, Home, Limits } from '@/pages';

type TSingleRoute = {
  name: string;
  path: string;
  component: ReactElement;
  require: TRequirements[];
};

export const routes: TSingleRoute[] = [
  {
    name: 'Home',
    path: '/',
    component: <Home />,
    require: [],
  },
  {
    name: 'Limits',
    path: '/limits',
    component: <Limits />,
    require: ['isOwner'],
  },
  {
    name: 'Admin',
    path: '/admin',
    component: <Admin />,
    require: ['isOwner'],
  },
];
