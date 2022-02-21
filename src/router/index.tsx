import { Admin, Home } from '@/pages';

export const routes = [
  {
    name: 'Home',
    path: '/',
    component: <Home />,
  },
  {
    name: 'Admin',
    path: '/admin',
    component: <Admin />,
  },
];