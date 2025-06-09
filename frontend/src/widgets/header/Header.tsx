import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // React Router 사용
import './Header.css';
import SearchIcon from '../../assets/Search.png';
import CartIcon from '../../assets/Cart.png';
import BellIcon from '../../assets/Bell.png';
import MyIcon from '../../assets/My.png';

const Header: React.FC = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data.count);
        } else {
          console.error('Failed to fetch notifications.');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await fetch(`/api/products/search?keyword=${query}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results);
        } else {
          console.error('Failed to fetch search results.');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <header className="Header-header">
      <Link to="/" className="Header-logo">PETOPIA</Link>

      <nav className="Header-nav">
        <Link to="/about" className="Header-nav-link">ABOUT</Link>
        
        <div className="Header-nav-dropdown">
          <button className="Header-nav-link">DOG</button>
          <div className="Header-dropdown-content">
            <Link to="/ProductList">BATHROOM</Link>
            <Link to="/ProductList">LIVINGROOM</Link>
            <Link to="/ProductList">OUTSIDE</Link>
            <Link to="/ProductList">KITCHEN</Link>
            <Link to="/ProductList">CLOTHES</Link>
          </div>
        </div>

        <div className="Header-nav-dropdown">
          <button className="Header-nav-link">CAT</button>
          <div className="Header-dropdown-content">
            <Link to="/ProductList">BATHROOM</Link>
            <Link to="/ProductList">LIVINGROOM</Link>
            <Link to="/ProductList">OUTSIDE</Link>
            <Link to="/ProductList">KITCHEN</Link>
            <Link to="/ProductList">CLOTHES</Link>
          </div>
        </div>

        <Link to="/support" className="Header-nav-link">SUPPORT</Link>
      </nav>
      
      <div className="Header-search-cart-profile">
        <div className="Header-icons">
          <button className="Header-icon-button" onClick={handleSearchIconClick}>
            <img src={SearchIcon} alt="검색" className="Header-icon-image" />
          </button>
          
          {isSearchVisible && (
            <div className="Header-search-container">
              <input
                type="text"
                placeholder="찾으시는 상품을 검색해보세요"
                className="Header-search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchResults.length > 0 && (
                <div className="Header-search-results">
                  {searchResults.map((result, index) => (
                    <div key={index} className="Header-search-result-item">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Link to="/cart" className="Header-icon-button">
            <img src={CartIcon} alt="장바구니" className="Header-icon-image" />
          </Link>

          <button className="Header-icon-button Header-notification">
            <img src={BellIcon} alt="알람" className="Header-icon-image" />
            {notificationCount > 0 && (
              <span className="Header-notification-badge">{notificationCount}</span>
            )}
          </button>

          <Link to="/MyPage" className="Header-icon-button">
            <img src={MyIcon} alt="프로필" className="Header-icon-image" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
