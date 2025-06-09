import { useState, useEffect } from "react";
import "./Cart.css";
import Button from "../../shared/ui/button";
import axiosInstance from "../../shared/axios/axios";
import Header from "../../widgets/header/Header";
import ProductCard from "../product/ProductCard";
import Footer from "../../widgets/footer/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setOrderId,
  setOrderType,
  setSelectedItems
} from "../order/orderRedux/slice";

// 장바구니 API에서 받아오는 원본 데이터 타입
interface RawCartItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  final_price: number;
  origin_price: number;
  quantity: number;
  selected_size: string;
  selected_color: string;
  main_image?: string;
}

type CartItem = {
  cartItemId: number;
  productId: string;
  name: string;
  price: number;
  origin_price: number;
  quantity: number;
  selected_size: string;
  selected_color: string;
  main_image?: string;
  selected?: boolean; // 선택 여부
};

interface Product {
  product_id: number;
  product_name: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  main_image: string;
  small_image: string;
}

const CartPage = () => {
  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productsToShow, setProductsToShow] = useState<Product[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        // 장바구니 조회
        const response = await axiosInstance.get(`api/carts/${userId}`);
        const rawItems = response.data as RawCartItem[];

        const baseURL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

        // 각 아이템의 main_image가 상대경로이면 절대경로로 변환
        const formattedItems = rawItems.map((item) => {
          // 기본 이미지 사이즈를 ProductDetail.tsx와 동일하게 500x500으로 설정
          let imageUrl = item.main_image || "https://placehold.co/500x500";
          if (!imageUrl.startsWith("http")) {
            imageUrl = `${baseURL}${imageUrl}`;
          }
          return {
            cartItemId: item.cart_item_id,
            productId: String(item.product_id),
            name: item.name,
            price: item.final_price ?? 0,
            origin_price: item.origin_price ?? item.final_price,
            quantity: Number(item.quantity),
            selected_size: item.selected_size,
            selected_color: item.selected_color,
            main_image: imageUrl,
            selected: false
          };
        });

        setCartItems(formattedItems);
        dispatch(setOrderType("OT001"));
      } catch (error) {
        console.error("장바구니 불러오기 실패:", error);
        alert("장바구니 정보를 불러올 수 없습니다.");
      }
    };

    const fetchRecommendedProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/products/best");
        // 데이터 형식에 따라 아래와 같이 변환합니다.
        const formattedProducts = (response.data as Product[]).map(
          (product) => ({
            product_id: product.product_id,
            product_name: product.product_name,
            origin_price: product.origin_price,
            discount_price: product.discount_price,
            final_price: product.final_price,
            main_image: product.main_image || "https://placehold.co/300x300",
            small_image: product.small_image || "https://placehold.co/150x150"
          })
        );
        setProductsToShow(formattedProducts);
      } catch (error) {
        console.error("추천 상품 불러오기 실패:", error);
      }
    };

    fetchCartItems();
    fetchRecommendedProducts();
  }, [dispatch, navigate]);

  // const productsToShow = selectedCategory === "best" ? bestProducts : newProducts;

  // 주문하기
  const handleOrder = async () => {
    if (!cartItems.length) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    const selectedItems = cartItems.filter((item) => item.selected);
    if (!selectedItems.length) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const selectedProductIds = selectedItems.map((item) =>
        Number(item.productId)
      );
      dispatch(setSelectedItems(selectedProductIds)); // Redux 상태에 product_id 저장

      // 각 아이템별 금액 계산
      const orderTotalAmount = selectedItems.reduce(
        (acc, item) => acc + item.origin_price * item.quantity,
        0
      );
      const discountAmount = selectedItems.reduce(
        (acc, item) => acc + (item.origin_price - item.price) * item.quantity,
        0
      );
      const finalAmount = selectedItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const shippingFee = 3000;
      const orderType = "OT001"; // 주문 타입 예시
      const statusId = "OS001"; // 주문 상태 예시

      const orderData = {
        type: "Cart",
        userId,
        statusId, // Orders 테이블에 들어갈 주문 상태
        totalAmount: orderTotalAmount,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        shippingFee: shippingFee,
        orderType: orderType,
        items: selectedItems.map((item) => ({
          product_id: String(item.productId), // 반드시 문자열로 변환
          order_status: statusId, // 주문 상태 (예: OS001)
          product_count: item.quantity, // 주문 수량
          option_size: item.selected_size,
          option_color: item.selected_color
        }))
      };
      console.log("orderData:", orderData);

      const response = await axiosInstance.post("/api/orders", orderData);

      dispatch(setOrderId(response.data.orderId));
      alert(
        `주문이 성공적으로 완료되었습니다! 주문번호: ${response.data.orderId}`
      );

      // 주문 완료 후 선택된 상품 제거 (또는 전체 재조회)
      setCartItems((prevItems) => prevItems.filter((item) => !item.selected));

      navigate("/order", { state: { orderData } });
    } catch (error) {
      console.error("주문 실패:", error);
      alert("주문 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 수량 증가 (로컬 상태 업데이트)
  const handleIncrease = async (cartItemId: number) => {
    try {
      await axiosInstance.put(`/api/carts/${cartItemId}/increase`);
    } catch (error) {
      console.error("수량 증가 API 호출 실패:", error);
    } finally {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          // 4) item.cartItemId 로 비교
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    }
  };

  // 수량 감소 (최소 수량 1)
  const handleDecrease = async (cartItemId: number) => {
    try {
      await axiosInstance.put(`/api/carts/${cartItemId}/decrease`);
    } catch (error) {
      console.error("수량 감소 API 호출 실패:", error);
    } finally {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        )
      );
    }
  };

  // 개별 삭제
  const handleRemove = async (cartItemId?: number) => {
    if (!cartItemId) {
      console.error("삭제할 cartItemId가 없습니다.", cartItemId);
      return;
    }
    console.log(`삭제 버튼 클릭됨. ID: ${cartItemId}`);

    try {
      await axiosInstance.delete(`/api/carts/${cartItemId}`);
      setCartItems((prev) =>
        prev.filter((item) => item.cartItemId !== cartItemId)
      );
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
  };

  // 선택 삭제
  const handleRemoveSelected = async () => {
    const selectedIds = cartItems
      .filter((item) => item.selected)
      .map((item) => item.cartItemId);

    console.log("삭제할 선택된 상품 ID들:", selectedIds); // ← 이 부분 확인

    if (selectedIds.length === 0) {
      alert("삭제할 항목을 먼저 선택하세요.");
      return;
    }

    try {
      await axiosInstance.delete(`/api/carts/${selectedIds}`, {
        data: { cartItemIds: selectedIds }
      });
      setCartItems((prev) => prev.filter((item) => !item.selected));
    } catch (error) {
      console.error("선택한 상품 삭제 실패:", error);
    }
  };

  // 전체 선택
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected: !selectAll
      }))
    );
  };

  // 개별 선택
  const handleSelectItem = (cartItemId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  // 총 금액 계산
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 약관동의
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      <Header />
      <div className="cart-page">
        <h1>장바구니</h1>
        <div className="cart-container">
          {/* 상품 리스트 */}
          <div className="cart-items">
            {cartItems.length > 0 ? (
              <>
                <div className="select-all">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    전체 선택
                  </label>
                  <Button
                    text="선택 삭제"
                    onClick={handleRemoveSelected}
                    className="remove-selected"
                  />
                </div>
                <hr className="divider" />
                {cartItems.map((item, index) => (
                  <div key={item.cartItemId || index} className="cart-item">
                    <input
                      type="checkbox"
                      aria-label={`장바구니 항목 ${item.name} 선택`}
                      checked={item.selected || false}
                      onChange={() => handleSelectItem(item.cartItemId)}
                    />
                    <img
                      src={item.main_image || "https://placehold.co/500x500"}
                      alt={item.name}
                    />
                    <div className="cart-item-details">
                      <p className="item-name">{item.name}</p>
                      {(item.selected_size || item.selected_color) && (
                        <p className="cart-item-selected">
                          {item.selected_size &&
                            `사이즈: ${item.selected_size}`}
                          {item.selected_size && item.selected_color && " / "}
                          {item.selected_color &&
                            `색상: ${item.selected_color}`}
                        </p>
                      )}
                      <p className="item-price">
                        {Math.round(item.price ?? 0).toLocaleString()}원
                      </p>
                    </div>
                    <div className="item-quantity">
                      <Button
                        text="-"
                        onClick={() => handleDecrease(item.cartItemId)}
                        className="quantity-button"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        aria-label="상품 수량"
                      />
                      <Button
                        text="+"
                        onClick={() => handleIncrease(item.cartItemId)}
                        className="quantity-button"
                      />
                    </div>
                    <Button
                      text="삭제"
                      onClick={() => {
                        console.log("삭제 버튼 클릭됨. ID:", item.cartItemId);
                        handleRemove(item.cartItemId);
                      }}
                      className="remove-item"
                    />
                  </div>
                ))}
              </>
            ) : (
              <p className="empty-cart">장바구니가 비어 있습니다.</p>
            )}
          </div>

          {/* 요약 정보 */}
          <aside className="cart-summary">
            <p className="summary-row">
              <span>상품금액:</span>{" "}
              <span>{totalAmount.toLocaleString()}원</span>
            </p>
            <p className="summary-row">
              <span>배송비:</span> <span>3,000원</span>
            </p>
            <p className="summary-row total">
              <span>결제예정금액:</span>{" "}
              <span>{(totalAmount + 3000).toLocaleString()}원</span>
            </p>
            <label className="terms">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />{" "}
              주문 내용을 확인했으며 동의합니다.
            </label>
            <Button
              text="주문하기"
              onClick={() =>
                isChecked
                  ? handleOrder()
                  : alert("주문 내용을 확인하고 동의해야 합니다.")
              }
              className="order-button"
              disabled={!isChecked}
            />
          </aside>
        </div>

        {/* 추천 상품 */}
        <section className="recommended-products">
          <h2>추천 상품</h2>
          <div className="productCardContainer">
            {productsToShow.length > 0 ? (
              productsToShow
                .slice(0, 3)
                .map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))
            ) : (
              <p className="empty-cart">추천 상품이 없습니다.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
