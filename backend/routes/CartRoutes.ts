import express from "express";
import * as cartController from "../feature/cart/controller/CartController";

const router = express.Router();

// ✅ 장바구니 조회
router.get("/:userId", cartController.getCart as express.RequestHandler);

// ✅ 장바구니에 상품 추가
router.post("/", cartController.addToCart as express.RequestHandler);

// ✅ 장바구니 내 상품 수량 증가
router.put(
  "/:cartItemId/increase",
  cartController.increaseQuantity as express.RequestHandler
);

// ✅ 장바구니 내 상품 수량 감소
router.put(
  "/:cartItemId/decrease",
  cartController.decreaseQuantity as express.RequestHandler
);

// ✅ 장바구니 개별 상품 삭제
router.delete(
  "/:cartItemId",
  cartController.removeItem as express.RequestHandler
);

// ✅ 장바구니 선택 상품 삭제
router.delete(
  "/removeSelected",
  cartController.removeSelectedItems as express.RequestHandler
);

export default router;
