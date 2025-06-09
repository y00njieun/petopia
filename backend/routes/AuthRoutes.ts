import express, { Request, Response, NextFunction } from 'express';
import { Auth } from '../feature/auth/domains/Auth';  // Auth 도메인 import
import passport from 'passport';
import { RowDataPacket } from 'mysql2';
import pool from '../config/dbConfig';
import { authenticateToken } from '../middlewares/AuthMiddleware';  // 경로 수정

const router = express.Router();

// 타입 안전한 비동기 핸들러
const asyncHandler = (handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// 회원가입
router.post('/signup', asyncHandler(async (req, res) => {
  const { signup } = await import('../feature/auth/controller/AuthController');
  await signup(req, res);
}));

// 아이디 중복 체크
router.get('/check-userid/:userId', asyncHandler(async (req, res) => {
  const { checkUserId } = await import('../feature/auth/controller/AuthController');
  await checkUserId(req, res);
}));

// 로그인
router.post('/login', asyncHandler(async (req, res) => {
  const { login } = await import('../feature/auth/controller/AuthController');
  await login(req, res);
}));

// 로그아웃
router.post('/logout', asyncHandler(async (req, res) => {
  const { logout } = await import('../feature/auth/controller/AuthController');
  await logout(req, res);
}));

// 카카오 로그인 콜백
router.post('/kakao/callback', asyncHandler(async (req, res) => {
  const { kakaoCallback } = await import('../feature/auth/controller/AuthController');
  await kakaoCallback(req, res);
}));

// 아이디 찾기
router.post('/find-userid', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: '이름과 이메일을 모두 입력해주세요.'
      });
    }

    const result = await Auth.findUserId({ name, email });

    res.json({
      success: true,
      userId: result.userId,
      message: `회원님의 아이디는 ${result.userId} 입니다.`
    });

  } catch (error) {
    console.error('아이디 찾기 실패:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '서버 오류가 발생했습니다.'
    });
  }
}));

// 비밀번호 재설정
router.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();  // 시작 시간 기록
  try {
    const { userId, name, phone } = req.body;
    
    // 비밀번호 재설정 시도 로그
    console.log(`[${new Date().toISOString()}] 비밀번호 재설정 시도 - IP: ${req.ip}`);
    console.log('[비밀번호 재설정 요청] 아이디:', userId, '이름:', name, '전화번호:', phone);

    if (!userId || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: '아이디, 이름, 휴대폰 번호를 모두 입력해주세요.'
      });
    }

    // 데이터베이스에서 사용자 찾기
    const [rows] = await pool.promise().query<RowDataPacket[]>(
      'SELECT user_id FROM Users WHERE user_id = ? AND name = ? AND phone = ?',
      [userId, name, phone]
    );

    if (rows.length === 0) {
      console.log(`[${new Date().toISOString()}] 비밀번호 재설정 실패 - IP: ${req.ip}, 소요시간: ${Date.now() - startTime}ms`);
      console.log('에러 상세: 일치하는 사용자를 찾을 수 없습니다.');
      return res.status(404).json({
        success: false,
        message: '일치하는 사용자 정보를 찾을 수 없습니다.'
      });
    }

    // 임시 비밀번호 생성 (8자리)
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // 비밀번호 해시화 및 업데이트
    const hashedPassword = await Auth.hashPassword(tempPassword);
    await pool.promise().query(
      'UPDATE UserAuth SET password = ? WHERE user_id = ?',
      [hashedPassword, rows[0].user_id]
    );

    // 성공 로그
    console.log(`[${new Date().toISOString()}] 비밀번호 재설정 성공 - IP: ${req.ip}, 사용자: ${userId}`);

    res.json({
      success: true,
      tempPassword: tempPassword,
      message: `임시 비밀번호: ${tempPassword}\n로그인 후 비밀번호를 변경해주세요.`
    });

  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    console.log(`[${new Date().toISOString()}] 비밀번호 재설정 실패 - IP: ${req.ip}, 소요시간: ${Date.now() - startTime}ms`);
    console.log('에러 상세:', error instanceof Error ? error.message : '알 수 없는 오류');
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '서버 오류가 발생했습니다.'
    });
  }
}));

export default router;
