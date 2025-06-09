export interface User {
  user_id: string;
  kakao_id?: number;
  name: string;
  email: string;
  phone?: string;
  signup_type: 'local' | 'kakao' | 'naver' | 'google';
  is_active: boolean;
  membership_level: string;
  profile_image?: string;
  isAdmin: boolean;
  point: number;
}

declare global {
  namespace Express {
    interface User {
      user_id: string;
    }
  }
} 