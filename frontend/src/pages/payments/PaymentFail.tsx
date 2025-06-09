import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentFail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get('message');
  const code = searchParams.get('code');

  return (
    <div className="payment-fail">
      <h2>결제 실패</h2>
      <p>사유: {message || '알 수 없는 오류가 발생했습니다.'}</p>
      <p>에러 코드: {code}</p>
      <button onClick={() => navigate('/payments')}>
        다시 시도하기
      </button>
    </div>
  );
};

export default PaymentFail; 