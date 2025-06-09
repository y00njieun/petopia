import axiosInstance from "axios";
import { Product, OrderProduct, CartProduct, ProductUpdate } from "../model/ProductModel";

// 상품 등록 API 요청
export const createProduct = async (productData: Product) => {
  try {
    const response = await axiosInstance.post("/api/products", productData);
    console.log("프론트 서버 응답 데이터 구조:", response);
    return response
  } catch (error) {
    console.error("상품 등록 실패:", error);
    throw error;
  }
};

// 상품 수정
export const updateProduct = async (productId: string, updatedData: ProductUpdate) => {
  console.log("프론트 API 호출 updateProduct:", `/api/product-create/${productId}`, updatedData);

  try {
      const response = await axiosInstance.put(`/api/product-create/${productId}`, updatedData);
      console.log("서버 응답:", response);

      if (!response || !response.data) {
          console.error("응답이 비어 있음:", response);
          throw new Error("응답이 비어 있음");
      }

      return response.data;
  } catch (error) {
      console.error("상품 수정 실패:", error);
      throw error;
  }
};

// 상품 목록 조회 API 요청
export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/api/productImages");
    return response.data;
  } catch (error) {
    console.error("상품 목록 불러오기 실패:", error);
    throw error;
  }
};

// 상품 상세 조회 API 요청
export const getProductById = async (product_id: number) => {
  try {
    const response = await axiosInstance.get(`/api/products/${product_id}`);
    return response.data;
  } catch (error) {
    console.error(`상품 상세 조회 실패 (ID: ${product_id}):`, error);
    throw error;
  }
};

// 상품 주문 API 요청
export const createOrder = async (orderData: OrderProduct) => {
  try {
    const response = await axiosInstance.post("/api/orders", orderData);
    return response.data;
  } catch (error) {
    console.error(`주문 생성 실패 (상품 ID: ${orderData.productId}):`, error);
    throw error;
  }
};

// 상품 장바구니 API 요청
export const createCart = async (cartData: CartProduct) => {
  try {
    const response = await axiosInstance.post("/api/carts", cartData);
    return response.data;
  } catch (error) {
    console.error(
      `장바구니 추가 실패 (상품 ID: ${cartData.productId}):`,
      error
    );
    throw error;
  }
};

// 이미지 업로드
export const uploadImages = async (productId: string, mainImage: File, detailImages: File[]) => {
  const formData = new FormData();
  formData.append("product_id", productId);
  formData.append("mainImage", mainImage);
  detailImages.forEach((file) => {
    formData.append(`detailImage`, file);
  });

  const response = await axiosInstance.post("/api/productImages/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
export default axiosInstance;