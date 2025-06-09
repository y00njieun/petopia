import { useEffect, useState } from "react";
import axiosInstance from "../../shared/axios/axios";
import ProductCard from "../product/ProductCard";
import "./CSS/ProductList.css";
import 배너 from"../../assets/배너.jpg"
import ProductToggle from "./ProductToggle";
import Footer from "../../widgets/footer/Footer"
import Header from "../../widgets/header/Header"

interface Product {
  product_id: number;
  product_name: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  created_at: string;
  main_image: string;
  small_image: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("recommended");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const userId = localStorage.getItem("userId") || "guest";

  useEffect(() => {
    axiosInstance
      .get("/api/productImages")
      .then((res) => {
        console.log("서버에서 받아온 상품 데이터:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error("상품 불러오기 실패:", err));

    if (userId === "guest") {
      const storedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      setWishlist(storedWishlist);
    } else {
      axiosInstance
        .get(`/api/wishlist?userId=${userId}`)
        .then((res) => setWishlist(res.data.wishlist))
        .catch((err) => console.error("위시리스트 불러오기 실패:", err));
    }
  }, [userId]);

  const toggleWishlist = async (productId: number, productName: string) => {
    try {
      let updatedWishlist: number[];
  
      if (userId === "guest") {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  
        if (storedWishlist.includes(productId)) {
          updatedWishlist = storedWishlist.filter((id: number) => id !== productId);
          alert(`${productName}이(가) 위시리스트에서 삭제되었습니다.`);
        } else {
          updatedWishlist = [...storedWishlist, productId];
          alert(`${productName}이(가) 위시리스트에 추가되었습니다!`);
        }
  
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      } else {
        if (wishlist.includes(productId)) {
          await axiosInstance.delete(`/api/wishlist/${productId}`);
          updatedWishlist = wishlist.filter((id) => id !== productId);
          alert(`${productName}이(가) 위시리스트에서 삭제되었습니다.`);
        } else {
          await axiosInstance.post("/api/wishlist", { userId, productId });
          updatedWishlist = [...wishlist, productId];
          alert(`${productName}이(가) 위시리스트에 추가되었습니다!`);
        }
      }
  
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("위시리스트 업데이트 실패:", error);
      alert("위시리스트 업데이트 중 오류가 발생했습니다.");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "sales":
        return b.discount_price - a.discount_price;
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "lowPrice":
        return a.final_price - b.final_price;
      case "highPrice":
        return b.final_price - a.final_price;
      default:
        return 0;
    }
  });
  
  return (
    <>
    <Header/>
    <div className="product-page">
      
      <div className="banner-container">
        <img className="bannerSize" src={배너} alt="배너" />
      </div>

      <div className="controls-container">
        <h2>상품 목록</h2>
        <ProductToggle sortOption={sortOption} setSortOption={setSortOption} />
      </div>

      <div className="products">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            isWishlisted={wishlist.includes(product.product_id)}
            toggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ProductList;
