import OrderProduct from "./OrderProductInfo";
import "./Order.css"
import { OrderUser } from "../model/OrderModel";
import { useEffect } from "react";

const OrderInfo: React.FC<OrderUser> = ({userId}) => {

  useEffect(() => {
    if (userId) {
      console.log('OrderInfo.tsx userId 변경 감지:', userId);  // userId가 변경된 후 실행
    }
  }, [userId]);

  return (
    <div className="infoContainer">
      <div className="title">주문 상품 정보</div>
      <div className="midInfo"><OrderProduct userId={userId}/></div>
      
    </div>

  )
}

export default OrderInfo;