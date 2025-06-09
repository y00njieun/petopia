import React from "react";
import "../../shared/style/FailModal.css";

interface FailModalProps {
  title?: string; // 모달 제목 (선택적)
  message: string; // 모달에 표시될 메시지
  icon?: string; // 아이콘 이미지 경로 (선택적)
  onClose: () => void; // 모달 닫기 핸들러
}

const FailModal: React.FC<FailModalProps> = ({
  title = "실패", // 기본 제목
  message,
  icon = "src/assets/Fail.png", // 기본 아이콘
  onClose,
}) => {
  return (
    <div className="l_modal_overlay">
      <div className="l_modal">
        <div className="l_modal_header">
          <img src={icon} alt="모달 아이콘" className="l_modal_icon" />
        </div>
        <div className="l_modal_body">
          <h3 className="l_modal_title">{title}</h3>
          <p className="l_modal_message">{message}</p>
        </div>
        <div className="l_modal_footer">
          <button onClick={onClose} className="l_modal_button">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailModal;


