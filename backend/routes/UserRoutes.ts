import express from 'express';
import { UserController } from '../feature/user/controller/UserController';
import { authenticateToken } from '../middlewares/AuthMiddleware';
import { asyncHandler } from '../middlewares/AuthMiddleware';

const router = express.Router();

// 프로필 관련 라우트
router.get('/users/profile', authenticateToken, asyncHandler(UserController.getProfile));
router.put('/users/profile', authenticateToken, asyncHandler(UserController.updateProfile));
router.put('/users/password', authenticateToken, asyncHandler(UserController.updatePassword));

// 배송지 관련 라우트
router.get('/addresses', authenticateToken, asyncHandler(UserController.getAddresses));
router.post('/addresses', authenticateToken, asyncHandler(UserController.addAddress));
router.put('/addresses/:id/default', authenticateToken, asyncHandler(UserController.setDefaultAddress));
router.delete('/addresses/:id', authenticateToken, asyncHandler(UserController.deleteAddress));

export default router; 