//비즈니스 수

//리포저티토리랑 연계를해서 DB에 데이터를 적재하는 기능을 수행

//controller -> service -> repository -> db

import {
  getDeliveryMessage, 
  getOrderProductItems, 
  getOrderSingleProducts, 
  // getOrderProducts, 
  getShippingFee, 
  getUserAddress, 
  getUserDetailsAddress, 
  getUserPoints, 
  insertCartOrder, 
  insertCartOrderItems, 
  insertOrderDelivery, 
  // insertOrder,
  insertOrderItems,
  updateOrderStatus, 
} from "../repo/OrderRepo";

export const fetchUserPoints = async(userId: string) => {
  try {
    console.log('OrderService fetchUserPoints userId', userId);
    const userPoints = await getUserPoints(userId);
    // const userPoints = await getUserPoints('user123');
    console.log('OrderService userPoints', userPoints);
    return userPoints;
  } catch(err){
    console.error('사용자 포인트를 가져오지 못했습니다.', err);
    throw err;
  }
};

export const fetchDeliveryMessage = async() => {
  try{
    const message = await getDeliveryMessage();
    return message;
  } catch(err){
    console.error('배송 메시지를 불러오지 못했습니다.',err);
    throw err;
  }
}

export const fetchUserAddress = async(userId: string) => {
  try{
    // const userAddress = await getUserAddress('user123');
    console.log('OrderService userId', userId);
    const userAddress = await getUserAddress(userId);
    console.log('OrderService userAddress', userAddress);
    return userAddress;
  } catch(err){
    console.error('배송지 정보를 가져오지 못했습니다.', err);
    throw err;
  } 
};

export const fetchUserDetailsAddress = async(userId: string) => {
  try{
    // const userAddress = await getUserDetailsAddress('user123');
    console.log('OrderService fetchUserDetailsAddress userId', userId);
    const userAddress = await getUserDetailsAddress(userId);
    console.log('OrderService fetchUserDetailsAddress userAddress', userAddress);
    return userAddress;
  } catch(err){
    console.error('배송지 상세 리스트 정보를 가져오지 못했습니다.', err);
    throw err;
  } 
};

export const fetchOrderProducts = async(userId: string, type: string, selectedProductId: number[], orderId: string) => {
  try{
    // const orderProductsInfo = await getOrderSingleProducts('user123');
    console.log('fetchOrderProducts]유저아이디, 타입', userId, type, selectedProductId, orderId);
    if(type === 'OT002'){
      const orderProductsInfo = await getOrderSingleProducts(userId, type);
      console.log
      return orderProductsInfo;
    } else{
      const orderCartInfo = await getOrderProductItems(userId, type, selectedProductId, orderId);
      return orderCartInfo;
    }
  } catch(err){
    console.error('제품 정보를 가져오지 못했습니다.', err);
    throw err;
  }
};

export const fetchShippingFee = async(userId: string) => {
  try{
    // const shippingFee = await getShippingFee('user123');
    console.log('fetchShippingFee 유저아이디', userId)
    const shippingFee = await getShippingFee(userId);
    console.log('shipping fee: ', shippingFee);
    return shippingFee;
  } catch(err){
    console.error('배송비 정보를 가져오지 못했습니다.', err);
    throw err;
  }
};

export const fetchOrderSingleProduct = async(orderData:any) => {
  try{
    const statusid = 'OS001';
    const orderType = 'OT002';
    const {userId, productId, quantity, totalAmount, discountAmount, finalAmount, shippingFee, selectedSize, selectedColor, statusId} = orderData;
    // const orderId = await insertOrder(userid, totalAmount, discountAmount, finalAmount, shippingFee, statusid, orderType);
    const orderId = await insertOrderItems(
      userId, 
      totalAmount, 
      discountAmount, 
      finalAmount, 
      shippingFee, 
      orderType, 
      productId, 
      statusid,
      quantity,
      selectedSize,
      selectedColor
    );
    console.log('orderID', orderId,typeof(orderId));
    if(!orderId){
      throw new Error('order_id가 존재하지 않습니다.');
    }
    return orderId;
    // await insertOrderItems(orderId, productId, statusid,quantity,selectedSize,selectedColor);
  } catch(err){
    console.error('단일 상품 저장 실패', err);
    throw err;
  }
}

export const fetchOrderCartProduct = async(orderData:any) => {
  try{
    const statusid = 'OS001';
    const orderType = 'OT001';
    const {userId, totalAmount, discountAmount, finalAmount, shippingFee, statusId} = orderData;
    // const orderId = await insertOrder(userid, totalAmount, discountAmount, finalAmount, shippingFee, statusid, orderType);
    const orderId = await insertCartOrder(
      userId, 
      totalAmount, 
      discountAmount, 
      finalAmount, 
      shippingFee, 
      orderType, 
      statusid,
    );
    console.log('orderID', orderId,typeof(orderId));
    if(!orderId){
      throw new Error('order_id가 존재하지 않습니다.');
    }
    return orderId;
    // await insertOrderItems(orderId, productId, statusid,quantity,selectedSize,selectedColor);
  } catch(err){
    console.error('단일 상품 저장 실패', err);
    throw err;
  }
}

export const fetchOrderCartItem = async(orderData: any) => {
  try{
    const statusid = 'OS001';
    const {orderId, productId, quantity, selectedSize, selectedColor, statusId} = orderData;
    // const orderId = await insertOrder(userid, totalAmount, discountAmount, finalAmount, shippingFee, statusid, orderType);
    const orderItemsData = await insertCartOrderItems(
      orderId,
      productId, 
      statusid,
      quantity,
      selectedSize,
      selectedColor
    );
    console.log('orderID', orderItemsData,typeof(orderItemsData));
    if(!orderItemsData){
      throw new Error('order_id가 존재하지 않습니다.');
    }
    return orderItemsData;
    // await insertOrderItems(orderId, productId, statusid,quantity,selectedSize,selectedColor);
  } catch(err){
    console.error('단일 상품 저장 실패', err);
    throw err;
  }
}

export const fetchInsertDeliveryInfo = async(orderId: string, selectedAddress: any, selectedMessage: string) => {
  try{
    console.log('selectedAddress 데이터', selectedAddress);
    const combinedAddress = `${selectedAddress.address} ${selectedAddress.detailed_address}`;
    const deliveryInfo = await insertOrderDelivery(orderId, combinedAddress,selectedMessage);
    console.log("주문 배송지 추가",deliveryInfo);
    return deliveryInfo;
  }catch(err){
    console.error('배송지 정보 추가 실패', err);
  }
}

export const fetchUpdateOrderStatus = async(order: { order_id: string }) => {
  try{
    const { order_id } = order;
    console.log('[fetchUpdateOrderStatus', order_id);
    const orderStatus = await updateOrderStatus(order_id);
    console.log("주문 상태 변경",orderStatus);
    return orderStatus;
  }catch(err){
    console.error('주문 정보 업데이트 실패', err);
  }
}