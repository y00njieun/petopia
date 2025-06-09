import React, { useEffect, useState } from "react";
import { fetchQnAList } from "../../shared/axios/QnAAxios";
import "./CSS/QnaList.css";

interface QnaItem {
  question_id: number;
  user_id: string;
  question_detail: string;
  question_date: string;
  question_private: string;
}

const QnaList: React.FC<{ productId: string }> = ({ productId }) => {
  const [qnaList, setQnaList] = useState<QnaItem[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setCurrentUser(storedUserId ? storedUserId : null);
  }, []);

  useEffect(() => {
    if (!productId || !currentUser) return;

    const getQnA = async () => {
      try {
        const data = await fetchQnAList(productId, currentUser);
        console.log("QnA 데이터:", data);
        setQnaList(data);
      } catch (error) {
        console.error("QnA 목록 불러오기 실패:", error);
      }
    };

    getQnA();
  }, [productId, currentUser]);

  return (
    <div className="qna-container">
      {qnaList.length === 0 ? (
        <p className="empty-message">등록된 질문이 없습니다.</p>
      ) : (
        qnaList.map((qna) => (
          <div key={qna.question_id} className="qna-item">
            <div className="question">
              <span className="qna-tag">질문</span>
              {qna.question_private === "Y" && qna.user_id !== currentUser ? (
                <p className="private-tag">비공개 질문입니다.</p>
              ) : (
                <>
                  <h3>{qna.question_detail}</h3>
                  <p className="qna-user">
                    작성자: {qna.user_id} | {qna.question_date}
                  </p>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QnaList;
