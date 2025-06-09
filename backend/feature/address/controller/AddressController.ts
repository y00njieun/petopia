import { Request, Response } from 'express';
import { AddressService } from '../services/AddressService';
import { AuthenticatedRequest } from '../../auth/types/user';
import pool from '../../../config/dbConfig';
import { RowDataPacket } from 'mysql2';

export class AddressController {
  static async getAddresses(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('=== getAddresses 시작 ===');
      console.log('요청 헤더:', req.headers);
      console.log('사용자 정보:', req.user);
      console.log('토큰:', req.headers.authorization);

      if (!req.user?.user_id) {
        console.log('인증 실패: user_id 없음');
        return res.status(401).json({ 
          success: false,
          message: '인증된 사용자가 아닙니다.' 
        });
      }

      // 데이터베이스 연결 확인
      console.log('데이터베이스 연결 시도...');
      const connection = await pool.promise().getConnection();
      console.log('데이터베이스 연결 성공');

      try {
        // 사용자 존재 여부 확인
        console.log('사용자 존재 여부 확인 중...');
        const [users] = await connection.query<RowDataPacket[]>(
          'SELECT user_id FROM Users WHERE user_id = ?',
          [req.user.user_id]
        );
        console.log('사용자 확인 결과:', users);

        if (users.length === 0) {
          console.error('사용자를 찾을 수 없습니다:', req.user.user_id);
          return res.status(404).json({
            success: false,
            message: '사용자를 찾을 수 없습니다.'
          });
        }

        // 배송지 조회
        console.log('배송지 조회 시도...');
        const [addresses] = await connection.query<RowDataPacket[]>(
          `SELECT * FROM UserAddresses WHERE user_id = ?`,
          [req.user.user_id]
        );
        console.log('조회된 배송지:', addresses);

        res.json({
          success: true,
          addresses: addresses || []
        });

      } catch (error) {
        console.error('SQL 쿼리 실행 중 오류:', error);
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('=== 배송지 조회 실패 ===');
      console.error('에러 타입:', typeof error);
      console.error('에러 객체:', error);
      throw error; // asyncHandler에서 처리하도록 전달
    }
  }

  static async addAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ message: '인증된 사용자가 아닙니다.' });
      }

      const {
        address_name,
        recipient_name,
        recipient_phone,
        address,
        detailed_address,
        postal_code,
        is_default
      } = req.body;

      if (!address_name || !recipient_name || !recipient_phone || !address || !postal_code) {
        return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
      }

      const connection = await pool.promise().getConnection();
      
      try {
        await connection.beginTransaction();

        if (is_default) {
          await connection.query(
            'UPDATE UserAddresses SET is_default = false WHERE user_id = ?',
            [userId]
          );
        }

        const [result] = await connection.query(
          `INSERT INTO UserAddresses 
           (user_id, address_name, recipient_name, recipient_phone, address, detailed_address, postal_code, is_default)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, address_name, recipient_name, recipient_phone, address, detailed_address, postal_code, is_default]
        );

        await connection.commit();
        res.status(201).json({
          success: true,
          message: '배송지가 추가되었습니다.'
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('배송지 추가 실패:', error);
      res.status(500).json({
        success: false,
        message: '배송지 추가에 실패했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  static async deleteAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
      }

      const addressId = parseInt(req.params.id);
      await AddressService.deleteAddress(userId, addressId);
      res.json({ message: '배송지가 삭제되었습니다.' });
    } catch (error) {
      console.error('배송지 삭제 실패:', error);
      res.status(500).json({ message: '배송지 삭제에 실패했습니다.' });
    }
  }

  static async setDefaultAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
      }

      const addressId = parseInt(req.params.id);
      await AddressService.setDefaultAddress(userId, addressId);
      res.json({ message: '기본 배송지로 설정되었습니다.' });
    } catch (error) {
      console.error('기본 배송지 설정 실패:', error);
      res.status(500).json({ message: '기본 배송지 설정에 실패했습니다.' });
    }
  }

  static async updateAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.user_id;
      const addressId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: '인증된 사용자가 아닙니다.' });
      }

      const {
        address_name,
        recipient_name,
        recipient_phone,
        address,
        detailed_address,
        postal_code,
        is_default
      } = req.body;

      const connection = await pool.promise().getConnection();
      
      try {
        await connection.beginTransaction();

        // 기본 배송지로 설정하는 경우, 다른 주소들의 기본 배송지 설정을 해제
        if (is_default) {
          await connection.query(
            'UPDATE UserAddresses SET is_default = false WHERE user_id = ? AND address_id != ?',
            [userId, addressId]
          );
        }

        // 주소 정보 업데이트
        const [result] = await connection.query(
          `UPDATE UserAddresses 
           SET address_name = ?, recipient_name = ?, recipient_phone = ?,
               address = ?, detailed_address = ?, postal_code = ?, is_default = ?
           WHERE address_id = ? AND user_id = ?`,
          [address_name, recipient_name, recipient_phone, address, 
           detailed_address, postal_code, is_default, addressId, userId]
        );

        await connection.commit();
        res.json({
          success: true,
          message: '배송지가 수정되었습니다.'
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('배송지 수정 실패:', error);
      res.status(500).json({
        success: false,
        message: '배송지 수정에 실패했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }
} 