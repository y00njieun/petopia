import axiosInstance from '../../../shared/axios/axios';
import { Address } from '../model/Address';

export const getAddresses = async (): Promise<Address[]> => {
  const response = await axiosInstance.get('/api/addresses');
  return response.data;
};

export const addAddress = async (addressData: any): Promise<Address> => {
  const response = await axiosInstance.post('/api/addresses', addressData);
  return response.data;
};

export const updateAddress = async (addressId: number, addressData: any): Promise<Address> => {
  const response = await axiosInstance.put(`/api/addresses/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId: number): Promise<void> => {
  const response = await axiosInstance.delete(`/api/addresses/${addressId}`);
  return response.data;
};

export const setDefaultAddress = async (addressId: number): Promise<void> => {
  const response = await axiosInstance.put(`/api/addresses/${addressId}/default`);
  return response.data;
}; 