import pool from '../../../config/dbConfig';
import { Address } from '../domains/Address';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class AddressRepo {
  static async getAddresses(userId: string): Promise<Address[]> {
    try {
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT * FROM UserAddresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
        [userId]
      );
      return rows as Address[];
    } catch (error) {
      console.error('getAddresses 쿼리 실행 실패:', error);
      throw error;
    }
  }

  static async addAddress(userId: string, address: Omit<Address, 'address_id' | 'user_id'>): Promise<Address> {
    const connection = await pool.promise().getConnection();
    try {
      await connection.beginTransaction();

      console.log('addAddress 입력 데이터:', { userId, address });

      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO UserAddresses (
          user_id, address_name, recipient_name, recipient_phone, 
          address, detailed_address, postal_code, is_default
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          address.address_name,
          address.recipient_name,
          address.recipient_phone,
          address.address,
          address.detailed_address || null,
          address.postal_code,
          address.is_default
        ]
      );

      await connection.commit();

      const newAddress: Address = {
        address_id: result.insertId,
        user_id: userId,
        ...address
      };

      console.log('addAddress 생성된 주소:', newAddress);
      return newAddress;

    } catch (error) {
      await connection.rollback();
      console.error('addAddress 쿼리 실행 실패:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteAddress(userId: string, addressId: number): Promise<void> {
    try {
      await pool.promise().query(
        'DELETE FROM UserAddresses WHERE user_id = ? AND address_id = ?',
        [userId, addressId]
      );
    } catch (error) {
      console.error('deleteAddress 쿼리 실행 실패:', error);
      throw error;
    }
  }

  static async setDefaultAddress(userId: string, addressId: number): Promise<void> {
    const connection = await pool.promise().getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        'UPDATE UserAddresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );

      await connection.query(
        'UPDATE UserAddresses SET is_default = TRUE WHERE user_id = ? AND address_id = ?',
        [userId, addressId]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('setDefaultAddress 쿼리 실행 실패:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async unsetAllDefaultAddresses(userId: string): Promise<void> {
    try {
      await pool.promise().query(
        'UPDATE UserAddresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );
    } catch (error) {
      console.error('unsetAllDefaultAddresses 쿼리 실행 실패:', error);
      throw error;
    }
  }
} 