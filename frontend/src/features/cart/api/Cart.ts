import axiosInstance from "../../../shared/axios/axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/carts`;

// 장바구니에 아이템 추가
export const addToCart = async (
  userId: string,
  shippingFee: number,
  productId: string,
  quantity: number
) => {
  try {
    const response = await axiosInstance.post(API_URL, {
      userId,
      shippingFee,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("장바구니 추가 실패:", error);
    throw error;
  }
};

// 장바구니 조회
export const getCart = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("장바구니 불러오기 실패:", error);
    throw error;
  }
};

// 장바구니 수량 증가
export const increaseQuantity = async (cartItemId: number) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${cartItemId}/increase`
    );
    return response.data;
  } catch (error) {
    console.error("수량 증가 실패:", error);
    throw error;
  }
};

// 장바구니 수량 감소
export const decreaseQuantity = async (cartItemId: number) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${cartItemId}/decrease`
    );
    return response.data;
  } catch (error) {
    console.error("수량 감소 실패:", error);
    throw error;
  }
};

// 장바구니 아이템 삭제
export const removeItem = async (cartItemId: number) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("장바구니 아이템 삭제 실패:", error);
    throw error;
  }
};

// 선택한 아이템 삭제
export const removeSelectedItems = async (cartItemIds: number[]) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/remove-selected`, {
      data: { cartItemIds },
    });
    return response.data;
  } catch (error) {
    console.error("선택한 아이템 삭제 실패:", error);
    throw error;
  }
};

// 장바구니 상품 이미지 가져오기 (MongoDB)
export const fetchCartProductImage = async (productId: string) => {
  try {
    const response = await axiosInstance.get(`/api/productImages/${productId}`);
    return response.data.imageUrl;
  } catch (error) {
    console.error(`❌ 장바구니 상품 이미지 가져오기 실패 (상품 ID: ${productId})`, error);
    return "https://placehold.co/300x300"; 
  }
};
