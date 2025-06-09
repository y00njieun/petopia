//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.

import { Request, Response } from 'express';
import { Auth } from '../domains/Auth';
import axios from 'axios';

export const signup = async (req: Request, res: Response) => {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] 회원가입 시도 - IP: ${req.ip}`);
  
  try {
    // 요청 데이터 로깅
    console.log('회원가입 요청:', req.body);

    const { userId, email, password, name, phone } = req.body;

    // 필수 필드 검증
    if (!userId || !email || !password || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: '모든 필드를 입력해주세요.'
      });
    }

    console.log(`[회원가입 요청] 사용자: ${userId}, 이메일: ${email}`);

    const result = await Auth.signup({
      userId,
      email,
      password,
      name,
      phone
    });

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`[${endTime.toISOString()}] 회원가입 성공 - 사용자: ${userId}, 소요시간: ${duration}ms`);

    res.status(201).json(result);
  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    // 에러 로그 상세 출력
    console.error(`[${endTime.toISOString()}] 회원가입 실패 - IP: ${req.ip}, 소요시간: ${duration}ms`);
    console.error('에러 메시지:', error instanceof Error ? error.message : error);
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message);
      if ('code' in error) {
        console.error('SQL 에러 코드:', (error as any).code);
        console.error('SQL 에러 상태:', (error as any).sqlState);
      }
    }

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '서버 오류가 발생했습니다.'
    });
  }
};

export const checkUserId = async (req: Request, res: Response) => {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] 아이디 중복 확인 시도 - IP: ${req.ip}`);

  try {
    const { userId } = req.params;
    console.log(`[중복확인 요청] 아이디: ${userId}`);

    const available = await Auth.checkUserId(userId);
    
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    if (available) {
      console.log(`[${endTime.toISOString()}] 아이디 사용 가능 - ${userId}, 소요시간: ${duration}ms`);
      res.json({ 
        success: true,
        available: true,
        message: '사용 가능한 아이디입니다.' 
      });
    } else {
      console.log(`[${endTime.toISOString()}] 아이디 중복 - ${userId}, 소요시간: ${duration}ms`);
      res.json({ 
        success: false,
        available: false,
        message: '이미 사용중인 아이디입니다.' 
      });
    }
  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.error(`[${endTime.toISOString()}] 중복확인 실패 - IP: ${req.ip}, 소요시간: ${duration}ms`);
    console.error('에러 상세:', error instanceof Error ? error.message : error);

    res.status(400).json({ 
      success: false,
      message: error instanceof Error ? error.message : '아이디 중복 체크에 실패했습니다.' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] 로그인 시도 - IP: ${req.ip}`);

  try {
    const { userId, password } = req.body;
    console.log(`[로그인 요청] 사용자: ${userId}`);

    const result = await Auth.login({ userId, password });

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`[${endTime.toISOString()}] 로그인 성공 - 사용자: ${userId}, 소요시간: ${duration}ms`);

    // 토큰을 응답 헤더에 포함
    res.status(200).json({
      success: true,
      message: '로그인에 성공했습니다.',
      user: result.user,
      token: result.tokens.accessToken // 클라이언트에서 저장할 토큰
    });
  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.error(`[${endTime.toISOString()}] 로그인 실패 - IP: ${req.ip}, 소요시간: ${duration}ms`);
    console.error('에러 상세:', error instanceof Error ? error.message : error);

    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : '로그인에 실패했습니다.'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] 로그아웃 시도 - IP: ${req.ip}`);

  try {
    res.status(200).json({
      success: true,
      message: '로그아웃 되었습니다.'
    });
  } catch (error) {
    console.error(`[${startTime.toISOString()}] 로그아웃 실패 - IP: ${req.ip}`);
    res.status(500).json({
      success: false,
      message: '로그아웃 처리 중 오류가 발생했습니다.'
    });
  }
};

export const kakaoCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    console.log('카카오 인증 코드 받음:', code);

    if (!code) {
      return res.status(400).json({ message: '인증 코드가 없습니다.' });
    }

    // 카카오 토큰 받기
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('카카오 토큰 응답:', tokenResponse.data);

    // 카카오 사용자 정보 받기
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    const kakaoUser = userResponse.data;
    console.log('카카오 사용자 정보:', kakaoUser);

    // 사용자 저장 또는 조회
    const user = await Auth.saveOrGetUser({
      kakao_account: {
        email: kakaoUser.kakao_account?.email,
        name: kakaoUser.properties?.nickname || '카카오 사용자',
        phone_number: kakaoUser.kakao_account?.phone_number
      },
      properties: {
        profile_image: kakaoUser.properties?.profile_image
      }
    });

    // JWT 토큰 생성
    const tokens = Auth.generateTokens({
      id: user.user_id,
      email: user.email,
      nickname: user.name,
      signup_type: 'kakao'
    });

    console.log('카카오 로그인 성공:', user.name);

    // 응답
    res.json({
      token: tokens.accessToken,
      user: {
        userId: user.user_id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('카카오 로그인 에러:', error);
    if (axios.isAxiosError(error)) {
      console.error('카카오 API 응답:', error.response?.data);
    }
    res.status(500).json({ 
      message: '카카오 로그인에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
};

export const findUserId = async (req: Request, res: Response) => {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] 아이디 찾기 시도 - IP: ${req.ip}`);
  
  try {
    const { email, phone } = req.body;
    console.log(`[아이디 찾기 요청] 이메일: ${email}, 전화번호: ${phone}`);
    
    const user = await Auth.findUserByEmailAndPhone(email, phone);
    
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`[${endTime.toISOString()}] 아이디 찾기 성공 - 아이디: ${user.userId}, 소요시간: ${duration}ms`);

    res.status(200).json({
      success: true,
      message: '아이디를 찾았습니다.',
      userId: user.userId
    });
  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.error(`[${endTime.toISOString()}] 아이디 찾기 실패 - IP: ${req.ip}, 소요시간: ${duration}ms`);
    console.error('에러 상세:', error instanceof Error ? error.message : error);

    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : '아이디 찾기에 실패했습니다.'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] 비밀번호 재설정 시도 - IP: ${req.ip}`);
  
  try {
    const { userId, email, phone } = req.body;
    console.log(`[비밀번호 재설정 요청] 아이디: ${userId}, 이메일: ${email}`);
    
    const user = await Auth.findUserForReset(userId, email, phone);
    
    // 임시 비밀번호 생성
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // 비밀번호 업데이트
    await Auth.updatePassword(userId, tempPassword);

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`[${endTime.toISOString()}] 비밀번호 재설정 성공 - 아이디: ${userId}, 소요시간: ${duration}ms`);

    // TODO: 이메일로 임시 비밀번호 전송
    // 실제 서비스에서는 이메일 전송 로직 구현 필요

    res.status(200).json({
      success: true,
      message: '임시 비밀번호가 이메일로 전송되었습니다.',
      tempPassword // 개발용으로만 포함, 실제 서비스에서는 제거
    });
  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.error(`[${endTime.toISOString()}] 비밀번호 재설정 실패 - IP: ${req.ip}, 소요시간: ${duration}ms`);
    console.error('에러 상세:', error instanceof Error ? error.message : error);

    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : '비밀번호 재설정에 실패했습니다.'
    });
  }
};

export const checkEmail = async (req: Request, res: Response) => {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] 이메일 중복 확인 시도 - IP: ${req.ip}`);

  try {
    const { email } = req.params;
    console.log(`[중복확인 요청] 이메일: ${email}`);

    const available = await Auth.checkEmail(email);
    
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    if (available) {
      console.log(`[${endTime.toISOString()}] 이메일 사용 가능 - ${email}, 소요시간: ${duration}ms`);
      res.json({ 
        success: true,
        available: true,
        message: '사용 가능한 이메일입니다.' 
      });
    } else {
      console.log(`[${endTime.toISOString()}] 이메일 중복 - ${email}, 소요시간: ${duration}ms`);
      res.json({ 
        success: false,
        available: false,
        message: '이미 사용중인 이메일입니다.' 
      });
    }
  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.error(`[${endTime.toISOString()}] 중복확인 실패 - IP: ${req.ip}, 소요시간: ${duration}ms`);
    console.error('에러 상세:', error instanceof Error ? error.message : error);

    res.status(400).json({ 
      success: false,
      message: error instanceof Error ? error.message : '이메일 중복 체크에 실패했습니다.' 
    });
  }
};