import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../shared/axios/axios';
import FailModal from '../../shared/ui/FailModal';
import './FindAccount.css';

const FindAccount: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"id" | "pw">("id");
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showFailModal, setShowFailModal] = useState(false);

  const handleTabClick = (tab: "id" | "pw") => {
    setActiveTab(tab);
    setError(null);
    setSuccessMessage(null);
    setFormData({
      userId: '',
      name: '',
      email: '',
      phone: ''
    });
  };

  const validateForm = (data: typeof formData) => {
    if (data.name?.trim() === "") {
      setError("이름을 입력하세요.");
      return false;
    }
    if (activeTab === "pw") {
      if (!data.userId || data.userId.trim() === "") {
        setError("아이디를 입력하세요.");
        return false;
      }
      if (!data.phone || data.phone.trim() === "") {
        setError("휴대폰 번호를 입력하세요.");
        return false;
      }
    } else {
      if (!data.email?.includes("@")) {
        setError("유효한 이메일 주소를 입력하세요.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    try {
      if (activeTab === "id") {
        const response = await axiosInstance.post('/api/auth/find-userid', {
          name: formData.name,
          email: formData.email
        });

        if (response.data.success) {
          setSuccessMessage(`찾은 아이디: ${response.data.userId}`);
        }
      } else {
        const response = await axiosInstance.post('/api/auth/reset-password', {
          userId: formData.userId,
          name: formData.name,
          phone: formData.phone
        });

        if (response.data.success) {
          setSuccessMessage(response.data.message);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '요청 처리 중 문제가 발생했습니다.';
      setError(errorMessage);
      setShowFailModal(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="find-container">
      <h1 className="find-title">아이디/비밀번호 찾기</h1>
      <div className="find-tabs">
        <button
          className={`find-tab ${activeTab === "id" ? "active" : ""}`}
          onClick={() => handleTabClick("id")}
        >
          아이디 찾기
        </button>
        <button
          className={`find-tab ${activeTab === "pw" ? "active" : ""}`}
          onClick={() => handleTabClick("pw")}
        >
          비밀번호 찾기
        </button>
      </div>
      {error && <div className="find-error">{error}</div>}
      {successMessage && <div className="find-success">{successMessage}</div>}
      <form className="find-form" onSubmit={handleSubmit}>
        {activeTab === "id" ? (
          <>
            <label className="find-label">
              이름
              <input 
                name="name" 
                type="text" 
                className="find-input" 
                placeholder="이름을 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.name}
              />
            </label>
            <label className="find-label">
              이메일 주소
              <input 
                name="email" 
                type="email" 
                className="find-input" 
                placeholder="이메일을 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.email}
              />
            </label>
          </>
        ) : (
          <>
            <label className="find-label">
              아이디
              <input 
                name="userId"
                type="text"
                className="find-input"
                placeholder="아이디를 입력하세요"
                required
                onChange={handleChange}
                value={formData.userId}
              />
            </label>
            <label className="find-label">
              이름
              <input 
                name="name" 
                type="text" 
                className="find-input" 
                placeholder="이름을 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.name}
              />
            </label>
            <label className="find-label">
              휴대폰 번호
              <input 
                name="phone" 
                type="text" 
                className="find-input" 
                placeholder="휴대폰 번호를 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.phone}
              />
            </label>
          </>
        )}
        <button type="submit" className="find-button">
          {activeTab === "id" ? "아이디 찾기" : "비밀번호 찾기"}
        </button>
      </form>
      <div className="find-footer">
        <a className="find-link" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>로그인하기</a>
        <span className="find-divider">|</span>
        <a className="find-link" onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>회원가입</a>
      </div>
      {showFailModal && (
        <FailModal
          title="요청 실패"
          message={error || '요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.'}
          icon="src/assets/Fail.png"
          onClose={() => setShowFailModal(false)}
        />
      )}
    </div>
  );
};

export default FindAccount;