import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import './OrderComplete.css';
import axiosInstance from '../../shared/axios/axios';

interface OrderCompleteState {
  orderId: string;
  orderInfo: {
    total_amount: number;
    items: Array<{
      product_name: string;
      quantity: number;
      price: number;
      selected_size?: string;
      selected_color?: string;
    }>;
    delivery_info: {
      recipient_name: string;
      address: string;
      detailed_address: string;
      recipient_phone: string;
    };
  };
}

const OrderComplete: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderCompleteState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderId = location.state?.orderId;
        if (!orderId) {
          navigate('/');
          return;
        }

        // 백엔드에서 주문 정보 조회
        const response = await axiosInstance.get(`/api/orders/${orderId}`);
        if (response.data.success) {
          setOrderData(response.data.order);
        } else {
          throw new Error('주문 정보를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('주문 정보 조회 실패:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [location.state, navigate]);

  if (isLoading) {
    return <div>주문 정보를 불러오는 중...</div>;
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="order-complete-container">
      <Header />
      <div className="order-complete-content">
        <div className="order-complete-header">
          <h1>주문이 완료되었습니다</h1>
          <p className="order-number">주문번호: {orderData.orderId}</p>
        </div>

        <div className="order-info-section">
          <h2 className='order-info-title'>주문 상품 정보</h2>
          <div className="order-items">
            {orderData.orderInfo.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <p className="item-name">{item.product_name}</p>
                  <p className="item-quantity">수량: {item.quantity}개</p>
                  <p className="item-price">{item.price.toLocaleString()}원</p>
                  {item.selected_size && (
                    <p className="item-option">사이즈: {item.selected_size}</p>
                  )}
                  {item.selected_color && (
                    <p className="item-option">색상: {item.selected_color}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="delivery-info-section">
          <h2 className='delivery-info-title'>배송 정보</h2>
          <div className="delivery-details">
            <p>받는 분: {orderData.orderInfo.delivery_info.recipient_name}</p>
            <p>주소: {orderData.orderInfo.delivery_info.address} {orderData.orderInfo.delivery_info.detailed_address}</p>
            <p>연락처: {orderData.orderInfo.delivery_info.recipient_phone}</p>
          </div>
        </div>

        <div className="payment-info-section">
          <h2 className='payment-info-title'>결제 정보</h2>
          <div className="payment-details">
            <p className="total-amount">
              총 결제금액: {orderData.orderInfo.total_amount.toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="order-complete-actions">
          <button 
            className="check-order-button"
            onClick={() => navigate('/mypage')}
          >
            주문 내역 확인
          </button>
          <button 
            className="continue-shopping-button"
            onClick={() => navigate('/')}
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderComplete; 