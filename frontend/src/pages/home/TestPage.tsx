import { Link, useNavigate } from "react-router-dom";
import axios from '../../shared/axios/axios';
import "./TestPage.css"

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // /api 추가
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 3. axios 인스턴스의 헤더에서 토큰 제거 (선택적)
      axios.defaults.headers.common['Authorization'] = '';
      
      // 4. 로그인 페이지로 리다이렉트
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생하더라도 로컬 데이터는 삭제하고 로그인 페이지로 이동
      localStorage.clear();
      navigate('/login');
    }
  };

  // 로그인 상태 확인
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="test-container">
      <div className="header">
        {isLoggedIn && (
          <button 
            onClick={handleLogout}
            className="logout-button"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '8px 16px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            로그아웃
          </button>
        )}
      </div>
      <div className="home-btn">
        테스트 페이지 입니다.
        <button>
          <Link to={'/main'}>메인 페이지</Link>
        </button>
        <button>
          <Link to={'/login'}>로그인 페이지</Link>
        </button>
        <button>
          <Link to={'/mypage'}>마이 페이지</Link>
        </button>
        <button>
          <Link to={'/cart'}>장바구니 페이지</Link>
        </button>
        <button>
          <Link to={'/order'}>주문 페이지</Link>
        </button>
        <button>
          <Link to={'/payments'}>결제 페이지</Link>
        </button>
        <button>
          <Link to={'/ProductCreate'}>상품 등록 페이지</Link>
        </button>
        {/* <button>
          <Link to={'/ProductDetail'}>상품 상세 페이지(상품전체페이지에서 클릭해서 들어가야함)</Link>
        </button> */}
        <button>
          <Link to={'/ProductList'}>상품 전체 페이지</Link>
        </button>
        <button>
          <Link to={'/WishList'}>위시리스트</Link>
        </button>
        <button>
          <Link to={'/MProduct'}>상품 관리 페이지</Link>
        </button>
      </div>
    </div>
  );
};

export default TestPage;