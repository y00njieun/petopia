import pool from "../../../config/dbConfig";
import ProductImage from "../../product/img/ProductImage";

export const getCart = async (userId: string) => {
  const query = `
    SELECT 
      cd.cart_item_id, 
      cd.cart_id, 
      cd.product_id, 
      SUM(cd.quantity) AS quantity,
      p.product_name AS name, 
      COALESCE(p.final_price, 0) AS final_price,
      cd.selected_size,
      cd.selected_color
    FROM CartDetail cd
    JOIN Products p ON cd.product_id = p.product_id
    JOIN Cart c ON cd.cart_id = c.cart_id
    WHERE c.user_id = ?
    GROUP BY cd.cart_item_id, cd.cart_id, cd.product_id, p.product_name, p.final_price, cd.selected_size, cd.selected_color;
  `;

  console.log("🛠 실행할 SQL 쿼리:", query, " with userId:", userId);

  try {
    const [rows]: any = await pool.promise().query(query, [userId]);
    console.log("🛒 장바구니 데이터 조회:", rows);
  
    // MongoDB에서 이미지( main_image, small_image 등 ) 조회
    const updatedCartItems = await Promise.all(
      (rows as any[]).map(async (item) => {
        // 1) MongoDB에서 product_id가 string으로 저장되었으므로 String(...) 변환
        const productImage = await ProductImage.findOne({
          product_id: String(item.product_id),
        });

        let mainImageUrl = "https://via.placeholder.com/100";
        if (productImage && productImage.main_image) {
          mainImageUrl = productImage.main_image;
          if (!mainImageUrl.startsWith("http")) {
            // 상대경로라면, 예시로 baseURL을 http://localhost:3000 으로 붙여줌 (환경변수 활용 가능)
            const baseURL = process.env.BASE_URL || "http://localhost:3000";
            mainImageUrl = mainImageUrl.startsWith("/")
              ? `${baseURL}${mainImageUrl}`
              : `${baseURL}/${mainImageUrl}`;
          }
        }
        
        return {
          ...item,
          main_image: mainImageUrl,
          small_image: productImage && productImage.small_image
            ? productImage.small_image
            : "https://via.placeholder.com/100",
          detail_images: productImage ? productImage.detail_images : [],
        };
      })
    );

  
    console.log("🛒 최종 장바구니 데이터:", updatedCartItems);
    return updatedCartItems;
  } catch (error) {
    console.error("🚨 장바구니 조회 실패:", error);
    throw error;
  }
}

// ✅ 기존 장바구니 찾기 (cart_id 반환)
export const findCartId = async (userId: string): Promise<number | null> => {
  const query = `SELECT cart_id FROM Cart WHERE user_id = ? LIMIT 1`;

  try {
    const [rows]: any = await pool.promise().query(query, [userId]);
    console.log("🔎 기존 장바구니 조회 결과:", rows);
    return rows.length > 0 ? rows[0].cart_id : null;
  } catch (error) {
    console.error("🚨 장바구니 ID 조회 실패:", error);
    throw error;
  }
};

// ✅ 장바구니 생성 (`Cart` 테이블에 `cart_id` 생성 후 반환)
export const addToCart = async (userId: string, shippingFee: number): Promise<number> => {
  const query = `INSERT INTO Cart (user_id, shipping_fee) VALUES (?, ?)`;
  try {
    const [result]: any = await pool.promise().query(query, [userId, shippingFee]);
    return result.insertId; // ✅ 삽입된 `cart_id` 반환
  } catch (error) {
    console.error("🚨 장바구니 생성 실패:", error);
    throw error;
  }
};

// ✅ 특정 상품이 장바구니에 존재하는지 확인
export const findCartItem = async (cartId: number, productId: string) => {
  const query = `
    SELECT cd.cart_item_id, cd.quantity 
    FROM CartDetail cd
    WHERE cd.cart_id = ? AND cd.product_id = ?
    LIMIT 1`;

  try {
    console.log(`🔎 findCartItem 실행: cartId = ${cartId}, productId = ${productId}`);
    const [rows]: any = await pool.promise().query(query, [cartId, productId]); // ✅ cartId를 올바르게 전달
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("🚨 장바구니 항목 조회 실패:", error);
    throw error;
  }
};

// ✅ 상품 추가 (`CartDetail` 테이블에 `cart_id` & `product_id` 추가)
export const addToCartDetail = async (
  cartId: number,
  productId: string,
  quantity: number,
  selectedSize: string,
  selectedColor: string
) => {
  const query = `
    INSERT INTO CartDetail (cart_id, product_id, quantity, selected_size, selected_color)
    VALUES (?, ?, ?, ?, ?)
    `;

    // ON DUPLICATE KEY UPDATE
    //   quantity = quantity + VALUES(quantity),
    //   selected_size = VALUES(selected_size),
    //   selected_color = VALUES(selected_color)

  try {
    console.log(`🛠 CartDetail 추가 실행: cartId=${cartId}, productId=${productId}, quantity=${quantity}`);
    const [result] = await pool.promise().query(query, [cartId, productId, quantity, selectedSize, selectedColor]);
    console.log("✅ CartDetail 추가 결과:", result);
  } catch (error) {
    console.error("❌ CartDetail 추가 실패:", error);
    throw error;
  }
};

// ✅ 상품 수량 증가 (`CartDetail` 테이블의 `cart_item_id` 사용)
export const increaseQuantity = async (cartItemId: number, quantity: number = 1) => {
  const query = `UPDATE CartDetail SET quantity = quantity + ? WHERE cart_item_id = ?`;
  try {
    await pool.promise().query(query, [quantity, cartItemId]);
  } catch (error) {
    console.error("🚨 수량 증가 실패:", error);
    throw error;
  }
};

// ✅ 상품 수량 감소 (`CartDetail` 테이블의 `cart_item_id` 사용)
export const decreaseQuantity = async (cartItemId: number) => {
  const query = `UPDATE CartDetail SET quantity = quantity - 1 WHERE cart_item_id = ? AND quantity > 1`;
  try {
    await pool.promise().query(query, [cartItemId]);
  } catch (error) {
    console.error("🚨 수량 감소 실패:", error);
    throw error;
  }
};

// ✅ 개별 상품 삭제 (`CartDetail` 테이블의 `cart_item_id` 사용)
export const removeItem = async (cartItemId: number) => {
  const query = `DELETE FROM CartDetail WHERE cart_item_id = ?`;
  try {
    await pool.promise().query(query, [cartItemId]);
  } catch (error) {
    console.error("🚨 상품 삭제 실패:", error);
    throw error;
  }
};

// ✅ 선택된 상품 삭제 (`CartDetail` 테이블의 `cart_item_id` 배열 사용)
export const removeSelectedItems = async (cartItemIds: number[]) => {
  if (cartItemIds.length === 0) return;
  const query = `DELETE FROM CartDetail WHERE cart_item_id IN (${cartItemIds.map(() => "?").join(",")})`;
  try {
    await pool.promise().query(query, cartItemIds);
  } catch (error) {
    console.error("🚨 선택 삭제 실패:", error);
    throw error;
  }
};
