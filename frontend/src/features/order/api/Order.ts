import axiosInstance from "../../../shared/axios/axios";
import { OrderProducts, OrderShippingFee, UserAddressFormInfo, UserAddressInfo } from "../model/OrderModel";

//사용자 포인트 가져오기
export const fetchUserPoints = async(userId: string | null | undefined) => {
  try{
    const response = await axiosInstance.get(`/api/orders/UserPoints/${userId}`);
    return response.data;
  } catch(err){
    console.error('사용자의 포인트를 가져오지 못했습니다.', err);
  }
};

//배송메시지 가져오기
export const fetchDeliveryMessage = async () => {
  try{
    const response = await axiosInstance.get('/api/orders/DeliveryMessage');
    console.log("res: ",response.data);
    return response.data;
  } catch(err){
    console.error('배송 메시지를 불러오지 못했습니다.', err);
  }
};

//배송지 추가
export const fetchAddAddress = async(addressData: UserAddressFormInfo) =>{
  try{
    console.log('[주문페이지] 새배송지 주소', addressData);
    const response = await axiosInstance.post('/api/addresses', addressData);
    if (response.status === 200) {
      console.log('[주문페이지] 새 배송지를 추가했습니다.', response.data);
      // return response.data;
      return {
        success: response.data.success,
        message: response.data.message,
        newAddress: addressData  // 새 주소 데이터를 포함시킴
      };
    } else {
      console.error('[서버 응답 오류]', response.status);
      throw new Error('주소 추가에 실패했습니다.');
    }
  } catch(err){
    console.error('[주문페이지] 배송지 추가 실패', err);
  }
};

//배송지 정보 가져오기
export const fetchAddress = async(userId: string | null | undefined) => {
  try{
    console.log('fetchAddress 실행됨 userId', userId);
    const response = await axiosInstance.get<UserAddressInfo[]>(`/api/orders/UserAddress/${userId}`);
    console.log("프론트 address response: ", response.data);
    console.log("프론트 address response: ", response.status);
    return response.data;
  } catch(err){
    console.error('배송지 정보를 가져오지 못했습니다.', err);
    return null;
  }
};

//배송지 상세 리스트 정보 가져오기
export const fetchDetailsAddress = async(userId: string | null | undefined) => {
  try{
    console.log('주소 userId', userId);
    const response = await axiosInstance.get<UserAddressInfo[]>(`/api/orders/UserDetailsAddress/${userId}`);
    console.log("DetailsAddress response: ", response.data);
    return response.data;
  } catch(err){
    console.error('배송지 상세 리스트 정보를 가져오지 못했습니다.', err);
  }
};

//주문 제품 정보 가져오기
export const fetchOrderProducts = async(userId: string | null | undefined, orderType: string, selectedProductIds: number[], orderId: string) => {
  try{
    console.log('[카카오] 주문 제품 정보', userId, orderType,selectedProductIds, orderId);
        // selectedProductIds가 비어있는지 확인
        if (selectedProductIds.length === 0) {
          console.error('선택된 상품 아이디가 없습니다.');
          return;  // selectedProductIds가 비어있으면 함수 종료
        }
    const productIdsParam = selectedProductIds.join(","); // 예: 1,2,3
        
    const response = await axiosInstance.get<OrderProducts[]>(`/api/orders/OrderProducts/${userId}?type=${orderType}&orderId=${orderId}&productId=${productIdsParam}`);
    console.log('Request URL:', response);
    console.log('orderProductInfo: ',  response.data);
    return response.data;
  } catch(err){
    console.error('주문 제품 정보를 가져오지 못했습니다.', err);
  }
};

//주문 제품 이미지 가져오기
export const fetchOrderProductImage = async(product_id: number) => {
  try{
    const response = await axiosInstance.get<{main_image: string}>(`/api/${product_id}`);
    if(response.data && response.data.main_image){
      return response.data.main_image;
    }
    console.log('이미지데이터' , response.data.main_image);
    // return response.data;
  } catch(err){
    console.error('상품 이미지 데티어 조회 실패', err);
    throw err;
  }
}

//배송비 정보 가져오기
export const fetchShippingFee = async(userId: string | null | undefined) => {
  try{
    console.log('fetchShoppingFee 유저 아이디',userId);
    const response = await axiosInstance.get<OrderShippingFee[]>(`/api/orders/OrderShippingFee/${userId}`);
    console.log('APIshippingFee: ',response);
    console.log('APIshippingFee: ',response.data);
    return response.data;
  } catch(err){
    console.error('배송비 정보를 가져오지 못했습니다.', err);
  }
};

export const fetchUpdateInfo = async(order_id: string) => {
  try{
    console.log('[프론트] fetchUpdateInfo 요청 데이터', order_id);
    const response = await axiosInstance.put('/api/orders/OrderInfoUpdate', {
      order_id
    });
    return response.data;
  } catch(err){
    console.error('결제 요청 실패', err);
  }
}

export const fetchInsertDelivery = async(order_id: string, selectedAddress: UserAddressInfo | null,  selectedMessage: string) => {
  try{
    console.log('[프론트] fetchInsertDelivery 요청 데이터', order_id, selectedAddress, selectedMessage)
    const response = await axiosInstance.post('/api/orders/OrderInfoUpdate', {
      order_id,
      selectedAddress,
      selectedMessage
    });
    return response.data;
  } catch(err){
    console.error('결제 요청 실패', err);
  }
}

// 배송지 수정 API 추가
export const updateAddress = async (addressId: number, addressData: UserAddressFormInfo) => {
  try {
    const response = await axiosInstance.put(`/api/addresses/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error('배송지 수정 실패:', error);
    throw error;
  }
};

// 기본 배송지 설정 API 추가
export const setDefaultAddress = async (addressId: number) => {
  try {
    const response = await axiosInstance.put(`/api/addresses/${addressId}/default`);
    return response.data;
  } catch (error) {
    console.error('기본 배송지 설정 실패:', error);
    throw error;
  }
};

