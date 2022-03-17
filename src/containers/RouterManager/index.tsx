import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { routes } from '@/router';

import { GuardRoute } from '..';

const RouteManager: FC = () => {
  const router = routes.map((route) => {
    return (
      <Route
        key={route.name}
        path={route.path}
        element={<GuardRoute require={route.require}>{route.component}</GuardRoute>}
      />
    );
  });
  return <Routes>{router}</Routes>;
};

export default RouteManager;
