import { useEffect, useState } from "react";
import "./OrderProductInfo.css"
import { OrderProducts, OrderUser } from "../model/OrderModel";
import {  fetchOrderProductImage, fetchOrderProducts } from "../api/Order";
import { useDispatch, useSelector } from "react-redux";
import { setOrderId, updateOrderInfo } from "../../../pages/order/orderRedux/slice";
import { RootState } from "../../../pages/order/orderRedux/store";
// import { RootState } from "../../../pages/order/orderRedux/store";

const OrderProduct: React.FC<OrderUser> = ({userId}) => {
  
  const dispatch = useDispatch();
  // const userId = useSelector((state:RootState) => state.order.user_id);
  const [orderProducts, setOrderProducts] = useState<OrderProducts[]>([]);
  const orderType = useSelector((state:RootState) => state.order.orderType);
  const selectedProductIds = useSelector((state: RootState) => state.order.selectedItems);
  const orderId = useSelector((state:RootState) => state.order.order_id);
  useEffect(() => {
    const getOrderProduct = async () => {
      try{
        console.log("[프론트 상품]", orderId);
        const productInfo = await fetchOrderProducts(userId,orderType,selectedProductIds, orderId);
        console.log('제품 정보 가져오기 성공:', productInfo);
        if(productInfo && productInfo.length > 0) {
          const transformedProduct = await Promise.all(productInfo.map(async (product) => {
            const order_id = product.order_id;
            dispatch(setOrderId(order_id));
            let imageUrl;
            try {
              imageUrl = await fetchOrderProductImage(product.product_id);
              // if (!imageUrl) {
              //   imageUrl = 'https://placehold.co/500x500'; // 기본 이미지 URL 설정
              // }
            } catch (error) {
              console.error(`이미지를 가져오는 데 실패했습니다. 상품 ID: ${product.product_id}`, error);
              // 이미지가 없는 경우 기본 이미지 URL 설정
              imageUrl = 'https://placehold.co/300x300';
            }
            if(imageUrl !== 'https://placehold.co/300x300'){

              const baseURL = import.meta.env.VITE_API_BASE_URL;
              imageUrl = `${baseURL}/${imageUrl}`;
            }
            console.log('이미지 URL', imageUrl);
            return {
              ...product,
              final_price: Number(product.final_amount.toString().replace(/,/g, '')) / product.product_count,
              main_image: imageUrl,
            };
          }));
          setOrderProducts(transformedProduct);
          console.log('제품정보', transformedProduct);
          dispatch(updateOrderInfo(transformedProduct));
        }
        console.log('제품 정보 : ', productInfo);
      } catch(err){
        console.error('주문하려는 제품의 정보를 가져오지 못했습니다.', err);
      }
    };
    getOrderProduct();
  },[dispatch, userId]);


  return (
    <div className="orderProductContainer">
      {orderProducts.map((data,index)=> (
        <div className="repeatProduct" key={index}>
          <div className="midLeft">
            <img src={data.main_image} alt={data.product_name} className="productImg"/>
          </div>
          <div className="midRight">
            <div className="productName">{data.product_name}</div>
            <div className="productType">종류: 강아지용 | 사이즈: {data.option_size} {data.option_color && `| 색상: ${data.option_color}`}</div>
            <div className="productPrice">{data.final_price.toLocaleString()}원 x {data.product_count}개</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderProduct;