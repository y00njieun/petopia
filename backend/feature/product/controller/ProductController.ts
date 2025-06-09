import { Request, Response, RequestHandler } from "express";
import pool from "../../../config/dbConfig";
import ProductImage from "../img/ProductImage"
import { ResultSetHeader } from "mysql2";


export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [rows] = await pool.promise().query(
      "SELECT * FROM Products WHERE product_id = ?",
      [id]
    );

    const result = rows as any[];

    if (result.length === 0) {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      return;
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("상품 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  let { ids, userId } = req.query;

  try {
    if (!ids) {
      res.status(400).json({ message: "상품 ID가 필요합니다." });
    }

    const idArray = (typeof ids === "string" ? ids.split(",").map(Number) : []);

    const [products] = await pool.promise().query(
      `SELECT p.*
        FROM Products p
        JOIN WishList w ON p.product_id = w.product_id
        WHERE w.user_id = ?
        AND w.like_status = TRUE`, 
      [userId, ...idArray]
    );
    res.status(200).json(products);
  } catch (error) {
    console.error("상품 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: [any[], any] = await pool.promise().query("SELECT * FROM Categories");

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ message: "카테고리가 없습니다." });
      return;
    }

    console.log("카테고리 API 응답:", rows);
    res.status(200).json({ categories: rows });
  } catch (error) {
    console.error("카테고리 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.productId || req.params.id;
  const updatedData = req.body;

  console.log("updateProduct API 호출됨");
  console.log("수정 요청된 상품 ID:", productId);
  console.log("수정 요청 데이터:", updatedData);

  if (!productId) {
      res.status(400).json({ message: "상품 ID가 제공되지 않았습니다." });
      return;
  }

  // 이미지 필드를 제외한 데이터 필터링
  const {
      mainImage,      // 대표 이미지 제거
      detailImages,   // 상세 이미지 제거
      ...filteredData // 나머지 상품 정보만 저장
  } = updatedData;

  try {
      const [result] = await pool.promise().query(
          `UPDATE Products 
          SET category_id=?, product_name=?, description=?, origin_price=?, 
              discount_price=?, final_price=?, stock_quantity=?, product_status=?, 
              sizes=?, colors=?, updated_at=?
          WHERE product_id=?`,
          [
              filteredData.category_id,
              filteredData.product_name,
              filteredData.description,
              filteredData.origin_price,
              filteredData.discount_price,
              filteredData.final_price,
              filteredData.stock_quantity,
              filteredData.product_status,
              JSON.stringify(filteredData.sizes),
              JSON.stringify(filteredData.colors),
              new Date(),
              productId
          ]
      );

      if ((result as any).affectedRows === 0) {
          res.status(404).json({ message: "해당 상품을 찾을 수 없습니다." });
          return;
      }

      res.status(200).json({ message: "상품이 성공적으로 수정되었습니다.",product_id: productId});
  } catch (error) {
      console.error("상품 수정 오류:", error);
      res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;

  try {
    const [productRows] = await pool
      .promise()
      .query("SELECT * FROM Products WHERE product_id = ?", [productId]);

    if (!productRows || (productRows as any[]).length === 0) {
      res.status(404).json({ message: "해당 상품을 찾을 수 없습니다." });
      return;
    }
    await pool.promise().query("DELETE FROM Answer WHERE product_id = ?", [productId]);
    await pool.promise().query("DELETE FROM CartDetail WHERE product_id = ?", [productId]);
    await pool.promise().query("DELETE FROM OrderItems WHERE product_id = ?", [productId]);
    await pool.promise().query("DELETE FROM ProductOptions WHERE product_id = ?", [productId]);
    await pool.promise().query("DELETE FROM Question WHERE product_id = ?", [productId]);
    await pool.promise().query("DELETE FROM Review WHERE product_id = ?", [productId]);
    await pool.promise().query("DELETE FROM WishList WHERE product_id = ?", [productId]);

    await pool.promise().query("DELETE FROM Products WHERE product_id = ?", [productId]);

    res.status(200).json({ message: "상품이 삭제되었습니다." });
  } catch (error) {
    console.error("상품 삭제 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

// 재고 확인 API
export const checkProductStock = async (req: Request, res: Response) => {
  console.log('재고 확인 API 호출됨:', req.body); // 디버깅용 로그 추가
  try {
    const { items } = req.body;

    // 각 상품의 재고 확인
    for (const item of items) {
      const query = `
        SELECT stock_quantity 
        FROM ProductOptions 
        WHERE product_id = ? 
        AND color = ? 
        AND size = ?
      `;
      
      const [result] = await pool.promise().query(query, [
        item.product_id,
        item.option_color,
        item.option_size
      ]);

      const rows = result as any[];
      if (rows.length === 0 || rows[0].stock_quantity < item.product_count) {
        return res.json({ success: false });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('재고 확인 실패:', error);
    res.status(500).json({ success: false, error: '재고 확인 중 오류가 발생했습니다.' });
  }
};

// 재고 업데이트 API
export const updateProductStock = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    for (const item of items) {
      const query = `
        UPDATE ProductOptions 
        SET stock_quantity = stock_quantity - ? 
        WHERE product_id = ? 
        AND color = ? 
        AND size = ?
      `;
      
      await pool.promise().query(query, [
        item.product_count,
        item.product_id,
        item.option_color,
        item.option_size
      ]);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('재고 업데이트 실패:', error);
    res.status(500).json({ success: false, error: '재고 업데이트 중 오류가 발생했습니다.' });
  }
};
