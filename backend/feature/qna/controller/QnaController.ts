import { Request, Response } from "express";
import dbConfig from "../../../config/dbConfig";

export const createQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(" 요청 데이터:", req.body);

    let {
      user_id,
      product_id,
      question_detail,
      question_date,
      question_private,
    } = req.body;

    if (!product_id || !question_detail || !question_date) {
      console.error(" 필수 입력값 누락:", {
        product_id,
        question_detail,
        question_date,
      });
      res.status(400).json({ message: "필수 입력값이 누락되었습니다." });
      return;
    }

    // user_id가 없으면 자동으로 "guest"로 설정
    if (!user_id) {
      user_id = "guest";
    }

    const sql = `
      INSERT INTO Question (user_id, product_id, question_detail, question_date, question_private)
      VALUES (?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i'), ?);
      `;

    const values = [
      user_id,
      product_id,
      question_detail,
      question_date,
      question_private,
    ];

    console.log(" SQL 실행 값:", values);

    const result: any = await dbConfig.promise().query(sql, values);

    console.log(" DB Insert 결과:", result);

    res.status(201).json({
      message: "Question created successfully",
      question_id: result.insertId,
    });
  } catch (error) {
    console.error(" QnA 질문 등록 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", error });
  }
};

// 특정 상품의 QnA 목록 조회
export const getQuestionsByProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { userId } = req.query;

    console.log("요청된 productId:", productId, "요청한 userId:", userId);

    if (!productId || isNaN(Number(productId))) {
      res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
      return;
    }

    let isAdmin = false;
    let validUserId = userId ?? "";

    if (validUserId) {
      const [adminCheck]: any = await dbConfig
        .promise()
        .query("SELECT isAdmin FROM Users WHERE user_id = ?", [validUserId]);

      if (adminCheck.length > 0) {
        isAdmin = adminCheck[0].isAdmin === 1;
      }
    }

    console.log(`🔹 사용자 ${validUserId} 관리자 여부:`, isAdmin);

    const sql = isAdmin
      ? `
        SELECT question_id, user_id, product_id, question_detail, question_date, question_private
        FROM Question
        WHERE product_id = ?
        ORDER BY question_date DESC;
      `
      : `
        SELECT question_id, user_id, product_id, question_detail, question_date, question_private
        FROM Question
        WHERE product_id = ?
        AND (question_private = 'N' OR user_id = ?)
        ORDER BY question_date DESC;
      `;

    const queryParams = isAdmin ? [productId] : [productId, validUserId];

    const [rows]: any = await dbConfig.promise().query(sql, queryParams);

    if (!rows || rows.length === 0) {
      console.log(`해당 productId(${productId})에 대한 QnA 데이터 없음`);
      res.status(404).json({ message: "해당 상품에 대한 QnA가 없습니다." });
      return;
    }

    res.status(200).json({ questions: rows });
  } catch (error) {
    console.error("QnA 조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
