import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import axiosInstance from '../../shared/axios/axios';
import './ProfileSettings.css';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  signup_type: 'local' | 'kakao';
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    signup_type: 'local'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    signup_type: 'local'
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/users/profile');
        console.log('프로필 조회 응답:', response.data);
        
        if (response.data.success) {
          const userData = response.data.user;
          setProfile(userData);
          setEditedProfile(userData);
        } else {
          console.error('프로필 조회 실패:', response.data.message);
        }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('/api/users/profile', editedProfile);
      
      if (response.data.success) {
        setProfile(editedProfile);
        setIsEditing(false);
        alert('프로필이 성공적으로 수정되었습니다.');
      } else {
        console.error('프로필 수정 실패:', response.data.message);
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axiosInstance.put('/api/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.data.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('비밀번호가 성공적으로 변경되었습니다.');
      } else {
        setPasswordError(response.data.message);
      }
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div className="profile-settings">
      <Header />
      <div className="settings-container">
        <div className="settings-header">
          <h1>프로필 설정</h1>
          <button onClick={() => navigate('/mypage')} className="back-button">
            뒤로가기
          </button>
        </div>

        <div className="settings-content">
          <div className="profile-section">
            <h2>회원 정보</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  id="name"
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    name: e.target.value
                  })}
                  disabled={!isEditing}
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">이메일</label>
                <input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  disabled
                  placeholder="이메일"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">연락처</label>
                <input
                  id="phone"
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    phone: e.target.value
                  })}
                  disabled={!isEditing}
                  placeholder="연락처를 입력하세요"
                  pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
                />
              </div>

              <div className="button-group">
                {isEditing ? (
                  <>
                    <button type="submit" className="save-button">
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(profile);
                      }}
                      className="cancel-button"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="edit-button"
                  >
                    수정
                  </button>
                )}
              </div>
            </form>
          </div>

          {profile.signup_type === 'local' && (
            <div className="profile-section">
              <h2>비밀번호 변경</h2>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label htmlFor="currentPassword">현재 비밀번호</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">새 비밀번호</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value
                    })}
                    required
                    minLength={8}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value
                    })}
                    required
                    minLength={8}
                  />
                </div>

                {passwordError && (
                  <div className="error-message">{passwordError}</div>
                )}

                <div className="button-group">
                  <button type="submit" className="save-button">
                    비밀번호 변경
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileSettings; 