import { Request, Response } from "express";
import * as cartService from "../services/CartService";

// ✅ 장바구니 조회 API (Cart 테이블의 `user_id` 기반 조회)
export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // ✅ 사용자의 고유 ID (Users 테이블의 `user_id`)
    
    console.log("🛠 장바구니 조회 요청 - userId:", userId);
    
    if (!userId || userId === "null") {
      return res.status(400).json({ message: "유효하지 않은 userId입니다." });
    }
    const items = await cartService.getCart(userId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "장바구니 불러오기 실패", error });
  }
};

// ✅ 장바구니에 상품 추가 API (`Cart` → `CartDetail`)
export const addToCart = async (req: Request, res: Response) => {
  try {
      const { userId, shippingFee, productId, quantity, selectedSize, selectedColor } = req.body;

    if (!userId || !productId || !quantity) {
      console.error("❌ 필수 데이터 누락! 요청 본문:", req.body); // 🚨 어떤 데이터가 빠졌는지 확인
      return res.status(400).json({ message: "필수 데이터가 누락되었습니다." });
    }

    // ✅ `selectedColor`가 빈 값이라면 기본값("")로 처리
    const color = selectedColor ?? "";
    const size = selectedSize ?? "";

    const fee = shippingFee ?? 0;

    const cartId = await cartService.addToCart(userId, fee, productId, quantity, size, color);
    console.log("✅ 장바구니 ID 확인:", cartId);

    res.status(201).json({ message: "장바구니에 추가되었습니다.", cartId });
  } catch (error) {
    console.error("❌ 장바구니 추가 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error });
  }
};

// ✅ 상품 수량 증가 API (`CartDetail` 테이블의 `cart_item_id` 사용)
export const increaseQuantity = async (req: Request, res: Response) => {
  try {
    const cartItemId = Number(req.params.cartItemId); // ✅ 장바구니 상세 ID (CartDetail 테이블의 `cart_item_id`)
    if (isNaN(cartItemId)) {
        return res.status(400).json({ message: "유효하지 않은 cartItemId 입니다."})
    }

    await cartService.increaseQuantity(cartItemId);
    res.json({ message: "수량이 증가되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "수량 증가 실패", error });
  }
};

// ✅ 상품 수량 감소 API (`CartDetail` 테이블의 `cart_item_id` 사용)
export const decreaseQuantity = async (req: Request, res: Response) => {
  try {
    const cartItemId = Number(req.params.cartItemId); // ✅ 장바구니 상세 ID (CartDetail 테이블의 `cart_item_id`)
    if (isNaN(cartItemId)) {
        return res.status(400).json({ message: "유효하지 않은 cartItemId 입니다."})
    }
    
    await cartService.decreaseQuantity(cartItemId);
    res.json({ message: "수량이 감소되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "수량 감소 실패", error });
  }
};

// ✅ 개별 상품 삭제 API (`CartDetail` 테이블의 `cart_item_id` 사용)
export const removeItem = async (req: Request, res: Response) => {
  try {
    const cartItemId = Number(req.params.cartItemId); // ✅ 장바구니 상세 ID (CartDetail 테이블의 `cart_item_id`)
    if (isNaN(cartItemId)) {
        return res.status(400).json({ message: " 유효하지 않은 cartItemId 입니다."})
    }
    
    await cartService.removeItem(cartItemId);
    res.json({ message: "상품이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "상품 삭제 실패", error });
  }
};

// ✅ 선택된 상품 삭제 API (`CartDetail` 테이블의 `cart_item_id` 배열 사용)
export const removeSelectedItems = async (req: Request, res: Response) => {
  try {
    const { cartItemIds } = req.body as { cartItemIds?: number[] }; // ✅ 여러 개의 장바구니 상세 ID (CartDetail 테이블의 `cart_item_id`)
    
    if (!cartItemIds || cartItemIds.length === 0) {
      return res.status(400).json({ message: "`cartItemIds`가 필요합니다."});;
    }

    await cartService.removeSelectedItems(cartItemIds);
    res.json({ message: "선택한 상품들이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "선택 상품 삭제 실패", error });
  }
};
