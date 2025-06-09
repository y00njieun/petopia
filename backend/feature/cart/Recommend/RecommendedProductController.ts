// RecommendedProductsController.ts
import { Request, Response } from "express";
import pool from "../../../config/dbConfig";
import ProductImage from "../../product/img/ProductImage";

export const getRecommendedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // 예시: Products 테이블에서 추천 상품을 is_recommended 필드로 구분한다고 가정합니다.
    const query = "SELECT * FROM Products WHERE is_recommended = 1";
    const [rows] = await pool.promise().query(query);

    // 각 상품에 대해 MongoDB에서 이미지 정보를 가져와 병합합니다.
    const recommendedProducts = await Promise.all(
      (rows as any[]).map(async (product) => {
        const productImage = await ProductImage.findOne({
          product_id: String(product.product_id),  // MySQL의 product_id를 문자열로 변환
        });
        return {
          ...product,
          main_image: productImage ? productImage.main_image : "https://placehold.co/300x300",
          small_image: productImage ? productImage.small_image : "https://placehold.co/150x150",
          detail_images: productImage ? productImage.detail_images : [],
        };
      })
    );

    res.status(200).json(recommendedProducts);
  } catch (error) {
    console.error("추천 상품 조회 실패:", error);
    res.status(500).json({ message: "서버 오류: 추천 상품을 불러올 수 없습니다." });
  }
};
