import { Request, Response } from "express";
import pool from "../../../config/dbConfig";
import ProductImage from "../img/ProductImage";

// 할인율 높은 3개 상품 조회
// export const getBestProducts = async (req: Request, res: Response) => {
//   try {
//     const query = `
//       SELECT * FROM Products
//       ORDER BY (origin_price - final_price) DESC
//       LIMIT 3
//     `;
//     const [rows] = await pool.promise().query(query);
//     res.json(rows);
//   } catch (error) {
//     console.error("할인율이 높은 상품 가져오기 실패:", error);
//     res.status(500).json({ message: "서버 오류: 상품을 가져올 수 없습니다." });
//   }
// };
export const getBestProducts = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT *, ((origin_price - final_price) / origin_price) * 100 AS discount_rate
      FROM Products
      ORDER BY discount_rate DESC
      LIMIT 4
    `;
    const [rows] = await pool.promise().query(query);

    console.log("MySQL에서 조회된 상품 데이터:", rows);

    const productIds = (rows as any[]).map((product) => String(product.product_id));
    const productImages = await ProductImage.find({ product_id: { $in: productIds } });

    console.log("MongoDB에서 조회된 이미지 데이터:", productImages);

    const productList = (rows as any[]).map((product) => {
      const imageData = productImages.find(
        (image) => image.product_id === String(product.product_id)
      );

      return {
        ...product,
        main_image: imageData ? imageData.main_image : null,
        small_image: imageData ? imageData.small_image : null,
        detail_images: imageData ? imageData.detail_images : [],
      };
    });

    console.log("최종 상품 리스트:", productList);
    res.status(200).json(productList);
  } catch (error) {
    console.error("상품 목록 조회 실패:", error);
    res
      .status(500)
      .json({ message: "서버 오류: 상품 목록을 불러올 수 없습니다." });
  }
};


// 최근 등록된 상품 조회
export const getRecentProducts = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT * FROM Products
      ORDER BY created_at DESC
      LIMIT 4
    `;
    const [rows] = await pool.promise().query(query);

    console.log("MySQL에서 조회된 최근 상품 데이터:", rows);

    const productIds = (rows as any[]).map((product) => String(product.product_id));
    const productImages = await ProductImage.find({ product_id: { $in: productIds } });

    console.log("MongoDB에서 조회된 최근 상품 이미지 데이터:", productImages);

    const productList = (rows as any[]).map((product) => {
      const imageData = productImages.find(
        (image) => image.product_id === String(product.product_id)
      );

      return {
        ...product,
        main_image: imageData ? imageData.main_image : null,
        small_image: imageData ? imageData.small_image : null,
        detail_images: imageData ? imageData.detail_images : [],
      };
    });

    console.log("최종 최근 상품 리스트:", productList);
    res.status(200).json(productList);
  } catch (error) {
    console.error("최근 상품 목록 조회 실패:", error);
    res
      .status(500)
      .json({ message: "서버 오류: 최근 상품 목록을 불러올 수 없습니다." });
  }
};
