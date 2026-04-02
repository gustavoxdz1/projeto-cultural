import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
  adminOnly?: boolean;
  redirectTo: string;
};

export function ProtectedRoute({ children, adminOnly = false, redirectTo }: ProtectedRouteProps) {
  const location = useLocation();
  const { isHydrated, user } = useAuth();

  if (!isHydrated) {
    return null;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to={redirectTo} />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
}
