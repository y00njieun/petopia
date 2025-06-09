import OrderInfo from "../../features/order/ui/Order";
import OrderDeliveryInfo from "../../features/order/ui/OrderDeliveryInfo";
import OrderPay from "../../features/order/ui/OrderPay";
import Footer from "../../widgets/footer/Footer";
import "./Order.css"
import { useSelector } from "react-redux";
import { RootState } from "./orderRedux/store";
import { useState } from "react";
import { UserAddressInfo } from "../../features/order/model/OrderModel";
import Header from "../../widgets/header/Header";

const Order: React.FC = () => {
  const userId = useSelector((state: RootState)=>state.order.user_id);
  const [selectedAddress, setSelectedAddress] = useState<UserAddressInfo | null>(null);
  const [selectedMessage, setSelectedMessage] = useState('');

  const handleAddressChange = (address: UserAddressInfo) => {
    setSelectedAddress(address);
  }

  const handleMessageChange = (message: string) => {
    setSelectedMessage(message);
  }

  return (
    <div className="mainContainer">
      <header>
        <Header />
      </header>
      <body className="bodyContainer">
        <div className="orderContainer">
          <div className="orderLeft">
            <div className="productInfo"><OrderInfo userId={userId}/></div>
            <div className="deliveryInfo">
              <OrderDeliveryInfo 
                userId={userId} 
                addressChange={handleAddressChange} 
                messageChange={handleMessageChange}
              />
            </div>
            <div className="payChoice"></div>
          </div>
          <div className="orderRight">
            <div className="orderPrice">
              <OrderPay 
                userId={userId} 
                selectedAddress={selectedAddress} 
                selectedMessage={selectedMessage}
              />
            </div>
          </div>
        </div>
      </body>
      <footer><Footer/></footer>
    </div>
  )
}

export default Order;