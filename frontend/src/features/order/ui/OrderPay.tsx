import { useState } from "react";
import OrderCouponPoint from "./OrderCouponPoint";
import "./OrderPay.css"
import OrderPrice from "./OrderPrice";
import { useSelector } from "react-redux";
import { selectOrderId } from "../../../pages/order/orderRedux/slice";
import { OrderPayProps } from "../model/OrderModel";
import { loadTossPayments } from "@tosspayments/payment-sdk";
// import { useNavigate } from "react-router-dom";

const OrderPay: React.FC<OrderPayProps> = ({userId, selectedAddress, selectedMessage}) => {
  const [points, setPoints] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const orderId = useSelector(selectOrderId);
  // const navigate = useNavigate();

  const handlePointChange = (newPoint: number) => {
    setPoints(newPoint);
  }

  const handleFinalPriceChange = (newFinalPrice: number) => {
    setFinalPrice(newFinalPrice);
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      alert("배송지를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);
      const encodedAddress = encodeURIComponent(JSON.stringify(selectedAddress));

      // 결제 요청
      await tossPayments.requestPayment("카드", {
        orderId: `${orderId}`,
        orderName: "구매 상품",
        amount: finalPrice,
        customerName: userId || '',
        successUrl: `${window.location.origin}/payments/success?orderId=${orderId}&address=${encodedAddress}&message=${encodeURIComponent(selectedMessage)}`,
        failUrl: `${window.location.origin}/payments/fail`,
      });

    } catch (error) {
      console.error('결제 처리 실패:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="orderPayContainer">
      <div className="orderPayTitle">결제 금액</div>
      <div className="orderCouponPoint">
        <OrderCouponPoint userId={userId} points={points} onPointsChange={handlePointChange}/>
      </div>
      <div className="orderPrice">
        <OrderPrice userId={userId} points={points} onFinalPriceChange={handleFinalPriceChange}/>
      </div>
      <div className="orderBtnContainer">
        <button className="orderBtn" onClick={handlePayment} disabled={isLoading}>
          결제하기
        </button>
      </div>
    </div>
  )
}

export default OrderPay;