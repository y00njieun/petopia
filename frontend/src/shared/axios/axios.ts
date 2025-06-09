import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // CORS 요청에 쿠키 포함
});

// 요청 인터셉터: 인증 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰에 Bearer 접두사 한 번만 추가
      config.headers.Authorization = `Bearer ${token.replace(/^Bearer\s+/g, '')}`;
      console.log('요청 헤더의 토큰:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_CONNECTION_REFUSED') {
      console.error('서버 연결 실패. 서버가 실행 중인지 확인해주세요.');
    }
    if (error.response?.status === 401) {
      console.error('인증 에러:', error.response.data);
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;