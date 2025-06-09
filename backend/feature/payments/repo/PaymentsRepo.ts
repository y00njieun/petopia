import pool from '../../../config/dbConfig';
import { Payment } from '../domains/Payments';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class PaymentsRepo {
  /**
   * 결제 정보를 저장하는 메서드
   * @param payment 저장할 결제 정보
   * @returns 생성된 결제 정보의 ID
   */
  static async savePayment(payment: Payment): Promise<number> {
    const connection = await pool.promise().getConnection();
    try {
      // 트랜잭션 시작 전 격리 수준 설정 (동시성 제어)
      await connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
      await connection.beginTransaction();

      // 필수 필드 검증
      if (!payment.order_id || !payment.payment_key) {
        throw new Error('Required payment fields are missing');
      }

      // 디버깅을 위한 로그
      console.log("=== Payment Debug Logs ===");
      console.log("Checking order_id:", payment.order_id);

     // 1️⃣ order_id 존재 여부 확인 - 수정
     const [orderRows] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM Orders WHERE order_id = ?`,
      [payment.order_id]
    );

    // 주문이 없으면 에러
    if (!orderRows || orderRows.length === 0) {
      throw new Error(`Order ID ${payment.order_id} does not exist.`);
    }

    // 주문 데이터 로깅
    console.log("Found order:", orderRows[0]);

    // 테이블 collation 확인
    const [tableInfo] = await connection.query(
      `SHOW CREATE TABLE Orders`
    );
    console.log("Orders table definition:", tableInfo);

    const [paymentInfo] = await connection.query(
      `SHOW CREATE TABLE Payment`
    );
    console.log("Payment table definition:", paymentInfo);

      // 2️⃣ payment_key 중복 체크
      const [paymentRows] = await connection.query<RowDataPacket[]>(
        `SELECT COUNT(*) as count FROM Payment WHERE payment_key = ?`,
        [payment.payment_key]
      );

      if (paymentRows[0].count > 0) {
        throw new Error(`Payment key ${payment.payment_key} already exists.`);
      }

      // 결제 수단 코드 매핑
      let paymentMethod = payment.payment_method;
      switch(payment.payment_method){
        case "간편결제":
          paymentMethod = "PM003";  // 모바일 결제
          break;
        case "카드":
          paymentMethod = "PM001";
          break;
        case "가상계좌":
          paymentMethod = "PM002";
          break;
        case "계좌이체":
          paymentMethod = "PM004";
          break;
        case "문화상품권":
          paymentMethod = "PM005";
          break;
        case "도서문화상품권":
          paymentMethod = "PM006";
          break;
      }

      // 결제 상태 코드 매핑
      let paymentStatus = payment.payment_status;
      switch(payment.payment_status){
        case "READY":
          paymentStatus = "PS001";  // 초기상태
          break;
        case "IN_PROGRESS":
          paymentStatus = "PS002";  // 인증완료
          break;
        case "WAITING_FOR_DEPOSIT":
          paymentStatus = "PS003";  // 입금예정
          break;
        case "DONE":
          paymentStatus = "PS004";  // 결제승인
          break;
        case "CANCELED":
          paymentStatus = "PS005";  // 결제취소
          break;
        case "PARTIAL_CANCELED":
          paymentStatus = "PS006";  // 부분취소
          break;
        case "ABORTED":
          paymentStatus = "PS007";  // 승인실패
          break;
        case "EXPIRED":
          paymentStatus = "PS008";  // 거래취소
          break;
        case "PAYMENT_COMPLETED":
          paymentStatus = "PS009";  // 결제완료
          break;
      }

      // 3️⃣ Payment 테이블에 결제 정보 저장
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO Payment 
        (order_id, payment_key, payment_type, order_name, payment_method, 
         final_price, balance_amount, discount_price, currency, payment_status, 
         requested_at, approved_at, mid) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payment.order_id,
          payment.payment_key,
          payment.payment_type,
          payment.order_name,
          paymentMethod,
          payment.final_price,
          payment.balance_amount || 0,  // null 방지
          payment.discount_price || 0,  // null 방지
          payment.currency || 'KRW',    // 기본값 설정
          paymentStatus,
          payment.requested_at,
          payment.approved_at,
          payment.mid
        ]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      console.error('payment error', error);
      await connection.rollback();
      if (error instanceof Error) {
        throw new Error(`Payment failed: ${error.message}`);
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getPaymentByKey(paymentKey: string): Promise<Payment | null> {
    const [rows] = await pool.promise().query<RowDataPacket[]>(
      'SELECT * FROM Payment WHERE payment_key = ?',
      [paymentKey]
    );
    return rows[0] as Payment || null;
  }

  static async updatePaymentStatus(paymentKey: string, status: string): Promise<void> {
    await pool.promise().query(
      'UPDATE Payment SET payment_status = ? WHERE payment_key = ?',
      [status, paymentKey]
    );
  }
}