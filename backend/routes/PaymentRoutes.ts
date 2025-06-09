import express, { Request, Response } from 'express';
import { PaymentsController } from '../feature/payments/controller/PaymentsController';

const router = express.Router();
const paymentsController = new PaymentsController();

// 라우터 핸들러를 별도 함수로 분리
const handleConfirmPayment = async (req: Request, res: Response) => {
  await paymentsController.confirmPayment(req, res);
};

router.post('/confirm', handleConfirmPayment);

export default router; 