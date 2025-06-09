DROP DATABASE IF EXISTS v5;
CREATE DATABASE v5;
USE v5;

-- Users 테이블 생성
CREATE TABLE Users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    signup_type ENUM('local', 'kakao', 'naver', 'google') NOT NULL DEFAULT 'local',
    is_active BOOLEAN NOT NULL DEFAULT true,
    membership_level VARCHAR(20) NOT NULL DEFAULT 'BASIC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    recent_at TIMESTAMP,
    profile_image VARCHAR(255),
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    point INT NOT NULL DEFAULT 0,
    INDEX idx_email (email)
);

-- UserAuth 테이블 생성
CREATE TABLE UserAuth (
    auth_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    auth_type ENUM('local', 'kakao', 'naver', 'google') NOT NULL,
    password VARCHAR(255),
    refresh_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_auth (user_id, auth_type)
);

-- 배송지 테이블
CREATE TABLE UserAddresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    address_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    detailed_address VARCHAR(255),
    postal_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_default (user_id, is_default)
) COMMENT '사용자 배송지 정보';

-- ProductCategories 테이블
CREATE TABLE ProductCategories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products 테이블
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    origin_price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2) DEFAULT 0.00,
    final_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_code VARCHAR(50) NOT NULL,
    sizes JSON,
    colors JSON,
    FOREIGN KEY (category_id) REFERENCES ProductCategories(category_id)
);

-- ProductImages 테이블
CREATE TABLE ProductImages (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Common 테이블에 결제 관련 상태 코드 추가
INSERT INTO Common (status_code, statuscode_name, status_type, description)
VALUES 
-- 결제 수단
('PM001', 'CARD', 'PAYMENT_METHOD', '카드'),
('PM002', 'VIRTUAL_ACCOUNT', 'PAYMENT_METHOD', '가상계좌'),
('PM003', 'MOBILE_PHONE', 'PAYMENT_METHOD', '휴대폰'),
('PM004', 'TRANSFER', 'PAYMENT_METHOD', '계좌이체'),
('PM005', 'CULTURE_GIFT_CERTIFICATE', 'PAYMENT_METHOD', '문화상품권'),
('PM006', 'BOOK_GIFT_CERTIFICATE', 'PAYMENT_METHOD', '도서문화상품권'),
-- 결제 상태
('PS001', 'READY', 'PAYMENT_STATUS', '결제 준비'),
('PS002', 'IN_PROGRESS', 'PAYMENT_STATUS', '결제 진행중'),
('PS003', 'WAITING_FOR_DEPOSIT', 'PAYMENT_STATUS', '입금 대기'),
('PS004', 'DONE', 'PAYMENT_STATUS', '결제 완료'),
('PS005', 'CANCELED', 'PAYMENT_STATUS', '결제 취소'),
('PS006', 'PARTIAL_CANCELED', 'PAYMENT_STATUS', '부분 취소'),
('PS007', 'ABORTED', 'PAYMENT_STATUS', '결제 중단'),
('PS008', 'EXPIRED', 'PAYMENT_STATUS', '결제 만료');

-- Payment 테이블 
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(64),
    payment_key VARCHAR(200) UNIQUE,
    payment_type VARCHAR(20),
    order_name VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50),
    final_price DECIMAL(10, 2) NOT NULL,
    balance_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_price DECIMAL(10, 2) DEFAULT 0.00,
    currency CHAR(3) DEFAULT 'KRW',
    payment_status VARCHAR(50),
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    canceled_at DATETIME,
    mid VARCHAR(14),
    last_transaction_key VARCHAR(64),
    receipt_url VARCHAR(300),
    checkout_url VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 카드 결제 관련 정보
    card_company VARCHAR(50),
    card_number VARCHAR(20),
    card_installment_plan INT DEFAULT 0,
    card_approval_number VARCHAR(50),
    card_type VARCHAR(20),
    card_owner_type VARCHAR(20),
    card_acquire_status VARCHAR(20),
    card_receipt_url VARCHAR(300),
    
    -- 가상계좌 관련 정보
    virtual_account_bank VARCHAR(50),
    virtual_account_number VARCHAR(50),
    virtual_account_holder VARCHAR(100),
    virtual_account_expires_at DATETIME,
    virtual_account_settled_at DATETIME,
    
    -- 취소 관련 정보
    cancel_amount DECIMAL(10, 2) DEFAULT 0.00,
    cancel_reason VARCHAR(200),
    cancel_receipt_url VARCHAR(300),
    
    -- 외래 키 및 인덱스
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method) REFERENCES Common(status_code),
    FOREIGN KEY (payment_status) REFERENCES Common(status_code),
    
    INDEX idx_payment_key (payment_key),
    INDEX idx_order_id (order_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_approved_at (approved_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테스트용 데이터 삽입
INSERT INTO Users 
(user_id, name, email, phone, signup_type, isAdmin) 
VALUES 
('admin', '관리자', 'admin@petopia.com', '010-0000-0000', 'local', true);

INSERT INTO UserAuth 
(user_id, auth_type, password) 
VALUES 
('admin', 'local', '$2b$10$8KzaNdKIMyOkASCCfTYrU.kXsyeqf0lrWA.O6DgEE/ZgqzUh5HKPy');

-- 테스트용 일반 회원 계정
INSERT INTO Users 
(user_id, name, email, phone, signup_type) 
VALUES 
('testuser', '테스트유저', 'test@petopia.com', '010-1234-5678', 'local');

INSERT INTO UserAuth 
(user_id, auth_type, password) 
VALUES 
('testuser', 'local', '$2b$10$8KzaNdKIMyOkASCCfTYrU.kXsyeqf0lrWA.O6DgEE/ZgqzUh5HKPy');

-- 테스트용 배송지 데이터
INSERT INTO UserAddresses 
(user_id, address_name, recipient_name, recipient_phone, address, detailed_address, postal_code, is_default) 
VALUES 
('testuser', '집', '테스트유저', '010-1234-5678', '서울시 강남구 테헤란로', '123-45', '06234', true);

-- 카테고리 데이터 삽입
INSERT INTO ProductCategories (category_name) VALUES
('강아지 사료'),
('강아지 간식'),
('강아지 장난감'),
('강아지 용품'),
('강아지 집'),
('강아지 옷'),
('강아지 위생 용품'),
('강아지 건강관리'),
('강아지 미용 용품'),
('강아지 이동장'),
('강아지 훈련 용품');