import { useEffect, useState } from "react";
import "./OrderDeliveryInfo.css"
import OrderDeliveryModal from "./OrderDeliveryModal";
import axiosInstance from "../../../shared/axios/axios";
import {Common, DeliveryForm, OrderDeliveryInfoProps, UserAddressInfo} from "../model/OrderModel";
import { fetchDeliveryMessage, fetchDetailsAddress } from "../api/Order";

const OrderDeliveryInfo: React.FC<OrderDeliveryInfoProps> = ({userId, addressChange, messageChange}) => {

  const [deliveryMessage, setDeliveryMessage] = useState<Common[]>([]);
  const [messageForm, setMessageForm] = useState<DeliveryForm>({delivery_message_id: 0, description: '배송 메시지를 선택해 주세요.'});
  // const [userAddress, setUserAddress] = useState<UserAddressInfo[]>([]);
  const [userAddressDetails, setUserAddressDetails] = useState<UserAddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddressInfo|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getUserAddress = async() => {
      try {
        console.log('🚀 getUserAddress 실행됨');
        console.log('프론트 주문 배송지 유저', userId);
        const addressDetails = await fetchDetailsAddress(userId);
        console.log('주소 데이터 상세 확인:', JSON.stringify(addressDetails, null, 2));
        
        if (addressDetails && Array.isArray(addressDetails)) {
          setUserAddressDetails(addressDetails);

          const defaultAddress = addressDetails.find(addr => addr.is_default);
          if (defaultAddress) {
            console.log('origin default address', defaultAddress);
            setSelectedAddress(defaultAddress);
            addressChange(defaultAddress);
            console.log('Selected default address', defaultAddress);
          }
        } else {
          setUserAddressDetails([]);
        }
        setIsLoading(false);
      } catch(err) {
        console.error('에러 상세:', err);
        setUserAddressDetails([]);
        setIsLoading(false);
      }
    };
    
    if (userId) {
      getUserAddress();
    }
  }, [userId]);

  useEffect(() => {
    console.log('Selected address changed:', selectedAddress);
  }, [selectedAddress]);

  useEffect(()=>{
    const getDeliveryMessage = async() => {
      try{
        const data = await fetchDeliveryMessage();
        if(data && data.length > 0){
          setDeliveryMessage(data);
        }
        console.log("배송 메시지: ", data);
      } catch(err){
        console.error('배송 메시지를 불러오지 못했습니다.', err);
      }
    };
    getDeliveryMessage();
  },[]);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await axiosInstance.get<Common[]>('/api/Orders/DeliveryMessage');
        setDeliveryMessage(response.data);
      } catch (err){
        console.error('상태 데이터를 불러오는 데 실패했습니다.',err);
      }
    };
    
    fetchDelivery();
  },[]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setMessageForm((prev) => ({
      ...prev,
      description: value,
      [name] : value,
    }))
    messageChange(value);
  };

  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };

  const handleAddressChange = (address: UserAddressInfo) => {
    setSelectedAddress(address);
    addressChange(address);
  };

  const handleNewAddress = (newAddress: UserAddressInfo) => {
    setUserAddressDetails((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    addressChange(newAddress);
  }

  const handleUpdateAddress = (updatedAddress: UserAddressInfo) => {
    console.log('주소 업데이트 전:', {
      current: userAddressDetails,
      updated: updatedAddress
    });

    if (!updatedAddress || !updatedAddress.address_id) {
      console.error('유효하지 않은 주소 데이터:', updatedAddress);
      return;
    }

    const updatedList = userAddressDetails.map(addr => {
      if (addr.address_id === updatedAddress.address_id) {
        return {
          ...updatedAddress,
          address_id: addr.address_id,
          postal_code: updatedAddress.postal_code || addr.postal_code,
        };
      }
      return addr;
    });

    console.log('주소 업데이트 후:', {
      updatedList,
      selectedAddress: updatedAddress
    });

    setUserAddressDetails(updatedList);
    setSelectedAddress(updatedAddress);
    addressChange(updatedAddress);
  };

  if (isLoading) {
    return <div>배송지 정보를 불러오는 중...</div>;
  }

  if (!userAddressDetails || userAddressDetails.length === 0) {
    return <div>등록된 배송지가 없습니다.</div>;
  }

  return (
    <div className="orderDeliveryContainer">
      <div className="orderDeliveryTitle">
        배송 정보
      </div>
      <div className="orderDeliveryBody">
        <div className="deliveryInfo">
          {selectedAddress && (
            <>
              <div className="recipient">{selectedAddress.recipient_name}</div>
              <div className="addressBody">
                <div className="address">
                  {selectedAddress.postal_code && <span>[{selectedAddress.postal_code}] </span>}
                  {selectedAddress.address}
                  {selectedAddress.detailed_address && ` ${selectedAddress.detailed_address}`}
                </div>
                <button className="deliveryChange" onClick={openModal}>배송지 변경</button>
              </div>
              <div className="phoneNumber">{selectedAddress.recipient_phone}</div>
            </>
          )}
          <OrderDeliveryModal 
            open={modalOpen} 
            close={closeModal} 
            header="배송지 선택" 
            userAddressDetails={userAddressDetails || []}
            onSelect={handleAddressChange}
            onNewAddress={handleNewAddress}
            onUpdateAddress={handleUpdateAddress}
            />
        </div>
        <div className="deliveryRequest">
          <div className="requestTitle">배송 요청사항</div>
          <div className="requestToggle">
            <select 
              name="messageStatus" 
              value={messageForm.description} 
              onChange={handleMessageChange}
              aria-label="배송 요청사항 선택"
            >
              <option value="" className="optionText">배송 메시지를 선택해 주세요</option>
              {deliveryMessage.map((status) => (
                <option key={status.status_code} value={status.description}>
                  {status.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDeliveryInfo;