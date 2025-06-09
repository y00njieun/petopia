import express from "express";
import { getRecommendedProducts } from "../feature/cart/Recommend/RecommendedProductController";

const router = express.Router();

// GET /api/recommended-products
router.get("/", getRecommendedProducts);

export default router;