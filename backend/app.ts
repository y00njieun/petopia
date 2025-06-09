import express from 'express';
import cors from 'cors';
import authRoutes from './routes/AuthRoutes';
import addressRoutes from './routes/AddressRoutes';
import userRoutes from './routes/UserRoutes';
import productRoutes from './routes/ProductRoutes';
// ... 다른 import들

const app = express();

// 미들웨어 설정
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/products', productRoutes);
// ... 다른 라우트들

// 라우트 테스트용 로그 추가
app.use((req, res, next) => {
  console.log('Request Method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request Body:', req.body);
  next();
});

// 404 에러 핸들러
app.use((req, res) => {
  console.log('404 에러 발생. 요청 URL:', req.url);
  res.status(404).json({ message: '요청하신 리소스를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('서버 에러:', err);
  res.status(500).json({ message: '서버 에러가 발생했습니다.' });
});

export default app; 