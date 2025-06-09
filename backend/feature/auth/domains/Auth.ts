//엔티티 
//Table 객체로 변환 
//보통 클래스로 관리

// class Orders{
//   id: number;
// }

import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Profile } from 'passport-kakao';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import pool from '../../../config/dbConfig';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface User {
  id?: number;
  socialId: string;
  email?: string;
  nickname: string;
  provider: string;
}

export interface TokenUser {
  id: number | string;
  email: string;
  nickname: string;
  signup_type: 'local' | 'kakao' | 'naver' | 'google';
}

interface KakaoUser {
  user_id: string;
  email: string;
  name: string;
  phone?: string;
  signup_type: 'kakao';
  profile_image?: string;
}

export interface SignupData {
  userId: string;
  password: string;
  name: string;
  email: string;
  phone: string;
}

export interface LoginData {
  userId: string;
  password: string;
}

export class Auth {
  static async saveOrGetUser(kakaoUserInfo: any): Promise<KakaoUser> {
    try {
      // 카카오 계정의 이메일로 사용자 조회
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT user_id, email, name FROM Users WHERE email = ?',
        [kakaoUserInfo.kakao_account.email]
      );

      if (rows.length > 0) {
        const user = rows[0];
        return {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          signup_type: 'kakao'
        };
      }

      // 새 사용자 생성
      const userId = `kakao_${Date.now()}`;
      const userInfo: KakaoUser = {
        user_id: userId,
        name: kakaoUserInfo.kakao_account.name,
        email: kakaoUserInfo.kakao_account.email,
        phone: kakaoUserInfo.kakao_account.phone_number,
        signup_type: 'kakao',
        profile_image: kakaoUserInfo.properties.profile_image
      };

      // Users 테이블에 사용자 정보 저장
      await pool.promise().query(
        `INSERT INTO Users 
        (user_id, name, email, phone, signup_type, profile_image) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userInfo.user_id, userInfo.name, userInfo.email, userInfo.phone, userInfo.signup_type, userInfo.profile_image]
      );

      // UserAuth 테이블에 카카오 인증 정보 저장
      await pool.promise().query(
        `INSERT INTO UserAuth 
        (user_id, auth_type) 
        VALUES (?, ?)`,
        [userInfo.user_id, 'kakao']
      );

      return userInfo;
    } catch (error) {
      console.error('사용자 저장/조회 실패:', error);
      throw error;
    }
  }

  static initializePassport() {
    passport.use(
      new KakaoStrategy(
        {
          clientID: process.env.KAKAO_CLIENT_ID || '',
          clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
          callbackURL: process.env.KAKAO_REDIRECT_URI || 'http://localhost:5173/oauth/callback/kakao'
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile._json?.kakao_account?.email;
            const nickname = profile.displayName;
            const user = await Auth.saveOrGetUser(profile);
            done(null, user);
          } catch (error) {
            done(error as Error);
          }
        }
      )
    );
  }

  static generateTokens(user: TokenUser) {
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        signup_type: user.signup_type
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static async handleKakaoCallback(code: string) {
    try {
      // 카카오 토큰 받기
      const tokenResponse = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_CLIENT_ID,
            client_secret: process.env.KAKAO_CLIENT_SECRET,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // 카카오 사용자 정보 받기
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`
        }
      });

      const kakaoUserInfo = userResponse.data;

      // 사용자 저장 또는 조회
      const user = await Auth.saveOrGetUser(kakaoUserInfo);

      // JWT 토큰 생성
      const tokens = Auth.generateTokens({
        id: user.user_id,
        email: user.email,
        nickname: user.name,
        signup_type: 'kakao'
      });

      return {
        token: tokens.accessToken,
        user: {
          id: user.user_id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      throw error;
    }
  }

  static async signup(data: SignupData): Promise<any> {
    try {
      const { userId, password, name, email, phone } = data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await pool.promise().getConnection();
      
      await connection.beginTransaction();

      try {
        // Users 테이블에 기본 정보 저장
        await connection.query(
          'INSERT INTO Users (user_id, name, email, phone, signup_type) VALUES (?, ?, ?, ?, ?)',
          [userId, name, email, phone, 'local']
        );

        // UserAuth 테이블에 인증 정보 저장
        await connection.query(
          'INSERT INTO UserAuth (user_id, auth_type, password) VALUES (?, ?, ?)',
          [userId, 'local', hashedPassword]
        );

        await connection.commit();
        connection.release();

        return {
          success: true,
          message: '회원가입이 완료되었습니다.',
          user: { userId, email, name }
        };
      } catch (error: any) {
        await connection.rollback();
        connection.release();

        // MySQL 에러 코드에 따른 구체적인 에러 메시지
        if (error.code === 'ER_DUP_ENTRY') {
          if (error.sqlMessage.includes('Users.email')) {
            throw new Error('이미 사용중인 이메일입니다.');
          }
          if (error.sqlMessage.includes('Users.user_id')) {
            throw new Error('이미 사용중인 아이디입니다.');
          }
          if (error.sqlMessage.includes('Users.phone')) {
            throw new Error('이미 등록된 전화번호입니다.');
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async checkUserId(userId: string): Promise<boolean> {
    try {
      const [rows] = await pool.promise().query(
        'SELECT COUNT(*) as count FROM Users WHERE user_id = ?',
        [userId]
      );
      
      const result = (rows as any[])[0];
      return result.count === 0; // 사용 가능하면 true, 이미 존재하면 false 반환
    } catch (error) {
      console.error('아이디 중복 확인 실패:', error);
      throw new Error('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async login(data: LoginData) {
    try {
      // 사용자 정보 조회
      const [users] = await pool.promise().query<RowDataPacket[]>(
        'SELECT u.*, ua.password FROM Users u JOIN UserAuth ua ON u.user_id = ua.user_id WHERE u.user_id = ? AND ua.auth_type = ?',
        [data.userId, 'local']
      );

      const user = users[0];
      if (!user) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }

      // 비밀번호 검증
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }

      // 마지막 로그인 시간 업데이트
      await pool.promise().query(
        'UPDATE Users SET recent_at = NOW() WHERE user_id = ?',
        [user.user_id]
      );

      // 토큰 생성
      const tokens = Auth.generateTokens({
        id: user.user_id,
        email: user.email,
        nickname: user.name,
        signup_type: user.signup_type
      });

      return {
        success: true,
        message: '로그인에 성공했습니다.',
        user: {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        },
        tokens
      };
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  }

  static async findUserByEmailAndPhone(email: string, phone: string) {
    try {
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT user_id FROM Users WHERE email = ? AND phone = ?',
        [email, phone]
      );
      
      if (!rows[0]) {
        throw new Error('일치하는 사용자를 찾을 수 없습니다.');
      }
      
      return {
        userId: rows[0].user_id
      };
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    }
  }

  static async findUserForReset(userId: string, email: string, phone: string) {
    try {
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT * FROM Users WHERE user_id = ? AND email = ? AND phone = ?',
        [userId, email, phone]
      );
      
      if (!rows[0]) {
        throw new Error('일치하는 사용자를 찾을 수 없습니다.');
      }
      
      return rows[0];
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    }
  }

  static async updatePassword(userId: string, newPassword: string) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.promise().query(
        'UPDATE UserAuth SET password = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );
    } catch (error) {
      console.error('비밀번호 업데이트 실패:', error);
      throw error;
    }
  }

  static async findUserId(params: { name: string; email: string }) {
    const { name, email } = params;
    
    console.log('[아이디 찾기 요청] 이름:', name, '이메일:', email);

    try {
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT user_id FROM Users WHERE name = ? AND email = ?',
        [name, email]
      );

      if (rows.length === 0) {
        throw new Error('일치하는 사용자를 찾을 수 없습니다.');
      }

      return {
        success: true,
        userId: rows[0].user_id
      };
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    }
  }

  // 이메일 중복 체크 메서드 추가
  static async checkEmail(email: string): Promise<boolean> {
    try {
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT user_id FROM Users WHERE email = ?',
        [email]
      );
      
      // 이메일이 존재하지 않으면 true (사용 가능)
      return rows.length === 0;
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      throw new Error('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  }
}

export default Auth;
