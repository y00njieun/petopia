import axiosInstance from "../../../shared/axios/axios";
export const requestPayment = async (paymentData: PaymentRequest) => {
  const response = await axiosInstance.post('/api/payments/request', paymentData);
  return response.data;
};
