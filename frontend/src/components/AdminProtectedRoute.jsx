import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default AdminProtectedRoute;