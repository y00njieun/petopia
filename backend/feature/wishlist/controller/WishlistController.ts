import { Request, Response } from "express";
import pool from "../../../config/dbConfig";

export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  console.log("위시리스트 API 요청 도착!");
  console.log("요청된 userId:", req.query.userId);

  let { userId } = req.query;
  if (!userId) {
    res.status(400).json({ message: "userId가 필요합니다." });
    return;
  }

  try {
    const [wishlistRows] = await pool.promise().query(
      "SELECT product_id FROM WishList WHERE user_id = ? AND like_status = 1",
      [userId]
    );

    const wishlist = (wishlistRows as any[]).map((row) => row.product_id);
    console.log("위시리스트 응답:", wishlist);

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("위시리스트 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};



export const addToWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, productId } = req.body;
  console.log(`백엔드 - 사용자 ID: ${userId}, 상품 ID: ${productId}`);
  
  try {
    await pool.promise().query(
      `INSERT INTO WishList (user_id, product_id, like_status) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE like_status = TRUE`,
      [userId, productId]
    );

    console.log(`프론트 - 위시리스트 추가됨: userId=${userId}, productId=${productId}`);
    res.status(201).json({ message: "위시리스트에 추가됨" });
  } catch (error) {
    console.error("위시리스트 추가 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const removeFromWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    await pool
      .promise()
      .query(
        `UPDATE WishList SET like_status = FALSE WHERE user_id = ? AND product_id = ?`,
        [userId, productId]
      );

    console.log(`위시리스트 제거됨: userId=${userId}, productId=${productId}`);
    res.status(200).json({ message: "위시리스트에서 제거됨" });
  } catch (error) {
    console.error("위시리스트 삭제 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
// export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
//   const { userId, productId } = req.body;
//   console.log(" 요청 바디:", req.body);
//   try {
//     const [rows] = await pool.promise().query(
//       "SELECT like_status FROM WishList WHERE user_id = ? AND product_id = ?",
//       [userId, productId]
//     ) as any[];

//     const existing = rows.length > 0 ? rows[0] : null;

//     if (existing) {
//       const newStatus = !existing.like_status;

//       await pool.promise().query(
//         "UPDATE WishList SET like_status = ? WHERE user_id = ? AND product_id = ?",
//         [newStatus, userId, productId]
//       );
//       res.status(200).json({ message: `위시리스트 ${newStatus ? "추가됨" : "삭제됨"}` });

//     } else {
//       await pool.promise().query(
//         "INSERT INTO WishList (user_id, product_id, like_status) VALUES (?, ?, TRUE)",
//         [userId, productId]
//       );

//       res.status(201).json({ message: "위시리스트에 추가됨" });
//     }
//   } catch (error) {
//     console.error("위시리스트 업데이트 실패:", error);
//     res.status(500).json({ message: "서버 오류 발생" });
//   }
// };
