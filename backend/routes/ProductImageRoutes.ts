import { Router } from "express";

import { getProductImages, getProductsWithImages } from "../feature/product/img/productImageController";

const router = Router();


// 이미지 가져오기
router.get("/productImages", getProductsWithImages);

// 특정 상품 이미지 조회 API
router.get("/:productId", getProductImages);

export default router;
