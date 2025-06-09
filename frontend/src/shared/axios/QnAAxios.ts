import axiosInstance from "./axios";

// QnA 질문 등록 API 호출 함수
export const postQuestion = async (data: {
  user_id: string;
  product_id: string;
  question_detail: string;
  question_date: string;
  question_private: string;
}) => {
  try {
    const response = await axiosInstance.post("/questions", data);
    return response.data;
  } catch (error) {
    console.error("QnA 등록 오류:", error);
    throw error;
  }
};

// 특정 상품의 QnA 리스트 가져오기
export const fetchQnAList = async (productId: string, userId: string | null) => {
  try {
    console.log("QnA 요청: productId:", productId, "userId:", userId);

    const response = await axiosInstance.get(`/api/qna/questions/${productId}`, {
      params: { userId: userId ?? "" },
    });

    return response.data.questions;
  } catch (error) {
    console.error("QnA 목록 불러오기 실패:", error);
    return [];
  }
};