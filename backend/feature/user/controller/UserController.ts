//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.

import { Request, Response, RequestHandler } from 'express';
import pool from '../../../config/dbConfig';
import { RowDataPacket } from 'mysql2';
import { AuthenticatedRequest } from '../../auth/types/user';
import bcrypt from 'bcrypt';

interface Address extends RowDataPacket {
  address_id: number;
  user_id: string;
  recipient_name: string;
  address: string;
  address_detail: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
}

export class UserController {
  static getProfile: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      console.log('=== getProfile 시작 ===');
      console.log('사용자 정보:', authReq.user);

      if (!authReq.user?.user_id) {
        res.status(401).json({
          success: false,
          message: '인증된 사용자가 아닙니다.'
        });
        return;
      }

      const connection = await pool.promise().getConnection();

      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          `SELECT user_id, name, email, phone, signup_type 
           FROM Users 
           WHERE user_id = ?`,
          [authReq.user.user_id]
        );

        if (rows.length === 0) {
          res.status(404).json({
            success: false,
            message: '사용자를 찾을 수 없습니다.'
          });
          return;
        }

        const userProfile = rows[0];
        res.json({
          success: true,
          user: {
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone,
            signup_type: userProfile.signup_type
          }
        });

      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('프로필 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '프로필 조회에 실패했습니다.'
      });
    }
  };

  static getAddresses: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      console.log('=== getAddresses 시작 ===');
      console.log('사용자 정보:', authReq.user);

      if (!authReq.user?.user_id) {
        res.status(401).json({
          success: false,
          message: '인증된 사용자가 아닙니다.'
        });
        return;
      }

      const connection = await pool.promise().getConnection();

      try {
        // 테이블 존재 여부 확인
        const [tables] = await connection.query<RowDataPacket[]>(
          'SHOW TABLES LIKE "UserAddresses"'
        );
        console.log('테이블 확인:', tables);

        if (tables.length === 0) {
          // 테이블이 없으면 생성
          await connection.query(`
            CREATE TABLE IF NOT EXISTS UserAddresses (
              address_id INT AUTO_INCREMENT PRIMARY KEY,
              user_id VARCHAR(255) NOT NULL,
              recipient_name VARCHAR(50) NOT NULL,
              address VARCHAR(255) NOT NULL,
              address_detail VARCHAR(255),
              postal_code VARCHAR(10) NOT NULL,
              phone VARCHAR(20) NOT NULL,
              is_default BOOLEAN DEFAULT false,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
          `);
          console.log('UserAddresses 테이블 생성됨');
        }

        const [addresses] = await connection.query<Address[]>(
          `SELECT * FROM UserAddresses 
           WHERE user_id = ? 
           ORDER BY is_default DESC, created_at DESC`,
          [authReq.user.user_id]
        );

        console.log('조회된 배송지:', addresses);

        res.json({
          success: true,
          addresses: addresses
        });

      } catch (error) {
        console.error('SQL 쿼리 실행 중 오류:', error);
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('배송지 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '배송지 목록 조회에 실패했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  };

  static addAddress: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
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

      if (!authReq.user?.user_id) {
        res.status(401).json({
          success: false,
          message: '인증된 사용자가 아닙니다.'
        });
        return;
      }

      try {
        if (is_default) {
          await connection.query(
            'UPDATE UserAddresses SET is_default = false WHERE user_id = ?',
            [authReq.user.user_id]
          );
        }

        const [result] = await connection.query(`
          INSERT INTO UserAddresses 
          (user_id, address_name, recipient_name, recipient_phone, address, detailed_address, postal_code, is_default)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          authReq.user.user_id,
          address_name,
          recipient_name,
          recipient_phone,
          address,
          detailed_address,
          postal_code,
          is_default
        ]);

        res.json({
          success: true,
          message: '배송지가 추가되었습니다.'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('SQL 쿼리 실행 중 오류:', error);
      res.status(500).json({
        success: false,
        message: '배송지 추가 중 오류가 발생했습니다.'
      });
    }
  };

  static async updateAddress(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.user_id) {
        return res.status(401).json({
          success: false,
          message: '인증된 사용자가 아닙니다.'
        });
      }

      const addressId = req.params.addressId;
      const { recipient_name, address, address_detail, postal_code, phone, is_default } = req.body;

      const connection = await pool.promise().getConnection();

      try {
        if (is_default) {
          await connection.query(
            'UPDATE UserAddresses SET is_default = false WHERE user_id = ?',
            [req.user.user_id]
          );
        }

        await connection.query(
          `UPDATE UserAddresses 
           SET recipient_name = ?, address = ?, address_detail = ?, 
               postal_code = ?, phone = ?, is_default = ?
           WHERE address_id = ? AND user_id = ?`,
          [recipient_name, address, address_detail, postal_code, phone, is_default, addressId, req.user.user_id]
        );

        res.status(200).json({
          success: true,
          message: '배송지가 수정되었습니다.'
        });

      } catch (error) {
        console.error('배송지 수정 실패:', error);
        res.status(500).json({
          success: false,
          message: '배송지 수정에 실패했습니다.'
        });
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('배송지 수정 실패:', error);
      res.status(500).json({
        success: false,
        message: '배송지 수정에 실패했습니다.'
      });
    }
  }

  static deleteAddress: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const addressId = req.params.id;  // URL 파라미터에서 id 가져오기

      if (!authReq.user?.user_id) {
        res.status(401).json({
          success: false,
          message: '인증된 사용자가 아닙니다.'
        });
        return;
      }

      const connection = await pool.promise().getConnection();

      try {
        // 삭제 전에 해당 배송지가 사용자의 것인지 확인
        const [address] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM UserAddresses WHERE address_id = ? AND user_id = ?',
          [addressId, authReq.user.user_id]
        );

        if (!address || (address as any[]).length === 0) {
          res.status(404).json({
            success: false,
            message: '배송지를 찾을 수 없거나 삭제 권한이 없습니다.'
          });
          return;
        }

        // 배송지 삭제
        await connection.query(
          'DELETE FROM UserAddresses WHERE address_id = ? AND user_id = ?',
          [addressId, authReq.user.user_id]
        );

        res.json({
          success: true,
          message: '배송지가 삭제되었습니다.'
        });

      } catch (error) {
        console.error('SQL 쿼리 실행 중 오류:', error);
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('배송지 삭제 실패:', error);
      res.status(500).json({
        success: false,
        message: '배송지 삭제에 실패했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  };

  static setDefaultAddress: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const addressId = req.params.id;

      if (!authReq.user?.user_id) {
        res.status(401).json({
          success: false,
          message: '인증된 사용자가 아닙니다.'
        });
        return;
      }

      const connection = await pool.promise().getConnection();

      try {
        // 먼저 모든 배송지의 기본 설정을 해제
        await connection.query(
          'UPDATE UserAddresses SET is_default = false WHERE user_id = ?',
          [authReq.user.user_id]
        );

        // 선택한 배송지를 기본 배송지로 설정
        const [result] = await connection.query(
          'UPDATE UserAddresses SET is_default = true WHERE address_id = ? AND user_id = ?',
          [addressId, authReq.user.user_id]
        );

        res.json({
          success: true,
          message: '기본 배송지가 변경되었습니다.'
        });

      } catch (error) {
        console.error('SQL 쿼리 실행 중 오류:', error);
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('기본 배송지 설정 실패:', error);
      res.status(500).json({
        success: false,
        message: '기본 배송지 설정에 실패했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  };

  static updateProfile: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { name, phone } = req.body;

      if (!authReq.user?.user_id) {
        res.status(401).json({
          success: false,
          message: '인증된 사용자가 아닙니다.'
        });
        return;
      }

      const connection = await pool.promise().getConnection();

      try {
        await connection.query(
          `UPDATE Users 
           SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE user_id = ?`,
          [name, phone, authReq.user.user_id]
        );

        res.json({
          success: true,
          message: '프로필이 성공적으로 수정되었습니다.'
        });

      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('프로필 수정 실패:', error);
      res.status(500).json({
        success: false,
        message: '프로필 수정에 실패했습니다.'
      });
    }
  };

  static updatePassword: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { currentPassword, newPassword } = req.body;

      if (!authReq.user?.user_id) {
        res.status(401).json({
          success: false,
          message: '인증된 사용자가 아닙니다.'
        });
        return;
      }

      const connection = await pool.promise().getConnection();

      try {
        // 현재 비밀번호 확인
        const [users] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM UserAuth WHERE user_id = ? AND auth_type = "local"',
          [authReq.user.user_id]
        );

        const userAuth = users[0];
        if (!userAuth) {
          res.status(404).json({
            success: false,
            message: '사용자 인증 정보를 찾을 수 없습니다.'
          });
          return;
        }

        // 현재 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(currentPassword, userAuth.password);
        if (!isPasswordValid) {
          res.status(400).json({
            success: false,
            message: '현재 비밀번호가 일치하지 않습니다.'
          });
          return;
        }

        // 새 비밀번호 해시화
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // 비밀번호 업데이트
        await connection.query(
          `UPDATE UserAuth 
           SET password = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE user_id = ? AND auth_type = "local"`,
          [hashedNewPassword, authReq.user.user_id]
        );

        res.json({
          success: true,
          message: '비밀번호가 성공적으로 변경되었습니다.'
        });

      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      res.status(500).json({
        success: false,
        message: '비밀번호 변경에 실패했습니다.'
      });
    }
  };
}