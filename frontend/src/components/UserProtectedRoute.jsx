import { Navigate, Outlet } from 'react-router-dom';

const UserProtectedRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return userInfo ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default UserProtectedRoute;