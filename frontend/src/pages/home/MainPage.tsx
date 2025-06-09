import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../shared/axios/axios';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import ProductCard from '../product/ProductCard';


import homeImage from '../../assets/Home.jpg';
import aboutImage from '../../assets/Home2.jpg';
import bumImage from '../../assets/bum.jpg';

import "./MainPage.css";

interface Product {
  product_id: number;
  product_name: string;
  origin_price: number;
  discount_price : number;
  final_price: number;
  main_image: string;
  small_image: string;
}

const MainPage:React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("best");
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [bestRes, newRes] = await Promise.all([
          axiosInstance.get("/api/products/best"),
          axiosInstance.get("/api/products/recent"),
        ]);

        setBestProducts(bestRes.data);
        setNewProducts(newRes.data);
      } catch (error) {
        console.error("상품 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchProducts();
  }, []);

  const productsToShow = selectedCategory === "best" ? bestProducts : newProducts;

  return (
    <>
      <Header />
      <main className="mainContentMAIN">
      <section 
        className="heroSectionMAIN" 
         style={{ backgroundImage: `url(${homeImage})` }}
>
      <button 
        className="heroButtonMAIN" 
        onClick={() => navigate('/ProductList')}
        >
         SHOP NOW!
      </button>
       <h1 className="heroTitleMAIN">A BRAND FOR PETS!</h1>
      </section>
        <section className="sectionProductsMAIN">
          <div className="sectionTitleGroupMAIN">
            <button 
              className={`productButtonMAIN ${selectedCategory === "best" ? "activeButtonMAIN" : ""}`} 
              onClick={() => setSelectedCategory("best")}
            >
              BEST PRODUCT
            </button>
            <button 
              className={`productButtonMAIN ${selectedCategory === "new" ? "activeButtonMAIN" : ""}`} 
              onClick={() => setSelectedCategory("new")}
            >
              NEW PRODUCT
            </button>
          </div>

          <div className="productCardContainerMAIN">
            {productsToShow.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </section>

        <section 
          className="newProductsSectionMAIN" 
          onClick={() => navigate('/ProductList')}
        >
          <div className="newProductsContentMAIN">
            <div className="imageBlockMAIN">
              <img src={bumImage} alt="범퍼 침대" className="bumperImageMAIN" />
            </div>
            <div className="bumperBedContainerMAIN">
              <h2 className="newProductsTitleMAIN">New Products of the Month!</h2>
              <h2 className="bumperBedTitleMAIN">범퍼 침대</h2>
              <p>아이들이 좋아하는 러그와 이불 침대를<br />하나로 담은 올인원 범퍼 침대로<br />프리미엄 호텔 침구 원단을 사용해 더욱 포근합니다.</p>
            </div>
          </div>
        </section>

        <section 
          className="brandSectionMAIN" 
          style={{ backgroundImage: `url(${aboutImage})` }}
          onClick={() => navigate('/About')}
        >
          <h1 className="brandTitleMAIN">PETOPIA</h1>
          <p className="brandDescMAIN">펫 토피아는 우리 아이들이 건강하게 뛰어놀 수 있도록 안전하고<br />행복한 일상을 만들어주는 반려동물 전문 브랜드 입니다.</p>
          <button className="aboutButtonMAIN">ABOUT US</button>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default MainPage;
