import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/use-auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy đường dẫn trước đó người dùng định vào, nếu không có thì về trang chủ
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <div className="h-screen overflow-y-auto min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-32">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-black text-center text-slate-800 mb-8">ĐĂNG NHẬP</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3FB8AF] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3FB8AF] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#3FB8AF] text-white py-3 rounded-xl font-bold hover:bg-[#34a39a] transition-all shadow-lg shadow-teal-100">
            Vào hệ thống
          </button>
        </form>
        <p className="mt-6 text-center text-slate-500 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-[#3FB8AF] font-bold">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;