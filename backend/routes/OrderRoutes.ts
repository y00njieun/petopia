import express from 'express'; // express 모듈을 임포트합니다.
import OrderController from "../feature/orders/controller/OrderController"; // OrderController 모듈을 임포트합니다.
import { authenticateToken } from '../middlewares/AuthMiddleware';
import { RequestHandler } from 'express';

const router = express.Router(); // express.Router()를 사용하여 라우터를 생성합니다.

router.get(`/UserPoints/:userId`, OrderController.getUserPoints); // GET 요청을 처리하기 위해 /UserPoints 경로와 OrderController의 getUserPoints 함수를 연결합니다.
router.get('/DeliveryMessage', OrderController.getDeliveryMessage);
router.get(`/UserAddress/:userId`, OrderController.getUserAddress);
router.get(`/UserDetailsAddress/:userId`, OrderController.getUserDetailsAddress);
router.get(`/OrderProducts/:userId`, OrderController.getOrderProducts);
router.get(`/OrderShippingFee/:userId`, OrderController.getOrderShipping);
// router.post(`/`, OrderController.postOrderSingleProduct);
router.post(`/`, async (req, res) => {
  try {
    await OrderController.postOrderSingleProduct(req, res); // 비동기 함수 호출
  } catch (error) {
    res.status(500).json({ error: '서버 오류: 주문 처리 실패' });
  }
});
router.put('/OrderInfoUpdate', OrderController.putOrderStatus);
router.post('/OrderInfoUpdate', OrderController.postOrderDeliveryInfo);

// 주문내역 조회
router.get(
  '/history', 
  authenticateToken as RequestHandler, 
  OrderController.getOrderHistory as RequestHandler
);

// 주문 취소
router.post(
  '/:orderId/cancel', 
  authenticateToken as RequestHandler, 
  OrderController.cancelOrder as RequestHandler
);

// 주문 상세 조회
router.get(
  '/:orderId', 
  authenticateToken as RequestHandler, 
  OrderController.getOrderDetail as RequestHandler
);

export default router; // 생성한 라우터를 내보내기 합니다.
