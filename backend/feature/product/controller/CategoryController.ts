import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../../../config/dbConfig";

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: [any[], any] = await pool.promise().query("SELECT * FROM ProductCategories");

    if (!rows || rows.length === 0) {
      res.status(404).json({ message: "카테고리가 존재하지 않습니다." });
      return;
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("카테고리 조회 실패:", error);
    res.status(500).json({ message: "서버 오류: 카테고리를 불러올 수 없습니다." });
  }
};