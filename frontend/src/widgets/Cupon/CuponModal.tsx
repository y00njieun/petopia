import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./CuponModal.css";

interface Coupon {
  name: string;
  description: string;
  expiry?: string;
  condition?: string;
  status?: string;
}

const availableCoupons: Coupon[] = [
  {
    name: "신규 가입 할인 쿠폰",
    description: "10,000원 할인",
    expiry: "2024.03.31까지",
    condition: "50,000원 이상 구매 시 사용 가능",
  },
  {
    name: "첫 구매 특별 할인",
    description: "15% 할인",
    expiry: "2024.04.30까지",
    condition: "30,000원 이상 구매 시 사용 가능",
  },
];

const usedCoupons: Coupon[] = [
  {
    name: "생일 축하 쿠폰",
    description: "20,000원 할인",
    status: "사용 완료",
  },
];

const CouponModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUsedOpen, setIsUsedOpen] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("사용 가능한 쿠폰 선택");

  const handleSelectCoupon = (couponName: string) => {
    setSelectedCoupon(couponName);
    setIsOpen(false); // 쿠폰 선택 후 드롭다운 닫기
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {selectedCoupon}
        {isOpen ? <ChevronUp className="dropdown-icon" /> : <ChevronDown className="dropdown-icon" />}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <h3 className="dropdown-header">사용 가능한 쿠폰</h3>
            {availableCoupons.map((coupon, index) => (
              <div key={index} className="coupon-box" onClick={() => handleSelectCoupon(coupon.name)}>
                <div className="coupon-name">{coupon.name}</div>
                <div className="coupon-description">{coupon.description}</div>
                <div className="coupon-expiry">유효기간: {coupon.expiry}</div>
                <div className="coupon-condition">{coupon.condition}</div>
              </div>
            ))}

            <hr className="divider" />

            {/* 사용 완료된 쿠폰 목록 */}
            <div className="used-coupons-container">
              <div className="used-coupons-header" onClick={() => setIsUsedOpen(!isUsedOpen)}>
                <span className="used-coupons-title">사용 완료/만료된 쿠폰</span>
                {isUsedOpen ? <ChevronUp /> : <ChevronDown />}
              </div>

              {isUsedOpen && (
                <div className="dropdown-content">
                  {usedCoupons.map((coupon, index) => (
                    <div key={index} className="coupon-box disabled">
                      <div className="coupon-name">{coupon.name}</div>
                      <div className="coupon-description">{coupon.description}</div>
                      <div className="coupon-status">{coupon.status}</div>
                      <button className="used-coupon-button">사용 완료</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponModal;
