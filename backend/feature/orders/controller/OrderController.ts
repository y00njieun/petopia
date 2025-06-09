//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.
import { Request, Response } from 'express';
import { fetchUserPoints, fetchDeliveryMessage, fetchUserAddress, fetchUserDetailsAddress, fetchOrderProducts, fetchShippingFee, fetchOrderSingleProduct, fetchOrderCartProduct, fetchInsertDeliveryInfo, fetchUpdateOrderStatus, fetchOrderCartItem } from '../services/OrderService';
import pool from '../../../config/dbConfig';
import { AuthenticatedRequest } from '../../auth/types/user';

const getUserPoints = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  console.log('getUserPoints 백앤드 userId', userId);
  try {
    const userPoints = await fetchUserPoints(userId);
    res.json(userPoints);
    
    console.log("orderController: ",userPoints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user points' });
  }
};

const getDeliveryMessage = async (req: Request, res: Response) => {
  try{
    const deliveryMessage = await fetchDeliveryMessage();
    res.json(deliveryMessage);
    console.log("배송메시지: ", deliveryMessage);
  } catch(err){
    res.status(500).json({error: '배송메시지 출력 실패'});
  }
};

const getUserAddress = async(req: Request, res: Response) => {
  const userId = req.params.userId as string;
  // console.log('백앤드 userId', userId);
  try{
    const userAddress = await fetchUserAddress(userId);
    res.json(userAddress);

    console.log('userAddress: ', userAddress);
  } catch(err){
    res.status(500).json({error: '배송정보 불러오기 실패'});
  }
};

//사용자 주소
const getUserDetailsAddress = async(req: Request, res: Response) => {
  const userId = req.params.userId as string;
  console.log('getUserDetailsAddress 백앤드 userId', userId);
  try{
    const userAddress = await fetchUserDetailsAddress(userId);
    res.json(userAddress);

    console.log('userDetailsAddress: ', userAddress);
  } catch(err){
    res.status(500).json({error: '배송리스트 정보 불러오기 실패'});
  }
};

const getOrderProducts = async(req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const {type} = req.query;
  const {orderId, productId} = req.query;
  console.log('[getOrderProducts 쿼리]', req.query);
  
  let selectedProductId: number[] = [];

  if (typeof productId === "string") {
    // productId가 단일 문자열일 경우, 쉼표로 분리하여 숫자 배열로 변환
    selectedProductId = productId.split(",").map(id => Number(id));
  } else if (Array.isArray(productId)) {
    // productId가 배열일 경우, 배열로 변환
    selectedProductId = productId.map(id => Number(id));
  }

  console.log('[getOrderProducts] 유저아이디, 타입, 선택된 상품 아이디들:', userId, type, selectedProductId,orderId);
  try{
    const orderProducts = await fetchOrderProducts(userId, type as string, selectedProductId,orderId as string);
    res.json(orderProducts);
    
    console.log('orderProducts: ', orderProducts);
  } catch(err){
    res.status(500).json({error: '주문 상품 정보 불러오기 실패'});
  }
};

const getOrderShipping = async(req: Request, res: Response) => {
  const userId = req.params.userId as string;
  try{
    console.log('[백엔드] 배송비 유저아이디', userId);
    const shippingFee = await fetchShippingFee(userId);
    res.json(shippingFee);
  } catch(err){
    res.status(500).json({error: '배송비 정보 가져오기 실패'});
  }
};

const postOrderSingleProduct = async(req: Request, res: Response) => {
  const {type, userId, totalAmount, discountAmount, finalAmount, shippingFee, statusId, items} = req.body;
  console.log('single Information', req.body);
  console.log('[백앤드] 상품데이터 유저아이디',userId);
  console.log('single Information', totalAmount, discountAmount);
  try{
    if(type === 'Single'){
      const {productId, quantity, selectedSize, selectedColor} = req.body;
      const orderId = await fetchOrderSingleProduct({
        userId, 
        productId, 
        quantity, 
        totalAmount, 
        discountAmount, 
        finalAmount, 
        shippingFee, 
        selectedSize, 
        selectedColor, 
        statusId
      });
      console.log("orderProductInfo",orderId);
      return res.json(orderId);
    } else if (type === 'Cart') {
      // 카트에서 주문하기
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: '장바구니에 상품이 없습니다.' });
      }

      //하나의 orderId 생성
      const orderId = await fetchOrderCartProduct({
        userId,
        totalAmount,
        discountAmount,
        finalAmount,
        shippingFee,
        statusId,
      });

      console.log("Cart Order Created, Order ID:", orderId);

      //생성된 orderId를 사용하여 각 상품을 저장
      const orderItemResults = [];
      for (const item of items) {
        const { product_id, product_count, option_size, option_color, order_status } = item;

        const orderItemId = await fetchOrderCartItem({
          orderId,  //같은 orderId를 사용
          productId: product_id,
          quantity: product_count,
          selectedSize: option_size,
          selectedColor: option_color,
          statusId: order_status || "OS001",  // 기본값 추가
        });

        orderItemResults.push(orderItemId);
      }

      console.log("Cart Order Items:", orderItemResults);
      return res.json({ success: true, orderId, orderItems: orderItemResults });

    } else {
      return res.status(400).json({ error: '잘못된 주문 유형입니다.' });
    }
  }catch(err){
    return res.status(500).json({error:'단일 상품 정보 저장 실패'});
  }
}

const postOrderDeliveryInfo = async(req: Request, res: Response) => {
  const {order_id, selectedAddress, selectedMessage} = req.body;
  console.log('orderInfoUpdate', req.body);
  try{
    const result = await fetchInsertDeliveryInfo(order_id, selectedAddress, selectedMessage);
    console.log('orderInfoUpdate result', result);
    res.json(result);
  } catch(err){
    res.status(500).json({error: '주문 배송지 정보 수정 실패'});
  }
}

const putOrderStatus = async(req: Request, res: Response) => {
  const {order_id} = req.body;
  console.log('putOrderStatus', req.body);
  try{
    const result = await fetchUpdateOrderStatus({order_id});
    console.log('putOrderStatus result', result);
    res.json(result);
  } catch(err){
    res.status(500).json({error: '주문 배송지 정보 수정 실패'});
  }
}

const getOrderHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const period = req.query.period as string || '1month';

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '인증되지 않은 사용자입니다.'
      });
    }

    // 기간에 따른 날짜 계산
    const today = new Date();
    let startDate = new Date();
    
    switch(period) {
      case '3month':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '6month':
        startDate.setMonth(today.getMonth() - 6);
        break;
      default: // 1month
        startDate.setMonth(today.getMonth() - 1);
    }

    // type 조건 제거하고 status_code 조건만 사용
    const query = `
      SELECT DISTINCT
        o.order_id,
        o.order_date,
        o.total_amount,
        o.status_id,
        c.description as status_name,
        (
          SELECT p.product_name 
          FROM OrderItems oi2 
          JOIN Products p ON oi2.product_id = p.product_id 
          WHERE oi2.order_id = o.order_id 
          LIMIT 1
        ) as product_name
      FROM Orders o
      LEFT JOIN Common c ON o.status_id = c.status_code
      WHERE o.user_id = ?
      AND o.order_date BETWEEN ? AND ?
      ORDER BY o.order_date DESC
    `;

    const [rows] = await pool.promise().query(query, [userId, startDate, today]);

    res.json({
      success: true,
      orders: rows
    });

  } catch (err) {
    console.error('주문내역 조회 실패:', err);
    res.status(500).json({
      success: false,
      message: '주문내역을 불러오는데 실패했습니다.',
      error: err instanceof Error ? err.message : String(err)
    });
  }
};

const cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: '인증되지 않은 사용자입니다.'
    });
  }

  try {
    // 주문 상태 확인
    const [orderRows] = await pool.promise().query(
      'SELECT status_id FROM Orders WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (!(orderRows as any[])[0]) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }

    const order = (orderRows as any[])[0];
    if (order.status_id !== 'OS001') {
      return res.status(400).json({
        success: false,
        message: '취소할 수 없는 주문 상태입니다.'
      });
    }

    // Common 테이블에서 취소 상태 코드 확인
    const [statusRows] = await pool.promise().query(
      'SELECT status_code FROM Common WHERE status_code = "OS004"'
    );

    if (!(statusRows as any[])[0]) {
      return res.status(500).json({
        success: false,
        message: '주문 취소 상태 코드가 존재하지 않습니다.'
      });
    }

    // 트랜잭션 시작
    const connection = await pool.promise().getConnection();
    await connection.beginTransaction();

    try {
      // 주문 상태 변경
      await connection.query(
        'UPDATE Orders SET status_id = "OS004" WHERE order_id = ?',
        [orderId]
      );

      // 주문 아이템 상태 변경
      await connection.query(
        'UPDATE OrderItems SET order_status = "OS004" WHERE order_id = ?',
        [orderId]
      );

      await connection.commit();
      res.json({
        success: true,
        message: '주문이 취소되었습니다.'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('주문 취소 실패:', err);
    res.status(500).json({
      success: false,
      message: '주문 취소에 실패했습니다.'
    });
  }
};

const getOrderDetail = async (req: AuthenticatedRequest, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: '인증되지 않은 사용자입니다.'
    });
  }

  try {
    const query = `
      SELECT 
        o.order_id,
        o.user_id,
        o.order_date,
        o.total_amount,
        o.status_id,
        oi.order_item_id,
        oi.product_id,
        p.product_name,
        oi.quantity,
        oi.price,
        oi.selected_size,
        oi.selected_color,
        oi.order_status,
        s.status_name,
        a.recipient_name,
        a.address,
        a.detailed_address,
        a.recipient_phone,
        d.delivery_message
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      JOIN OrderStatus s ON o.status_id = s.status_id
      JOIN OrderDeliveryInfo d ON o.order_id = d.order_id
      JOIN UserAddresses a ON d.address_id = a.address_id
      WHERE o.order_id = ? AND o.user_id = ?
    `;

    const [rows] = await pool.promise().query(query, [orderId, userId]);

    if (!(rows as any[])[0]) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }

    // 주문 상세용 상세 구조 유지
    const orderData = {
      orderId: (rows as any[])[0].order_id,
      orderInfo: {
        total_amount: (rows as any[])[0].total_amount,
        items: (rows as any[]).map(row => ({
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price,
          selected_size: row.selected_size,
          selected_color: row.selected_color
        })),
        delivery_info: {
          recipient_name: (rows as any[])[0].recipient_name,
          address: (rows as any[])[0].address,
          detailed_address: (rows as any[])[0].detailed_address,
          recipient_phone: (rows as any[])[0].recipient_phone,
          delivery_message: (rows as any[])[0].delivery_message
        }
      }
    };

    res.json({
      success: true,
      order: orderData
    });
  } catch (err) {
    console.error('주문 상세 조회 실패:', err);
    res.status(500).json({
      success: false,
      message: '주문 정보를 불러오는데 실패했습니다.'
    });
  }
};

export default {
  getUserPoints,
  getDeliveryMessage,
  getUserAddress,
  getUserDetailsAddress,
  getOrderProducts,
  getOrderShipping,
  postOrderSingleProduct,
  postOrderDeliveryInfo,
  putOrderStatus,
  getOrderHistory,
  cancelOrder,
  getOrderDetail
};
