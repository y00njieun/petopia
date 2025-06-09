import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FailModal from '../../shared/ui/FailModal';
import axiosInstance from '../../shared/axios/axios';
import "../login/Login.css";
import { useDispatch } from 'react-redux';  // useDispatch 훅 임포트
import { setOrderUserId } from '../order/orderRedux/slice';
 


// Define types for the form inputs
interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch();
  // State for form inputs
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  });

  // State for API call status
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 상태
  const [modalMessage, setModalMessage] = useState<string>(''); // 모달 메시지 저장

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        userId: form.username,
        password: form.password
      });

      if (response.data.success) {
        console.log('로그인 성공:', response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem("userId", response.data.user.userId);
        dispatch(setOrderUserId(response.data.user.userId));
        console.log("로그인 후 설정된 user_id", response.data.user.userId);
        navigate('/');
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '로그인에 실패했습니다.';
      setModalMessage(errorMessage);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    
    window.location.href = kakaoURL;
  };

  return (
    <div className="l_container">
      <h1 className="l_title">PETOPIA"</h1>
      <h2 className="l_subtitle">로그인</h2>
      <div className="l_box">
        {showModal && (
          <FailModal
            title="로그인 실패"
            message={modalMessage}
            icon="src/assets/Fail.png"
            onClose={() => setShowModal(false)} // 모달 닫기
          />
        )}
        <form className="l_form" onSubmit={handleSubmit}>
          <input
            className="l_input"
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleInputChange}
          />
          <input
            className="l_input"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleInputChange}
          />
          <button className="l_button" type="submit" disabled={loading}>
            {loading ? '로딩 중...' : '로그인'}
          </button>
        </form>
        
        <button 
          className="l_kakao-button"
          onClick={handleKakaoLogin}
          type="button"
        >
          카카오로 간편 로그인/가입
        </button>

        <div className="l_links">
          <a className="l_link" onClick={() => navigate('/find-account')} style={{ cursor: 'pointer' }}>아이디/비밀번호 찾기</a>
          <a className="l_link" onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
