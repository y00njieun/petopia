import { AddressRepo } from '../repo/AddressRepo';
import { Address } from '../domains/Address';

export class AddressService {
  static async getAddresses(userId: string): Promise<Address[]> {
    return await AddressRepo.getAddresses(userId);
  }

  static async addAddress(userId: string, addressData: Omit<Address, 'address_id' | 'user_id'>): Promise<Address> {
    if (addressData.is_default) {
      await AddressRepo.unsetAllDefaultAddresses(userId);
    }
    return await AddressRepo.addAddress(userId, addressData);
  }

  static async deleteAddress(userId: string, addressId: number): Promise<void> {
    await AddressRepo.deleteAddress(userId, addressId);
  }

  static async setDefaultAddress(userId: string, addressId: number): Promise<void> {
    await AddressRepo.unsetAllDefaultAddresses(userId);
    await AddressRepo.setDefaultAddress(userId, addressId);
  }
} 