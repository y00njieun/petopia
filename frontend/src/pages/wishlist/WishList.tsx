import { useEffect, useState } from "react";
import axiosInstance from "../../shared/axios/axios";
import ProductCard from "../product/ProductCard";
import "./CSS/WishList.css";
import Header from "../../widgets/header/Header";
import Footer from "../../widgets/footer/Footer";
import ProductToggle from "../product/ProductToggle";

interface Product {
  product_id: number;
  product_name: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  main_image: string;
  small_image: string;
}

const WishList: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const userId = localStorage.getItem("userId") !== null ? localStorage.getItem("userId") : "guest";
  const [sortOption, setSortOption] = useState<string>("recommended");

  console.log("현재 로그인된 userId:", userId);
  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        let storedWishlist: number[] = [];
        if (userId === "guest") {
          storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        } else {
          const response = await axiosInstance.get(
            `/api/wishlist?userId=${userId}`
          );
          storedWishlist = response.data.wishlist;
        }
  
        console.log("위시리스트 상품 ID 목록:", storedWishlist);
  
        setWishlist(storedWishlist);
  
        if (storedWishlist.length > 0) {
          const productResponse = await axiosInstance.get(
            `/api/productImages?ids=${storedWishlist.join(",")}&userId=${userId}`
          );
  
          console.log(" 상품 데이터 응답:", productResponse.data);
  
          const filteredProducts = productResponse.data.filter(
            (product: Product) => storedWishlist.includes(product.product_id)
          );
  
          setProducts(filteredProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("위시리스트 불러오기 실패:", error);
      }
    };
  
    fetchWishlist();
  }, [userId]);

  const handleRemoveWishlist = async (productId: number) => {
    try {
      await axiosInstance.delete(`/api/wishlist/${productId}?userId=${userId}`);
  
      setWishlist((prev) => prev.filter((id) => id !== productId));
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product_id !== productId)
      );
  
      console.log(`위시리스트에서 ${productId} 제거 완료`);
    } catch (error) {
      console.error("위시리스트 삭제 실패:", error);
    }
  };
  
  return (
    <>
    <Header />
      <div className="wishlist-page">
        <div className="title-togle">
          <h2>위시리스트</h2>
          <div className="togle-size">
            <ProductToggle sortOption={sortOption} setSortOption={setSortOption} />
          </div>
        </div>
        <div className="products">
          {products.length === 0 ? (
            <p>위시리스트에 등록된 상품이 없습니다.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                isWishlisted={wishlist.includes(product.product_id)}
                toggleWishlist={() => handleRemoveWishlist(product.product_id)}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishList;
