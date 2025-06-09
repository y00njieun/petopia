import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import AboutImage from '../../assets/About.jpg';
import './About.css';

const About = () => {
  return (
    <div>
      <Header />
      <div className="about-container">
        <div className="about-image">
          <img src={AboutImage} alt="About Us" />
        </div>
        <div className="about-text">
          <h1 className="about-title">ABOUT</h1>
          <p className="about-description">
            다양한 애견용품 브랜드를 한눈에 비교하고, 최상의 상품을 빠르게 찾아 구매할 수 있는 최적의 플랫폼입니다.
          </p>
          <p className="about-description">
            반려동물을 위한 최고의 용품을 쉽고 빠르게 선택할 수 있도록 도와드립니다. 믿을 수 있는 리뷰와 상세한 제품 정보로
            현명한 쇼핑을 경험하세요. 이제 복잡한 선택 과정을 손쉽게 해결하고, 반려동물에게 가장 적합한 용품을 바로 만나보세요!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;