import "./Footer.css"
import { IoLogoInstagram } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-section1">
        <div className="footer-heading">고객센터</div>
        <div className="footer-text-number">1544-0000</div>
        <div className="footer-text">평일 09:00 - 18:00</div>
        <div className="footer-text">점심 12:00 - 13:00</div>
      </div>
      <div className="footer-section2">
        <div className="footer-heading">회사소개</div>
        <div className="footer-text">회사소개</div>
        <div className="footer-text">인재채용</div>
        <div className="footer-text">제휴문의</div>
      </div>
      <div className="footer-section3">
        <div className="footer-heading">이용안내</div>
        <div className="footer-text">이용약관</div>
        <div className="footer-text">개인정보처리방침</div>
        <div className="footer-text">이용안내</div>
      </div>
      <div className="footer-section4">
        <div className="footer-heading">팔로우</div>
        <div className="footer-text4">
          <div className="footer-textIcon1"><IoLogoInstagram /></div>
          <div className="footer-textIcon2"><FaFacebook /></div>
          <div className="footer-textIcon3"><FaYoutube /></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;