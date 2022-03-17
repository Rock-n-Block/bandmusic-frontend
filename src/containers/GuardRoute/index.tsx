import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useMst } from '@/store';

export const requirements = {
  isOwner: ({ isOwner }: { isOwner: boolean }) => isOwner,
} as const;

export type TRequirements = keyof typeof requirements;

interface IGuardRoute {
  children: ReactElement | null;
  require: TRequirements[];
}

const GuardRoute: FC<IGuardRoute> = ({ children, require }) => {
  const { isOwner } = useMst().user;
  if (require.every((req) => requirements[req]({ isOwner }))) {
    return children;
  }
  return <Navigate to="/" />;
};

export default GuardRoute;
