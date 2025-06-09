import React, { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

interface PaymentProps {
  orderData?: {
    orderId: string;
    orderName: string;
    amount: number;
    customerName: string;
  };
}

const Payment: React.FC<PaymentProps> = ({ orderData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);
      
      // 테스트용 주문 데이터
      const paymentData = orderData || {
        orderId: `ORDER_${Date.now()}`,
        orderName: '테스트 상품',
        amount: 100,
        customerName: '테스트 고객',
      };

      await tossPayments.requestPayment('카드', {
        ...paymentData,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
      });
    } catch (error) {
      console.error('결제 요청 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>결제 페이지</h2>
      <div className="payment-info">
        <h3>주문 정보</h3>
        <p>주문번호: {orderData?.orderId || '테스트 주문'}</p>
        <p>상품명: {orderData?.orderName || '테스트 상품'}</p>
        <p>결제금액: {orderData?.amount?.toLocaleString() || '100'}원</p>
      </div>
      <button 
        onClick={handlePayment} 
        disabled={isLoading}
        className="payment-button"
      >
        {isLoading ? '결제 처리 중...' : '결제하기'}
      </button>
    </div>
  );
};

export default Payment;