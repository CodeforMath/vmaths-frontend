import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, formData);
      alert("Đăng ký thành công! Mời bác đăng nhập.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng ký rồi bác ơi!");
    }
  };

  return (
    <div className="h-screen overflow-y-auto min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-32">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-black text-center text-slate-800 mb-8">ĐĂNG KÝ</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tên hiển thị</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#3FB8AF]"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#3FB8AF]"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#3FB8AF]"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-all">
            Tạo tài khoản
          </button>
        </form>
        <p className="mt-6 text-center text-slate-500 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-[#3FB8AF] font-bold">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;