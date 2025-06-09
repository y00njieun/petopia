import express from "express";
import { createQuestion } from "../feature/qna/controller/QnaController";
import { getQuestionsByProduct } from "../feature/qna/controller/QnaController";

const router = express.Router();

router.post("/questions", createQuestion);

router.get("/questions/:productId", getQuestionsByProduct);

export default router;
