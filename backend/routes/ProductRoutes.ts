//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.

import express, { Router, Request, Response, RequestHandler } from "express";
import pool from "../../backend/config/dbConfig";
import ProductService from "../../backend/feature/product/services/ProductService";
import { RowDataPacket } from "mysql2";
import { getProductById, getCategories, getProducts, deleteProduct, updateProduct, checkProductStock, updateProductStock } from "../feature/product/controller/ProductController"
import ProductImage from "../feature/product/img/ProductImage";
import { getBestProducts, getRecentProducts } from "../feature/product/controller/MainProductController";

const router = Router();

// 할인율 높은 베스트 상품
router.get("/products/best", getBestProducts);

// 최근 등록된 상품 조회
router.get("/products/recent", getRecentProducts);

// 모든 카테고리 조회 API
router.get("/api/categories", getCategories);
// router.get("/categories", async (req: Request, res: Response) => {
//   try {
//     const [rows] = await pool.promise().query<RowDataPacket[]>(
//       "SELECT category_id, category_name FROM ProductCategories"
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error("카테고리 목록 불러오기 실패:", error);
//     res.status(500).json({ message: "서버 오류: 카테고리 목록을 불러올 수 없습니다." });
//   }
// });

// 상품 등록 API
router.post("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const newProduct = await ProductService.createProduct(req.body);
    console.log(" 상품 등록 성공:", newProduct);

    res.status(201).json({
      message: "상품 등록 성공",
      product_id: newProduct.product_id,
    });

  } catch (error) {
    console.error("상품 등록 실패:", error);
    res.status(500).json({ message: "서버 오류: 상품을 등록할 수 없습니다." });
  }
});

// 상품 목록 조회 API
router.get("/products", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.promise().query<RowDataPacket[]>("SELECT * FROM Products");
    res.json(rows);
  } catch (error) {
    console.error("상품 데이터를 불러오는 중 오류 발생:", error);
    res.status(500).json({ message: "서버 내부 오류" });
  }
});

// 상품 상세 조회 API
router.get(
  "/productImages/:product_id",
  async (req: Request<{ product_id: string }>, res: Response): Promise<void> => {
    try {
      const { product_id } = req.params;
      console.log("요청된 product_id:", product_id);

      const id = parseInt(product_id, 10);
      if (isNaN(id)) {
        console.error("잘못된 상품 ID:", product_id);
        res.status(400).json({ message: "잘못된 상품 ID입니다." });
        return;
      }

      const [rows] = await pool
        .promise()
        .query<RowDataPacket[]>("SELECT * FROM Products WHERE product_id = ?", [id]);

      if (!rows || rows.length === 0) {
        res.status(404).json({ message: "해당 상품을 찾을 수 없습니다." });
        return;
      }

      const product = rows[0];

      const productImage = await ProductImage.findOne({ product_id });

      const productWithImages = {
        ...product,
        main_image: productImage ? `VITE_API_BASE_URL/${productImage.main_image}` : null,
        detail_images: productImage ? productImage.detail_images.map(img => `VITE_API_BASE_URL/${img}`) : [],
      };

      console.log("최종 응답 데이터:", productWithImages);
      res.status(200).json(productWithImages);
    } catch (error) {
      console.error("상품 데이터를 불러오는 중 오류 발생:", error);
      res.status(500).json({ message: "서버 내부 오류" });
    }
  }
);

// 특정 상품 조회
router.get("/products/:id", getProductById);
// 다수 상품 조회
router.get("/products", getProducts);
// 상품 수정
router.put("/product-create/:productId", updateProduct);
// 상품 삭제
router.delete("/products/:productId", deleteProduct);

// 재고 관련 라우트 수정
router.post("/check-stock", checkProductStock as RequestHandler);  // 슬래시 추가
router.put("/stock", updateProductStock as RequestHandler);        // 슬래시 추가

export default router;