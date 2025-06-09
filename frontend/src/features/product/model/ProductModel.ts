export interface Product {
  product_code: string;
  category_id: number;
  product_name: string;
  description: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  stock_quantity: number;
  product_status: string;
  sizes: string[];
  colors: string[];
}

export interface OrderProduct {
  userId: string;
  productId: number;
  quantity: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  shippingFee: number;
  selectedSize: string;
  selectedColor: string;
  statusId: string;
}
export interface CartProduct {
  userId: string;
  productId: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface ProductUpdate {
  product_id: string;
  category_id: number;
  product_code: string;
  product_name: string;
  description: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  stock_quantity: number;
  product_status: string;
  sizes: string[];
  colors: string[];
  updated_at: string;
}