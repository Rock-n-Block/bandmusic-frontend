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
    name: 'Admin',
    path: '/admin',
    component: <Admin />,
    require: ['isOwner'],
  },
  {
    name: 'Limits',
    path: '/admin/limits',
    component: <Limits />,
    require: ['isOwner'],
  },
];
