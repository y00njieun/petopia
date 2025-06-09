import { useEffect, useState } from "react";
import axiosInstance from "../../shared/axios/axios";
import { useNavigate } from "react-router-dom";
import "../product/CSS/ProductCard.css"
import ProductCard from "../product/ProductCard";

interface Product {
  product_id: number;
  product_name: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  main_image: string;
  small_image: string;
}

const MyPageWishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [lastLikedProduct, setLastLikedProduct] = useState<Product | null>(null);
  const userId = localStorage.getItem("userId") || "guest";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        let storedWishlist: number[] = [];

        if (userId === "guest") {
          storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        } else {

          const response = await axiosInstance.get(`/api/wishlist?userId=${userId}`);
          storedWishlist = response.data.wishlist;
        }

        console.log("위시리스트 상품 ID 목록:", storedWishlist);
        setWishlist(storedWishlist);

        if (storedWishlist.length > 0) {
          const productResponse = await axiosInstance.get(
            `/api/productImages?ids=${storedWishlist.join(",")}&userId=${userId}`
          );
          
          console.log("상품 데이터 응답:", productResponse.data);

          let filteredProducts = productResponse.data.filter(
            (product: Product) => storedWishlist.includes(product.product_id)
          );

          if (lastLikedProduct) {
            filteredProducts = productResponse.data.filter(
              (p: Product) => p.product_id !== lastLikedProduct?.product_id
            );
          }

          setProducts(filteredProducts.slice(0, 2));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("위시리스트 불러오기 실패:", error);
      }
    };

    fetchWishlist();
  }, [userId, lastLikedProduct]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((id) => id !== product.product_id));
    setLastLikedProduct(product);
  };

  return (
    <div className="wishlist-container">
      <h3 className="mypage-wishlist-title">위시리스트</h3>
      <div className="products">
        {products.length === 0 ? (
          <p>위시리스트에 등록된 상품이 없습니다.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              isWishlisted={wishlist.includes(product.product_id)}
              toggleWishlist={() => toggleWishlist(product)}
            />
          ))
        )}
      </div>
      <button className="wishlist-all-btn" onClick={() => navigate("/wishlist")}>
        전체보기
      </button>
    </div>
  );
};

export default MyPageWishlist;
