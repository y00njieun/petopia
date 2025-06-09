//엔티티 
//Table 객체로 변환 
//보통 클래스로 관리

// class Orders{
//   id: number;
// }

export interface Payment {
  payment_id?: number;
  order_id: string;
  payment_key: string;
  payment_type: number;
  order_name: string;
  payment_method: string;
  final_price: number;
  balance_amount: number;
  discount_price: number;
  currency: string;
  payment_status: string;
  requested_at: Date;
  approved_at?: Date;
  mid?: string;
}

export class Payments {
  constructor(private payment: Payment) {}

  static create(payment: Payment): Payments {
    return new Payments(payment);
  }

  getPayment(): Payment {
    return this.payment;
  }

  // 결제 상태 검증
  validateStatus(): boolean {
    const validStatuses = [
      'PAYMENT_READY',
      'PAYMENT_IN_PROGRESS',
      'PAYMENT_COMPLETED',
      'PAYMENT_CANCELED',
      'PAYMENT_FAILED',
      'PAYMENT_PARTIAL_CANCELED'
    ];
    return validStatuses.includes(this.payment.payment_status);
  }
}