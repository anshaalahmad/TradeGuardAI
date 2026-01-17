import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../css/normalize.css';
import '../../css/webflow.css';
import '../../css/tradeguard-ai.webflow.css';

export default function Navbar({ onSearch, onMenuToggle, isSidebarOpen = false }) {
  const navigate = useNavigate();
  const { member, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userName = member?.customFields?.name || member?.auth?.email?.split('@')[0] || 'User';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setSearchQuery('');
    }
  };

  const handleMenuToggle = () => {
    onMenuToggle?.();
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div 
      role="banner" 
      className="navbar_app_component w-nav"
      data-collapse="medium"
      data-animation="default"
      data-duration="400"
      data-easing="ease"
    >
      <div className="navbar_app_container">
        <div className="navbar_app_content">
          <div className="navbar_app_form">
            <form onSubmit={handleSearchSubmit}>
              <input
                className="main_app_input"
                maxLength="256"
                name="search"
                placeholder="Search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </form>
          </div>
        </div>
        
        <nav 
          role="navigation" 
          className="navbar_menu is-page-height-tablet w-nav-menu"
        >
          <div className="navbar_menu-buttons">
            <a href="/" className="button is-secondary is-small is-icon">
              <img src="https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/6942dc1162b46cceef706c4c_generative%20(1).png" loading="lazy" alt="TradeGuard AI" className="navbar_app_icon is-big" />
              <div>TradeGuard AI</div>
            </a>
            <button
              onClick={handleProfileClick}
              className="navbar_app_profile_wrapper"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}
            >
              <div className="navbar_app_profile_image_wrapper">
                <img
                  src="https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/6942df0c1a223d8954bbf76b_Profile-min%20(3).jpg"
                  loading="lazy"
                  alt={userName}
                  className="navbar_app_profile_image"
                />
              </div>
              <div className="navbar_app_profile_content">
                <div className="text-size-regular text-weight-medium text-color-primary">{userName}</div>
                <div className="text-size-tiny">View your profile</div>
              </div>
              
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  minWidth: '200px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e5e7' }}>
                    <div className="text-size-small text-weight-medium">{userName}</div>
                    <div className="text-size-tiny text-color-secondary">{member?.auth?.email}</div>
                  </div>
                  <div
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#323539'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    role="button"
                    tabIndex={0}
                  >
                    Logout
                  </div>
                </div>
              )}
            </button>
          </div>
        </nav>
        
        <button
          onClick={handleMenuToggle}
          className={`menu-icon ${isSidebarOpen ? 'w--open' : ''}`}
          aria-label="Toggle sidebar"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div className="menu-icon_line-top"></div>
          <div className="menu-icon_line-middle">
            <div className="menu-icon_line-middle-inner"></div>
          </div>
          <div className="menu-icon_line-bottom"></div>
        </button>
      </div>

      <style>{`
        .navbar_app_component.w-nav {
          position: relative;
          z-index: 1000;
        }

        @media (max-width: 991px) {
          .navbar_menu {
            display: none;
          }

          .menu-icon {
            display: flex !important;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            padding: 0 !important;
          }

          .menu-icon_line-top,
          .menu-icon_line-middle,
          .menu-icon_line-bottom {
            width: 24px;
            height: 2px;
            background: currentColor;
            margin: 3px 0;
            transition: all 0.3s ease;
            transform-origin: center;
          }

          /* Burger to Cross animation */
          .menu-icon.w--open .menu-icon_line-top {
            transform: rotate(-45deg) translate(-5px, 6px);
          }

          .menu-icon.w--open .menu-icon_line-middle {
            opacity: 0;
            transform: scaleX(0);
          }

          .menu-icon.w--open .menu-icon_line-bottom {
            transform: rotate(45deg) translate(-5px, -6px);
          }
        }

        @media (min-width: 992px) {
          .menu-icon {
            display: none !important;
          }

          .navbar_menu {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}
