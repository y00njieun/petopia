import { useNavigate } from 'react-router-dom';
import axios from '../shared/axios/axios';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (!localStorage.getItem('token')) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000 
    }}>
      <button
        onClick={handleLogout}
        style={{
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
    </div>
  );
};

export default LogoutButton;
