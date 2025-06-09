import React from 'react';
import { FiMail, FiPhone, FiMessageSquare} from 'react-icons/fi';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import './Support.css';

const Support: React.FC = () => {
  return (
    <>
  <Header />
    <div className="support-container">
      <div className="support-header">
        <h1>고객지원 센터에 오신 것을 환영합니다</h1>
        <p>반려동물과 함께하는 행복한 일상, PETOPIA가 도와드리겠습니다.</p>
      </div>

      <div className="support-content">
        <div className="support-grid">
          <div className="support-card">
            <h2>자주 묻는 질문 (FAQ)</h2>
            <div className="faq-container">
              <details>
                <summary>배송 관련 문의</summary>
                <p>배송 관련된 문의 사항입니다.</p>
              </details>
              <details>
                <summary>반품/교환 안내</summary>
                <p>반품 및 교환에 대한 안내입니다.</p>
              </details>
              <details>
                <summary>결제 문의</summary>
                <p>결제 관련 문의 사항입니다.</p>
              </details>
            </div>
          </div>

          <div className="support-card">
            <h2>1:1 문의하기</h2>
            <p>FAQ에서 원하는 답변을 찾지 못하셨나요? 전문 상담원이 신속하게 답변해드리겠습니다.</p>
            <button className="support-button">문의하기</button>
          </div>
        </div>

        <div className="support-contact">
          <div className="support-contact-item">
            <FiMail className="support-icon" />
            <div className="support-text">
              <h3>이메일 문의</h3>
              <p>support@petopia.com</p>
              <p>평일 09:00 - 18:00</p>
            </div>
          </div>
          <div className="support-contact-item">
            <FiPhone className="support-icon" />
            <div className="support-text">
              <h3>전화 상담</h3>
              <p>1588-0000</p>
              <p>평일 09:00 - 18:00</p>
            </div>
          </div>
          <div className="support-contact-item">
            <FiMessageSquare className="support-icon" />
            <div className="support-text">
              <h3>실시간 채팅</h3>
              <p>평일 09:00 - 18:00</p>
              <button className="support-button">채팅 시작하기</button>
            </div>
          </div>
        </div>

        <div className="support-alert">
          <div>
            <h3>긴급 상황 발생 시</h3>
            <p>24시간 긴급 상담: <strong>1588-1234</strong></p>
            <p>가까운 동물병원 찾기: <a href="#">병원 검색</a></p>
          </div>
        </div>

        <div className="support-guideline">
          <h3>커뮤니티 가이드라인</h3>
          <div className="support-guideline-grid">
            <div className="support-guideline-item">
              <h4>기본 이용 수칙</h4>
              <ul>
                <li>반려동물 용품 사용 시 안전 주의사항 확인</li>
                <li>제품 사용 설명서 숙지</li>
                <li>품질 보증 기간 확인</li>
              </ul>
            </div>
            <div className="support-guideline-item">
              <h4>주의사항</h4>
              <ul>
                <li>반려동물을 알레르기 반응 주의</li>
                <li>제품 파손 시 즉시 교체</li>
                <li>위생 관리 철저</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Support;
