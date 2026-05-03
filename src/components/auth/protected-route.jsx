import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/use-auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-center">Đang kiểm tra quyền truy cập...</div>;
  }

  // Nếu chưa đăng nhập, đá về trang login và lưu lại vị trí đang định vào (from)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu yêu cầu vai trò cụ thể (ví dụ: admin) mà user không có quyền
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;