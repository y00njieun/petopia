import React, { useState } from "react";
import "../qna/CSS/QnaModal.css";
import axiosInstance from "../../shared/axios/axios";
import { useNavigate } from "react-router-dom";

interface QnaModalProps {
  onClose: () => void;
  productId: number;
}

const QnaModal: React.FC<QnaModalProps> = ({ onClose, productId }) => {
  const navigate = useNavigate();
  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId] = useState<string | null>(localStorage.getItem("userId"));

  const handleSubmit = async () => {
    if (!userId) {
      alert("문의 작성은 회원만 가능합니다. 로그인 후 이용해주세요.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 문의 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    const now = new Date();
    const localDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const formattedDate = localDate.toISOString().slice(0, 16).replace("T", " ");

    try {
      const response = await axiosInstance.post("api/qna/questions/:productId", {
        user_id: userId,
        product_id: productId,
        question_detail: `${inquiryType ? `[${inquiryType}] ` : ""}${title} - ${content}`,
        question_date: formattedDate,
        question_private: isPrivate ? "Y" : "N",
      });

      console.log("QnA 요청 응답:", response.data);

      if (response.status === 201) {
        alert("문의가 성공적으로 등록되었습니다.");
        resetForm();
        onClose();
      } else {
        alert("문의 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("문의 등록 오류:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 입력값 초기화
  const resetForm = () => {
    setInquiryType("");
    setTitle("");
    setContent("");
    setIsPrivate(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="title-name">
          <h2>상품 문의하기</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>
            ✖
          </button>
        </div>

        {!userId ? (
          <div className="guest-message">
            <p>문의 작성은 회원만 가능합니다.</p>
            <button className="login-button" onClick={() => navigate("/login")}>
              로그인 / 회원가입
            </button>
          </div>
        ) : (
          <>
            <label>문의 유형</label>
            <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)}>
              <option value="">문의 유형을 선택해주세요</option>
              <option value="상품 문의">상품 문의</option>
              <option value="배송 문의">배송 문의</option>
            </select>

            <label>제목</label>
            <input
              className="qna-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              disabled={loading}
            />

            <label>문의 내용</label>
            <textarea
              className="qna-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의하실 내용을 입력해주세요"
              disabled={loading}
            />

            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
                disabled={loading}
              />
              <label className="checkbox-title">관리자에게만 보여주기</label>
            </div>

            <div className="modal-buttons">
              <button className="cancel-button" onClick={onClose} disabled={loading}>
                취소
              </button>
              <button className="submit-button" onClick={handleSubmit} disabled={loading}>
                {loading ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QnaModal;
