import { Link } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import "./M-sidebar.css";

const MSidebar = () => {
  return (
    <div className="sidebar-M-s">
      <h1 className="logo-M-s">PETOPIA</h1>
      <nav>
        <ul>
          <li className="nav-item-M-s">
            <Link to="/MDashBoard" className="nav-link-M-s">
              <FaTachometerAlt className="icon-M-s" /> 대시보드
            </Link>
          </li>
          <li className="nav-item-M-s">
            <Link to="/MProduct" className="nav-link-M-s">
              <FaBoxOpen className="icon-M-s" /> 상품관리
            </Link>
          </li>
          <li className="nav-item-M-s">
            <Link to="/order" className="nav-link-M-s">
              <FaClipboardList className="icon-M-s" /> 주문관리
            </Link>
          </li>
        </ul>
      </nav>
      <div className="logout-section-M-s">
        <button className="logout-button-M-s">
          <FiLogOut className="icon-M-s" /> 로그아웃
        </button>
      </div>
    </div>
  );
};

export default MSidebar;
