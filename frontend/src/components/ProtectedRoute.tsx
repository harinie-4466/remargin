
import { Navigate, Outlet } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

export const ProtectedRoute = () => {
  const { user, setupComplete } = useAppData();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user && !setupComplete) {
    return <Navigate to="/setup" replace />;
  }

  return <Outlet />;
};
