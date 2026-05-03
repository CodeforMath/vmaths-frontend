import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../api/api-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra xem người dùng đã đăng nhập chưa khi vừa mở web
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Gửi token lên backend để lấy lại thông tin user
          const res = await apiClient.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Gửi request đăng nhập lên Backend
      const res = await apiClient.post('/auth/login', { email, password });
      
      // 2. Nếu thành công, Backend sẽ trả về { token, user }
      const { token, user } = res.data;
      
      // 3. Lưu Token vào LocalStorage để lần sau vào web không phải login lại
      localStorage.setItem('token', token);
      
      // 4. Cập nhật thông tin user vào State để Navbar hiển thị tên
      setUser(user);
      
      return { success: true };
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      // Bắn lỗi ra để trang Login.jsx có thể alert cho bác biết
      throw new Error(err.response?.data?.message || "Sai email hoặc mật khẩu!");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};