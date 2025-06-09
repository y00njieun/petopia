import { FiLogOut } from 'react-icons/fi';
import './M-header.css';

interface MHeaderProps {
  title: string;
}

const MHeader: React.FC<MHeaderProps> = ({ title }) => {
  return (
    <header className="header-M-h">
      <h2 className="title-M-h">{title}</h2>
      <div className="user-info-M-h">
        <span className="username-M-h">관리자님</span>
        <button className="logout-button-M-h">
          <FiLogOut className="icon-M-h" /> 로그아웃
        </button>
      </div>
    </header>
  );
};

export default MHeader;
