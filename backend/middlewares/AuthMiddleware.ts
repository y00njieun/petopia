import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, TokenUser } from '../feature/auth/types/user';

interface AuthRequest extends Request {
  user?: any;
}

// JWT 토큰 검증 미들웨어
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 없습니다.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다.'
    });
  }
};

// 로그인 필요 여부 체크 미들웨어
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '로그인이 필요한 서비스입니다.'
    });
  }
  next();
};

// 관리자 권한 체크 미들웨어
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '관리자 권한이 필요합니다.'
    });
  }
  next();
};

// 에러 처리 미들웨어
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error details:', {
    path: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: err.stack
  });
  
  res.status(500).json({
    success: false,
    message: '서버 오류가 발생했습니다.',
    error: err.message
  });
};

// 비동기 핸들러 래퍼
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: '인증 토큰이 없습니다.' });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
        return;
      }

      (req as AuthenticatedRequest).user = {
        user_id: decoded.id,
        email: decoded.email
      };
      
      next();
    });
  } catch (error) {
    console.error('인증 미들웨어 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
};
