# 🐶Ecommerce - Petopia🐶

<대표 이미지 삽입 예정>

## 📖Description

반려동물과 반려인을 위한 이커머스를 구현하였습니다.

조금 더 쉽게 반려용품에 다가갈 수 있습니다.

## 💻Demo & Deployment

<Demo 화면녹화본 추가 예정>

Deployment : <URL 추가 예정>

### 🏁Getting Started

git clone

```
git clone https://github.com/nextrunners5/Full_3_1team
cd Full_3_1team
```

Frontend

```
cd frontend

npm install (의존성 설치)

npm run dev
```

Backend

```
cd backend

npm install (의존성 설치)

npx ts-node server.ts
```

## ✏️Main Feature

### 회원가입 및 로그인, SNS 로그인

* JWT, KAKAO API 이용

### 상품관리

* 관리자 페이지 상품 등록 및 사용자 상품 조회, 장바구니, 주문하기 기능 구현

### 결제 기능

* Toss payments API 이용

### 기타 기능

* 마이페이지
* 배송지 주소 - KAKAO ADDRESS API 이용

## 🛠️Stack

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/zoom-0B5CFF?style=for-the-badge&logo=zoom&logoColor=white">
<img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white">

<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/nodedotjs-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white">

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/typescript-3178C6?style=flat-square&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white">

<img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white">
<img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white">


## 📁Project Structure

### Frontend

```
📦frontend
 ┣ 📂node_modules
 ┣ 📂public
 ┃ ┗ 📜vite.svg
 ┣ 📂src
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📜App.css
 ┃ ┃ ┗ 📜App.tsx
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📜About.jpg
 ┃ ┃ ┣ 📜Bell.png
 ┃ ┃ ┣ 📜Cart.png
 ┃ ┃ ┣ 📜Fail.png
 ┃ ┃ ┣ 📜Home.jpg
 ┃ ┃ ┣ 📜Home2.jpg
 ┃ ┃ ┣ 📜My.png
 ┃ ┃ ┣ 📜Search.png
 ┃ ┃ ┣ 📜bum.jpg
 ┃ ┃ ┣ 📜complete.png
 ┃ ┃ ┣ 📜pc200.jpg
 ┃ ┃ ┣ 📜pc60.jpg
 ┃ ┃ ┣ 📜react.svg
 ┃ ┃ ┗ 📜배너.jpg
 ┃ ┣ 📂components
 ┃ ┃ ┗ 📜LogoutButton.tsx
 ┃ ┣ 📂entities
 ┃ ┃ ┣ 📜auth.ts
 ┃ ┃ ┣ 📜cart.ts
 ┃ ┃ ┣ 📜order.ts
 ┃ ┃ ┣ 📜payments.ts
 ┃ ┃ ┗ 📜product.ts
 ┃ ┣ 📂features
 ┃ ┃ ┣ 📂address
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📜Address.ts
 ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┃ ┗ 📜Address.ts
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┃ ┣ 📜AddressModal.css
 ┃ ┃ ┃ ┃ ┗ 📜AddressModal.tsx
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📜Auth.ts
 ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┃ ┗ 📜AuthModel.ts
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┃ ┗ 📜Login.tsx
 ┃ ┃ ┣ 📂cart
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📜Cart.ts
 ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┃ ┗ 📜CartModel.ts
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┃ ┗ 📜Cart.tsx
 ┃ ┃ ┣ 📂order
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📜Order.ts
 ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┃ ┗ 📜OrderModel.ts
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┃ ┣ 📜Order.css
 ┃ ┃ ┃ ┃ ┣ 📜Order.tsx
 ┃ ┃ ┃ ┃ ┣ 📜OrderCouponPint.css
 ┃ ┃ ┃ ┃ ┣ 📜OrderCouponPoint.tsx
 ┃ ┃ ┃ ┃ ┣ 📜OrderDeliveryAddModal.css
 ┃ ┃ ┃ ┃ ┣ 📜OrderDeliveryAddModal.tsx
 ┃ ┃ ┃ ┃ ┣ 📜OrderDeliveryInfo.css
 ┃ ┃ ┃ ┃ ┣ 📜OrderDeliveryInfo.tsx
 ┃ ┃ ┃ ┃ ┣ 📜OrderDeliveryModal.css
 ┃ ┃ ┃ ┃ ┣ 📜OrderDeliveryModal.tsx
 ┃ ┃ ┃ ┃ ┣ 📜OrderDeliveryUpdateModal.css
 ┃ ┃ ┃ ┃ ┣ 📜OrderDeliveryUpdateModal.tsx
 ┃ ┃ ┃ ┃ ┣ 📜OrderPay.css
 ┃ ┃ ┃ ┃ ┣ 📜OrderPay.tsx
 ┃ ┃ ┃ ┃ ┣ 📜OrderPrice.css
 ┃ ┃ ┃ ┃ ┣ 📜OrderPrice.tsx
 ┃ ┃ ┃ ┃ ┣ 📜OrderProductInfo.css
 ┃ ┃ ┃ ┃ ┗ 📜OrderProductInfo.tsx
 ┃ ┃ ┣ 📂orders
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📜Order.ts
 ┃ ┃ ┃ ┗ 📂model
 ┃ ┃ ┃ ┃ ┗ 📜Order.ts
 ┃ ┃ ┣ 📂payments
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📜Payments.ts
 ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┃ ┗ 📜PaymentsModel.ts
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┃ ┗ 📜Payments.tsx
 ┃ ┃ ┣ 📂product
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📜Product.ts
 ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┃ ┗ 📜ProductModel.ts
 ┃ ┃ ┃ ┣ 📂product-form
 ┃ ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┃ ┣ 📜CreateProduct.ts
 ┃ ┃ ┃ ┃ ┃ ┗ 📜EditProduct.ts
 ┃ ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ProductFormModel.ts
 ┃ ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ProductForm.tsx
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┃ ┗ 📜Product.tsx
 ┃ ┃ ┣ 📂review
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┗ 📂summary
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📂cart
 ┃ ┃ ┃ ┣ 📜Cart.tsx
 ┃ ┃ ┃ ┗ 📜cart.css
 ┃ ┃ ┣ 📂home
 ┃ ┃ ┃ ┣ 📜About.css
 ┃ ┃ ┃ ┣ 📜About.tsx
 ┃ ┃ ┃ ┣ 📜MainPage.css
 ┃ ┃ ┃ ┣ 📜MainPage.tsx
 ┃ ┃ ┃ ┣ 📜Support.css
 ┃ ┃ ┃ ┣ 📜Support.tsx
 ┃ ┃ ┃ ┣ 📜TestPage.css
 ┃ ┃ ┃ ┗ 📜TestPage.tsx
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┣ 📜FindAccount.css
 ┃ ┃ ┃ ┣ 📜FindAccount.tsx
 ┃ ┃ ┃ ┣ 📜KakaoCallback.css
 ┃ ┃ ┃ ┣ 📜KakaoCallback.tsx
 ┃ ┃ ┃ ┣ 📜Login.css
 ┃ ┃ ┃ ┣ 📜Login.tsx
 ┃ ┃ ┃ ┣ 📜Signup.css
 ┃ ┃ ┃ ┗ 📜Signup.tsx
 ┃ ┃ ┣ 📂manager
 ┃ ┃ ┃ ┣ 📜MDashBoard.css
 ┃ ┃ ┃ ┣ 📜MDashBoard.tsx
 ┃ ┃ ┃ ┣ 📜MProduct.css
 ┃ ┃ ┃ ┗ 📜MProduct.tsx
 ┃ ┃ ┣ 📂order
 ┃ ┃ ┃ ┣ 📂orderRedux
 ┃ ┃ ┃ ┃ ┣ 📜slice.tsx
 ┃ ┃ ┃ ┃ ┗ 📜store.tsx
 ┃ ┃ ┃ ┣ 📜Order.css
 ┃ ┃ ┃ ┣ 📜Order.tsx
 ┃ ┃ ┃ ┣ 📜OrderBoard.tsx
 ┃ ┃ ┃ ┣ 📜OrderComplete.css
 ┃ ┃ ┃ ┣ 📜OrderComplete.tsx
 ┃ ┃ ┃ ┗ 📜OrderDetail.tsx
 ┃ ┃ ┣ 📂payments
 ┃ ┃ ┃ ┣ 📜PaymentFail.tsx
 ┃ ┃ ┃ ┣ 📜PaymentSuccess.tsx
 ┃ ┃ ┃ ┗ 📜Payments.tsx
 ┃ ┃ ┣ 📂product
 ┃ ┃ ┃ ┣ 📂CSS
 ┃ ┃ ┃ ┃ ┣ 📜ProductBoard.css
 ┃ ┃ ┃ ┃ ┣ 📜ProductCard.css
 ┃ ┃ ┃ ┃ ┣ 📜ProductCreate.css
 ┃ ┃ ┃ ┃ ┣ 📜ProductDetail.css
 ┃ ┃ ┃ ┃ ┣ 📜ProductImg.css
 ┃ ┃ ┃ ┃ ┗ 📜ProductList.css
 ┃ ┃ ┃ ┣ 📜ProductBoard.tsx
 ┃ ┃ ┃ ┣ 📜ProductCard.tsx
 ┃ ┃ ┃ ┣ 📜ProductCreate.tsx
 ┃ ┃ ┃ ┣ 📜ProductDetail.tsx
 ┃ ┃ ┃ ┣ 📜ProductEdit.tsx
 ┃ ┃ ┃ ┣ 📜ProductImg.tsx
 ┃ ┃ ┃ ┣ 📜ProductList.tsx
 ┃ ┃ ┃ ┗ 📜ProductToggle.tsx
 ┃ ┃ ┣ 📂profile
 ┃ ┃ ┃ ┣ 📜MyPage.css
 ┃ ┃ ┃ ┣ 📜MyPage.tsx
 ┃ ┃ ┃ ┣ 📜ProfileSettings.css
 ┃ ┃ ┃ ┗ 📜ProfileSettings.tsx
 ┃ ┃ ┣ 📂qna
 ┃ ┃ ┃ ┣ 📂CSS
 ┃ ┃ ┃ ┃ ┣ 📜QnaList.css
 ┃ ┃ ┃ ┃ ┗ 📜QnaModal.css
 ┃ ┃ ┃ ┣ 📜QnaList.tsx
 ┃ ┃ ┃ ┗ 📜QnaModal.tsx
 ┃ ┃ ┣ 📂review
 ┃ ┃ ┃ ┣ 📂CSS
 ┃ ┃ ┃ ┃ ┗ 📜Review.css
 ┃ ┃ ┃ ┗ 📜Review.tsx
 ┃ ┃ ┣ 📂wishlist
 ┃ ┃ ┃ ┣ 📂CSS
 ┃ ┃ ┃ ┃ ┣ 📜MyPageWish.css
 ┃ ┃ ┃ ┃ ┗ 📜WishList.css
 ┃ ┃ ┃ ┣ 📜MyPageWish.tsx
 ┃ ┃ ┃ ┗ 📜WishList.tsx
 ┃ ┃ ┗ 📜DashBoard.tsx
 ┃ ┣ 📂shared
 ┃ ┃ ┣ 📂axios
 ┃ ┃ ┃ ┣ 📜QnAAxios.ts
 ┃ ┃ ┃ ┗ 📜axios.ts
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┗ 📜authHook.ts
 ┃ ┃ ┣ 📂style
 ┃ ┃ ┃ ┣ 📜FailModal.css
 ┃ ┃ ┃ ┣ 📜PayCompleteModal.css
 ┃ ┃ ┃ ┗ 📜button.css
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┗ 📜ProductType.ts
 ┃ ┃ ┣ 📂ui
 ┃ ┃ ┃ ┣ 📜AddressSearch.css
 ┃ ┃ ┃ ┣ 📜AddressSearch.tsx
 ┃ ┃ ┃ ┣ 📜FailModal.tsx
 ┃ ┃ ┃ ┣ 📜InputField.tsx
 ┃ ┃ ┃ ┣ 📜PayCompleteModal.tsx
 ┃ ┃ ┃ ┗ 📜button.tsx
 ┃ ┃ ┗ 📂utils
 ┃ ┃ ┃ ┗ 📜utils.ts
 ┃ ┣ 📂widgets
 ┃ ┃ ┣ 📂Cupon
 ┃ ┃ ┃ ┣ 📜CuponModal.css
 ┃ ┃ ┃ ┗ 📜CuponModal.tsx
 ┃ ┃ ┣ 📂M-header
 ┃ ┃ ┃ ┣ 📜M-header.css
 ┃ ┃ ┃ ┗ 📜M-header.tsx
 ┃ ┃ ┣ 📂M-sidebar
 ┃ ┃ ┃ ┣ 📜M-sidebar.css
 ┃ ┃ ┃ ┗ 📜M-sidebar.tsx
 ┃ ┃ ┣ 📂footer
 ┃ ┃ ┃ ┣ 📜Footer.css
 ┃ ┃ ┃ ┗ 📜Footer.tsx
 ┃ ┃ ┣ 📂header
 ┃ ┃ ┃ ┣ 📜Header.css
 ┃ ┃ ┃ ┗ 📜Header.tsx
 ┃ ┃ ┣ 📂product-card
 ┃ ┃ ┃ ┣ 📜ProductCard.css
 ┃ ┃ ┃ ┗ 📜ProductCard.tsx
 ┃ ┃ ┗ 📂slider
 ┃ ┃ ┃ ┣ 📜Slider.css
 ┃ ┃ ┃ ┗ 📜Slider.tsx
 ┃ ┣ 📜index.css
 ┃ ┣ 📜main.tsx
 ┃ ┗ 📜vite-env.d.ts
 ┣ 📜.env
 ┣ 📜.gitignore
 ┣ 📜eslint.config.js
 ┣ 📜index.html
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜tsconfig.app.json
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.node.json
 ┗ 📜vite.config.ts
```

### backend

```
📦backend
 ┣ 📂config
 ┃ ┗ 📜dbConfig.ts
 ┣ 📂dist
 ┃ ┗ 📜server.js
 ┣ 📂feature
 ┃ ┣ 📂address
 ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┗ 📜AddressController.ts
 ┃ ┃ ┣ 📂domains
 ┃ ┃ ┃ ┗ 📜Address.ts
 ┃ ┃ ┣ 📂repo
 ┃ ┃ ┃ ┗ 📜AddressRepo.ts
 ┃ ┃ ┗ 📂services
 ┃ ┃ ┃ ┗ 📜AddressService.ts
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┗ 📜AuthController.ts
 ┃ ┃ ┣ 📂domains
 ┃ ┃ ┃ ┗ 📜Auth.ts
 ┃ ┃ ┣ 📂repo
 ┃ ┃ ┃ ┗ 📜AuthRepo.ts
 ┃ ┃ ┣ 📂services
 ┃ ┃ ┃ ┗ 📜AuthService.ts
 ┃ ┃ ┗ 📂types
 ┃ ┃ ┃ ┗ 📜user.ts
 ┃ ┣ 📂cart
 ┃ ┃ ┣ 📂Recommend
 ┃ ┃ ┃ ┗ 📜RecommendedProductController.ts
 ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┗ 📜CartController.ts
 ┃ ┃ ┣ 📂domains
 ┃ ┃ ┃ ┗ 📜Cart.ts
 ┃ ┃ ┣ 📂repo
 ┃ ┃ ┃ ┗ 📜CartRepo.ts
 ┃ ┃ ┗ 📂services
 ┃ ┃ ┃ ┗ 📜CartService.ts
 ┃ ┣ 📂orders
 ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┗ 📜OrderController.ts
 ┃ ┃ ┣ 📂domains
 ┃ ┃ ┃ ┗ 📜Orders.ts
 ┃ ┃ ┣ 📂repo
 ┃ ┃ ┃ ┗ 📜OrderRepo.ts
 ┃ ┃ ┗ 📂services
 ┃ ┃ ┃ ┗ 📜OrderService.ts
 ┃ ┣ 📂payments
 ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┗ 📜PaymentsController.ts
 ┃ ┃ ┣ 📂domains
 ┃ ┃ ┃ ┗ 📜Payments.ts
 ┃ ┃ ┣ 📂repo
 ┃ ┃ ┃ ┗ 📜PaymentsRepo.ts
 ┃ ┃ ┗ 📂services
 ┃ ┃ ┃ ┣ 📜PaymentsService.ts
 ┃ ┃ ┃ ┗ 📜PaymentsrService.ts
 ┃ ┣ 📂product
 ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┣ 📜CategoryController.ts
 ┃ ┃ ┃ ┣ 📜MainProductController.ts
 ┃ ┃ ┃ ┗ 📜ProductController.ts
 ┃ ┃ ┣ 📂domains
 ┃ ┃ ┃ ┗ 📜Product.ts
 ┃ ┃ ┣ 📂img
 ┃ ┃ ┃ ┣ 📜ProductImage.ts
 ┃ ┃ ┃ ┗ 📜productImageController.ts
 ┃ ┃ ┣ 📂repo
 ┃ ┃ ┃ ┗ 📜ProductRepo.ts
 ┃ ┃ ┗ 📂services
 ┃ ┃ ┃ ┗ 📜ProductService.ts
 ┃ ┣ 📂qna
 ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┗ 📜QnaController.ts
 ┃ ┃ ┣ 📂domains
 ┃ ┃ ┃ ┗ 📜Product.ts
 ┃ ┃ ┣ 📂repo
 ┃ ┃ ┃ ┗ 📜QnaRepo.ts
 ┃ ┃ ┗ 📂services
 ┃ ┃ ┃ ┗ 📜qna.ts
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┗ 📜UserController.ts
 ┃ ┃ ┣ 📂domains
 ┃ ┃ ┃ ┗ 📜User.ts
 ┃ ┃ ┣ 📂repo
 ┃ ┃ ┃ ┗ 📜UserRepo.ts
 ┃ ┃ ┣ 📂services
 ┃ ┃ ┃ ┗ 📜UserService.ts
 ┃ ┃ ┗ 📂types
 ┃ ┃ ┃ ┗ 📜user.ts
 ┃ ┗ 📂wishlist
 ┃ ┃ ┗ 📂controller
 ┃ ┃ ┃ ┗ 📜WishlistController.ts
 ┣ 📂middlewares
 ┃ ┣ 📜AuthMiddleware.ts
 ┃ ┗ 📜multer.ts
 ┣ 📂node_modules
 ┣ 📂routes
 ┃ ┣ 📜AddressRoutes.ts
 ┃ ┣ 📜AuthRoutes.ts
 ┃ ┣ 📜CartRoutes.ts
 ┃ ┣ 📜CategoryRoutes.ts
 ┃ ┣ 📜OrderRoutes.ts
 ┃ ┣ 📜PaymentRoutes.ts
 ┃ ┣ 📜PaymentsRoutes.ts
 ┃ ┣ 📜ProductImageRoutes.ts
 ┃ ┣ 📜ProductImageUplordRoutes.ts
 ┃ ┣ 📜ProductRoutes.ts
 ┃ ┣ 📜QnARoutes.ts
 ┃ ┣ 📜RecommendedProductsRoutes.ts
 ┃ ┣ 📜UserRoutes.ts
 ┃ ┗ 📜WishlistRoutes.ts
 ┣ 📂sql
 ┃ ┗ 📜schema.sql
 ┣ 📂uploads
 ┃ ┣ 📜1739854013300-1.png
 ┃ ┣ 📜1739854013304-1-1.jpg
 ┃ ┣ 📜1739854182026-2.png
 ┃ ┣ 📜1739854182028-2-2.jpg
 ┃ ┣ 📜1739854310706-5.png
 ┃ ┣ 📜1739854310707-5-5.jpg
 ┃ ┣ 📜1739854582041-10.png
 ┃ ┣ 📜1739854582042-10-10.jpg
 ┃ ┣ 📜1739854849694-4.png
 ┃ ┣ 📜1739854849698-4-4.jpg
 ┃ ┣ 📜1739855103217-3.png
 ┃ ┣ 📜1739855103219-3-3.jpg
 ┃ ┣ 📜1739855302430-6.png
 ┃ ┣ 📜1739855302432-6-6.jpg
 ┃ ┣ 📜1739855389450-7-7.jpg
 ┃ ┣ 📜1739855389450-7.png
 ┃ ┣ 📜1739855492010-8.png
 ┃ ┣ 📜1739855492012-8-8.jpg
 ┃ ┣ 📜1739855598245-9.png
 ┃ ┣ 📜1739855598246-9-9.png
 ┃ ┣ 📜resized_300x250_1739854013300-1.png
 ┃ ┣ 📜resized_300x250_1739854182026-2.png
 ┃ ┣ 📜resized_300x250_1739854310706-5.png
 ┃ ┣ 📜resized_300x250_1739854582041-10.png
 ┃ ┣ 📜resized_300x250_1739854849694-4.png
 ┃ ┣ 📜resized_300x250_1739855103217-3.png
 ┃ ┣ 📜resized_300x250_1739855302430-6.png
 ┃ ┣ 📜resized_300x250_1739855389450-7.png
 ┃ ┣ 📜resized_300x250_1739855492010-8.png
 ┃ ┣ 📜resized_300x250_1739855598245-9.png
 ┃ ┣ 📜resized_500x500_1739854013300-1.png
 ┃ ┣ 📜resized_500x500_1739854182026-2.png
 ┃ ┣ 📜resized_500x500_1739854310706-5.png
 ┃ ┣ 📜resized_500x500_1739854582041-10.png
 ┃ ┣ 📜resized_500x500_1739854849694-4.png
 ┃ ┣ 📜resized_500x500_1739855103217-3.png
 ┃ ┣ 📜resized_500x500_1739855302430-6.png
 ┃ ┣ 📜resized_500x500_1739855389450-7.png
 ┃ ┣ 📜resized_500x500_1739855492010-8.png
 ┃ ┣ 📜resized_500x500_1739855598245-9.png
 ┃ ┗ 📜resized_500x500_1739870315229-bb42568f01f2277c6b14c30c94614029.jpg
 ┣ 📜.env
 ┣ 📜app.ts
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜server.ts
 ┗ 📜tsconfig.json
```

## 👨‍💻 Role & Contribution

##### Frontend (Web)

* 관리자 페이지 (Vue.js) 개발
* 전체 아키텍처 구성

##### Devops

* ~~CI/CD 구축 (Docker, Github Action)~~
* ~~서버 모니터링~~

##### etc

전체 개발 일정 및 이슈 관리

## 🧑‍🧑‍🧒‍🧒Developers

* 민은빈 ([gitID or 블로그ID]여기에 개인 git/ 블로그 url 넣으시면 될거같아요!!)
* 김수현 ([gitID or 블로그ID]여기에 개인 git/ 블로그 url 넣으시면 될거같아요!!)
* 박영빈 ([gitID or 블로그ID]여기에 개인 git/ 블로그 url 넣으시면 될거같아요!!)
* 윤지은 ([gitID or 블로그ID]여기에 개인 git/ 블로그 url 넣으시면 될거같아요!!)
* 하태웅 ([gitID or 블로그ID]여기에 개인 git/ 블로그 url 넣으시면 될거같아요!!)
