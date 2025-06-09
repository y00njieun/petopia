//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.

import { Request, Response } from 'express';
import { PaymentsService } from '../services/PaymentsService';

export class PaymentsController {
  async confirmPayment(req: Request, res: Response) {
    try {
      const { paymentKey, orderId, amount } = req.body;
      console.log('결제 승인 요청:', { paymentKey, orderId, amount });

      if (!paymentKey || !orderId || !amount) {
        return res.status(400).json({
          success: false,
          message: '필수 파라미터가 누락되었습니다.',
          received: { paymentKey, orderId, amount }
        });
      }

      const result = await PaymentsService.confirmPayment(paymentKey, orderId, amount);

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('결제 승인 실패:', error.response?.data || error);
      res.status(400).json({
        success: false,
        message: error.response?.data?.message || '결제 승인에 실패했습니다.',
        error: error.response?.data || error.message
      });
    }
  }

  async cancelPayment(req: Request, res: Response) {
    try {
      const { paymentKey, cancelReason } = req.body;

      if (!paymentKey || !cancelReason) {
        return res.status(400).json({
          success: false,
          message: '필수 파라미터가 누락되었습니다.'
        });
      }

      const result = await PaymentsService.cancelPayment(paymentKey, cancelReason);

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.response?.data?.message || '결제 취소에 실패했습니다.',
        error: error.response?.data || error.message
      });
    }
  }
}