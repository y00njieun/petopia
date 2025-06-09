import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { AddressController } from '../feature/address/controller/AddressController';
import { authenticateToken } from '../middlewares/AuthMiddleware';
import { AuthenticatedRequest } from '../feature/auth/types/user';

const router = express.Router();

// 타입이 지정된 에러 핸들링 미들웨어
type AsyncRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      // AuthenticatedRequest로 타입 단언
      await fn(req as AuthenticatedRequest, res, next);
    } catch (error) {
      console.error('라우트 에러 발생:', error);
      
      // MySQL 에러 타입 가드
      interface MySQLError {
        code: string;
        errno: number;
        sql: string;
      }

      // MySQL 에러 체크
      if (error && typeof error === 'object' && 'sql' in error) {
        const mysqlError = error as MySQLError;
        console.error('SQL 에러:', mysqlError.sql);
        console.error('에러 코드:', mysqlError.code);
      }

      // Error 객체 타입 가드
      if (error instanceof Error) {
        console.error('스택 트레이스:', error.stack);
      }

      res.status(500).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  };
};

// 배송지 관련 라우트
router.get('/', authenticateToken as RequestHandler, asyncHandler(AddressController.getAddresses));
router.post('/', authenticateToken as RequestHandler, asyncHandler(AddressController.addAddress));
router.delete('/:id', authenticateToken as RequestHandler, asyncHandler(AddressController.deleteAddress));
router.put('/:id/default', authenticateToken as RequestHandler, asyncHandler(AddressController.setDefaultAddress));

// 주소 수정 라우트 추가
router.put('/:id', authenticateToken as RequestHandler, asyncHandler(AddressController.updateAddress));

export default router; 