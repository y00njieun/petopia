import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../shared/axios/axios';
import { useDispatch } from 'react-redux';
import { setOrderUserId } from '../order/orderRedux/slice';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const processKakaoLogin = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      const code = new URL(window.location.href).searchParams.get('code');
      
      try {
        const response = await axiosInstance.post('/api/auth/kakao/callback', { code });
        console.log('카카오 로그인 응답:', response.data);

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem("userId", response.data.user.userId); // 추가
          localStorage.setItem('userType',"kakao");
          
          if (response.data.user?.userId) {
            console.log('카카오로그인', response.data.user);
            dispatch(setOrderUserId(response.data.user.userId));
            console.log("로그인 후 설정된 user_id", response.data.user.userId);
          }
          
          navigate('/');
        } else {
          console.error('토큰이 없습니다:', response.data);
          navigate('/login');
        }
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        navigate('/login');
      }
    };

    processKakaoLogin();
  }, [navigate, dispatch]);

  return (
    <div className="loading-container">
      <p>카카오 로그인 처리중...</p>
    </div>
  );
};

export default KakaoCallback; 