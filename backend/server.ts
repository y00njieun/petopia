import { config } from "dotenv";
config();
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from './routes/AuthRoutes';
import ProductRoutes from "./routes/ProductRoutes";
import QnARoutes from "./routes/QnARoutes";
import OrderRoutes from "./routes/OrderRoutes";
import WishlistRoutes from "./routes/WishlistRoutes";
import CategoryRoutes from "./routes/CategoryRoutes";
import CartRoutes from "./routes/CartRoutes";
import productImageRoutes from "./routes/ProductImageRoutes";
import ProductImageUplordRoutes from "./routes/ProductImageUplordRoutes";
import addressRoutes from './routes/AddressRoutes';
import userRoutes from './routes/UserRoutes';
import path from "path";
import { errorHandler } from './middlewares/AuthMiddleware';
import PaymentRoutes from './routes/PaymentRoutes';
import RecommendedProductsRoutes from './routes/RecommendedProductsRoutes'

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // 프론트엔드 주소
    credentials: true, // 쿠키 전송을 위해 필요
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth 라우터 등록 (가장 먼저)
app.use('/api/auth', AuthRoutes);

// Users 라우터 등록 (Auth 다음에)
app.use('/api', userRoutes);

// product 라우트
app.use("/api", ProductRoutes);
app.use("/api", CategoryRoutes);
app.use("/api", WishlistRoutes);
app.use("/api/qna", QnARoutes);
// 이미지 업로드
app.use("/api/productImages", ProductImageUplordRoutes);
// 이미지 API 
app.use("/api", productImageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// 주문 라우터
app.use("/api/orders", OrderRoutes);

// 장바구니 라우터
app.use("/api/carts", CartRoutes);
// 추천상품 조회
app.use("/api/recommended-products", RecommendedProductsRoutes);

// 배송지 라우터 추가
app.use("/api/addresses", addressRoutes);

// 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// API 라우터 등록 (에러 핸들러 이전에 위치해야 함)
app.use('/api/payments', PaymentRoutes);

// 에러 처리 미들웨어를 마지막에 추가
app.use(errorHandler);

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
