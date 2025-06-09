// import React from 'react';
import "../../shared/style/PayCompleteModal.css";
import completeIcon from "../../assets/complete.png";

const PayCompleteModal = () => {
  return (
    <div className="PayC-modal-container">
      <div className="PayC-modal-icon">
        <img
          src={completeIcon}
          alt="완료 아이콘"
          width={50}
          height={50}
        />
      </div>
      <h2 className="PayC-modal-title">결제가 완료되었습니다</h2>
      <p className="PayC-modal-description">주문번호: ORDER-2024-0001</p>

      <div className="PayC-modal-section">
        <hr className="PayC-divider" />
        <div className="PayC-modal-section-row">
          <div className="PayC-section-left">
            <span className="PayC-section-label">결제 금액</span>
            <div className="PayC-section-value">92,000원</div>
          </div>
          <div className="PayC-section-right">
            <span className="PayC-section-label">결제 수단</span>
            <div className="PayC-section-value">포인트/캐시</div>
          </div>
        </div>
        <hr className="PayC-divider" />
      </div>

      <h3 className="PayC-section-title PayC-left-align">배송 정보</h3>
      <div className="PayC-modal-box">
        <p className="PayC-section-info">홍길동</p>
        <p className="PayC-section-info">서울특별시 강남구 테헤란로 123</p>
        <p className="PayC-section-info">010-1234-5678</p>
      </div>

      <div className="PayC-modal-actions PayC-vertical">
        <button className="PayC-modal-button PayC-primary">주문 상세 보기</button>
        <button className="PayC-modal-button PayC-secondary">쇼핑 계속하기</button>
      </div>
    </div>
  );
};

export default PayCompleteModal;

// import React from "react";
// import "../../shared/style/PayCompleteModal.css";
// import completeIcon from "../../assets/complete.png";

// interface PayCompleteModalProps {
//   orderId: string;
//   paymentAmount: string;
//   paymentMethod: string;
//   recipientName: string;
//   recipientAddress: string;
//   recipientPhone: string;
//   onClose: () => void;
// }

// const PayCompleteModal: React.FC<PayCompleteModalProps> = ({
//   orderId,
//   paymentAmount,
//   paymentMethod,
//   recipientName,
//   recipientAddress,
//   recipientPhone,
//   onClose,
// }) => {
//   return (
//     <div className="PayC-modal-container">
//       <div className="PayC-modal-icon">
//         <img src={completeIcon} alt="완료 아이콘" width={50} height={50} />
//       </div>
//       <h2 className="PayC-modal-title">결제가 완료되었습니다</h2>
//       <p className="PayC-modal-description">주문번호: {orderId}</p>

//       <div className="PayC-modal-section">
//         <hr className="PayC-divider" />
//         <div className="PayC-modal-section-row">
//           <div className="PayC-section-left">
//             <span className="PayC-section-label">결제 금액</span>
//             <div className="PayC-section-value">{paymentAmount}원</div>
//           </div>
//           <div className="PayC-section-right">
//             <span className="PayC-section-label">결제 수단</span>
//             <div className="PayC-section-value">{paymentMethod}</div>
//           </div>
//         </div>
//         <hr className="PayC-divider" />
//       </div>

//       <h3 className="PayC-section-title PayC-left-align">배송 정보</h3>
//       <div className="PayC-modal-box">
//         <p className="PayC-section-info">{recipientName}</p>
//         <p className="PayC-section-info">{recipientAddress}</p>
//         <p className="PayC-section-info">{recipientPhone}</p>
//       </div>

//       <div className="PayC-modal-actions PayC-vertical">
//         <button className="PayC-modal-button PayC-primary" onClick={onClose}>
//           주문 상세 보기
//         </button>
//         <button className="PayC-modal-button PayC-secondary" onClick={onClose}>
//           쇼핑 계속하기
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PayCompleteModal;
