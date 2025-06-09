import "./App.css";
import { Routes, Route } from 'react-router-dom';
import MainPage from "../pages/home/MainPage";
// import TestPage from "../pages/home/TestPage";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";
import Order from "../pages/order/Order";
import Payment from "../pages/payments/Payments";
import FindAccount from '../pages/login/FindAccount';
import Signup from "../pages/login/Signup";
import ProductCreate from "../pages/product/ProductCreate";
import ProductList from "../pages/product/ProductList";
import MyPage from "../pages/profile/MyPage";
import ProductDetail from "../pages/product/ProductDetail";
import Wishlist from "../pages/wishlist/WishList";
import ProductBoard from "../pages/product/ProductBoard";
import KakaoCallback from "../pages/login/KakaoCallback";
import PaymentSuccess from '../pages/payments/PaymentSuccess';
import PaymentFail from '../pages/payments/PaymentFail';
import MDashBoard from "../pages/manager/MDashBoard";
import MProduct from "../pages/manager/MProduct";
import About from "../pages/home/About";
import Support from "../pages/home/Support";
import ProfileSettings from "../pages/profile/ProfileSettings";
import OrderComplete from '../pages/order/OrderComplete';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      {/* <Route path="/" element={<TestPage />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order" element={<Order />} />
      <Route path="/payments" element={<Payment />} />
      <Route path="/payments/success" element={<PaymentSuccess />} />
      <Route path="/payments/fail" element={<PaymentFail />} />
      <Route path="/ProductCreate" element={<ProductCreate />} />
      <Route path="/product-create/:productId" element={<ProductCreate />} />
      <Route path="/find-account" element={<FindAccount />} />
      <Route path="/ProductList" element={<ProductList />} />        
      <Route path="/MyPage" element={<MyPage/>} />    
      <Route path="/products/:product_id" element={<ProductDetail />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/ProductBoard" element={<ProductBoard />} />
      <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
      <Route path="/MDashBoard" element={<MDashBoard />} />
      <Route path="/MProduct" element={<MProduct />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/About" element={<About />} />
      <Route path="/Support" element={<Support />} />
      <Route path="/profile/settings" element={<ProfileSettings />} />
      <Route path="/order/complete" element={<OrderComplete />} />
    </Routes>
  );
}

export default App;
