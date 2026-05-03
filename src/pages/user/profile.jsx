import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/use-auth'; 
import { updateProfile } from '../../api/user-service'; 
import StreakDisplay from '../../components/user/streak-display';
import BadgeCard from '../../components/user/badge-card';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        grade: '',
        bio: '',
        avatar: ''
    });
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra kích thước (nên giới hạn < 1MB vì mình lưu trực tiếp vào DB)
            if (file.size > 1024 * 1024) {
            alert("Ảnh nặng quá bác ơi, chọn cái nào dưới 1MB nhé!");
            return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
            // Chuỗi Base64 sẽ nằm ở reader.result
            setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
        };
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                grade: user.grade || '',
                bio: user.bio || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await updateProfile(formData);
            if (typeof setUser === 'function') {
                setUser(response.data); 
            }
            setIsEditing(false);
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-10 text-center font-bold">Đang tải thông tin...</div>;

    return (
        <div className="max-w-4xl mx-auto my-10 p-4 pt-20 font-sans">
            <div className="bg-white shadow-2xl rounded-[2rem] overflow-hidden">
                {/* Banner & Avatar */}
                <div className="h-40 bg-gradient-to-r from-green-400 to-blue-500 relative">
                    <div className="absolute -bottom-14 left-10 group">
                        <input 
                            type="file" 
                            id="avatarInput" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleAvatarChange}
                            disabled={!isEditing} 
                        />
                        <label 
                            htmlFor="avatarInput" 
                            className={`relative block ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            <img 
                            src={formData.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`} 
                            className="w-32 h-32 rounded-3xl border-4 border-white bg-white object-cover shadow-lg group-hover:opacity-90 transition-opacity"
                            alt="avatar"
                            />
                            {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-lg">ĐỔI ẢNH</span>
                            </div>
                            )}
                        </label>
                    </div>
                </div>

                <div className="pt-20 px-6 md:px-10 pb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 uppercase italic leading-none">
                                {user.username}
                            </h1>
                            <p className="text-green-500 font-bold text-xs tracking-widest mt-1">
                                {user?.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 'HỌC VIÊN'} V-MATHS
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {/* --- THEO DÕI STREAK --- */}
                            {user.role !== 'admin' && (
                                <div className="hidden sm:block">
                                    <StreakDisplay streak={user.streak} />
                                </div>
                            )}

                            <button 
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                disabled={loading}
                                className={`${isEditing ? 'bg-green-500' : 'bg-slate-800'} text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:scale-105 flex-1 md:flex-none shadow-lg shadow-slate-200`}
                            >
                                {loading ? "ĐANG LƯU..." : (isEditing ? "XÁC NHẬN" : "SỬA HỒ SƠ")}
                            </button>
                        </div>
                    </div>

                    {/* Grid thông tin */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Tên hiển thị</label>
                            <input 
                                className={`w-full p-4 rounded-2xl border-2 transition-all font-bold ${isEditing ? 'border-green-200 bg-white' : 'border-transparent bg-slate-50'}`}
                                disabled={!isEditing}
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Khối lớp</label>
                            <select 
                                className={`w-full p-4 rounded-2xl border-2 transition-all font-bold ${isEditing ? 'border-green-200 bg-white' : 'border-transparent bg-slate-50'}`}
                                disabled={!isEditing}
                                value={formData.grade}
                                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                            >
                                <option value="">Chưa chọn</option>
                                <option value="10">Lớp 10</option>
                                <option value="11">Lớp 11</option>
                                <option value="12">Lớp 12</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Giới thiệu bản thân</label>
                            <textarea 
                                className={`w-full p-4 rounded-2xl border-2 transition-all ${isEditing ? 'border-green-200 bg-white' : 'border-transparent bg-slate-50'}`}
                                disabled={!isEditing}
                                rows="3"
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                placeholder="Hãy nói gì đó về niềm đam mê toán học của bạn..."
                            />
                        </div>
                    </div>

                    {/* --- PHẦN HUY HIỆU & THỐNG KÊ --- */}
                    <div className="mt-10 pt-10 border-t border-slate-100">
                        <BadgeCard badges={user.badges} />
                        
                        <div className="mt-8 flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Thành viên từ: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Mới tham gia'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;