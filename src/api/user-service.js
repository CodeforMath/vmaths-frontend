import apiClient from './api-client'; // Đường dẫn tới file bác vừa gửi

// Cập nhật thông tin cá nhân (Tên, lớp, bio...)
export const updateProfile = (data) => apiClient.put('/auth/update-profile', data);

// Lấy thông tin chi tiết của mình
export const getMe = () => apiClient.get('/auth/me');

// Đánh dấu hoàn thành bài học và cộng điểm
export const completeLesson = (lessonId, score) => 
    apiClient.post('/progress/complete-lesson', { lessonId, score });

// Lấy danh sách lịch sử học tập
export const getMyProgress = () => apiClient.get('/progress/my-progress');