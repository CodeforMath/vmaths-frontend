import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';

/**
 * Custom Hook để truy cập nhanh vào hệ thống quản lý người dùng
 * Giúp bác không cần import useContext và AuthContext ở mỗi file nữa.
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  // Kiểm tra xem bác đã bao bọc App bằng AuthProvider chưa
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong một AuthProvider bác nhé!');
  }

  return context;
};

export default useAuth;