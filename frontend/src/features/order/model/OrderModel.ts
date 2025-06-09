export interface OrderUser{
  userId?: string | null | undefined;
}

export interface UserPoint{
  point:number;
}
export interface Common{
  status_code: string;
  description: string;
}

export interface DeliveryForm{
  delivery_message_id: number;
  description: string;
}

export interface UserAddressInfo{
  address_id?: number;
  // user_id: string|null|undefined;
  address_name: string;
  recipient_name: string;
  address: string;
  detailed_address?: string;
  recipient_phone: string;
  is_default: boolean;
  postal_code: string;
}

export interface UserAddressFormInfo {
  address_name: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  detailed_address?: string;
  postal_code: string;
  is_default: boolean;
}

export interface OrderProducts{
  order_id: string;
  product_id: number;
  category_id: number;
  product_name: string;
  product_count: number;
  final_amount: string;
  final_price: number;
  option_color: string;
  option_size: string;
  main_image: string;
}

export interface OrderState{
  orderInfo: OrderProducts[];
  totalPrice: number;
  order_id: string;
  user_id: string|null;
  finalPrice: number;
  orderType: string;
  selectedItems : number[];
}

// export interface UpdateOrderInfoPayload {
//   products: OrderProducts[];
//   updateTotalPrice: boolean;
// }

export interface OrderCouponPointProps{
  userId?: string | null | undefined;
  points: number;
  onPointsChange: (newPoints: number) => void;
}

export interface OrderPriceProps{
  userId?: string | null | undefined;
  points: number;
  onFinalPriceChange: (finalPrice: number) => void;
}

export interface OrderShippingFee{
  shipping_fee: number;
}

export interface OrderProductsProps{
  total_price: number;
  onTotalPriceChange: (total: number) => void; 
}

export interface OrderDeliveryInfoProps{
  userId?: string | null | undefined;
  addressChange: (address: UserAddressInfo) => void; 
  messageChange: (message: string) => void;
}

export interface OrderPayProps{
  userId?: string | null | undefined;
  selectedAddress: UserAddressInfo | null;
  selectedMessage: string
}

export interface Address {
  address_id?: string | number;
  address_name: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  detailed_address: string;
  postal_code: string;
  is_default: boolean;
}

export interface AddressFormData {
  address_name: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  detailed_address: string;
  postal_code: string;
  is_default: boolean;
}

export interface PaymentResponse {
  orderId: string;
  paymentKey: string;
  amount: number;
  status: string;
}