import axios from 'axios';
import { PaymentsRepo } from '../repo/PaymentsRepo';
import { Payment } from '../domains/Payments';

export class PaymentsService {
  static async confirmPayment(paymentKey: string, orderId: string, amount: number): Promise<any> {
    try {
      console.log('토스페이먼츠 API 호출:', { paymentKey, orderId, amount });

      const response = await axios.post(
        'https://api.tosspayments.com/v1/payments/confirm',
        {
          paymentKey,
          orderId,
          amount,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.TOSS_SECRET_KEY}:`
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('토스페이먼츠 응답:', response.data);

      // 결제 정보 저장
      const payment: Payment = {
        order_id: orderId,
        payment_key: paymentKey,
        payment_type: 1, // 기본값
        order_name: response.data.orderName,
        payment_method: response.data.method,
        final_price: amount,
        balance_amount: amount,
        discount_price: 0,
        currency: 'KRW',
        payment_status: 'PAYMENT_COMPLETED',
        requested_at: new Date(),
        approved_at: new Date(),
        mid: response.data.mId
      };

      await PaymentsRepo.savePayment(payment);

      return response.data;
    } catch (error: any) {
      console.error('토스페이먼츠 API 에러:', error.response?.data || error);
      throw error;
    }
  }

  static async cancelPayment(paymentKey: string, cancelReason: string): Promise<any> {
    try {
      const response = await axios.post(
        `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
        {
          cancelReason
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.TOSS_SECRET_KEY}:`
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await PaymentsRepo.updatePaymentStatus(paymentKey, 'PAYMENT_CANCELED');
      return response.data;
    } catch (error) {
      console.error('결제 취소 실패:', error);
      throw error;
    }
  }
} 