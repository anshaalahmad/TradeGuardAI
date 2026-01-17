import React, { useState } from 'react'

export default function Sidebar({ userName = 'Anshaal Ahmad', onNavigate, activePage, isOpen = false }) {
  const [activeLink, setActiveLink] = useState(activePage || 'cryptocurrency')

  const navigationLinks = [
    { id: 'cryptocurrency', label: 'Cryptocurrency', path: '/cryptocurrency' },
    { id: 'predictions', label: 'Predictions', path: '/predictions' },
    { id: 'resources', label: 'Resources', path: '/resources' },
    { id: 'portfolio', label: 'My Portfolio', path: '/portfolio' },
  ]

  const handleNavClick = (linkId, path) => {
    setActiveLink(linkId)
    onNavigate?.(path, linkId)
  }

  return (
    <>
      <div 
        className="sidebar_app_wrapper"
        style={{
          transform: isOpen ? 'translate(0%)' : 'translate(-100%)',
          transition: 'transform 0.4s ease'
        }}
      >
        <div className="sidebar_app_header">
          <a href="/" className="navbar_app_logo-link w-nav-brand">
            <img src="https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/69426dffe6149e1de06911c1_Group%204%20(1).svg" loading="lazy" alt="TradeGuard AI Logo" className="navbar_logo" />
          </a>
          <div className="text-size-large text-weight-medium">Dashboard</div>
          <div className="text-color-secondary" style={{ fontSize: '1rem' }}>
            Hey there, {userName}!
          </div>
        </div>

        <div className="sidebar_app_link_wrapper">
          {navigationLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id, link.path)}
              className={`sidebar_app_link ${activeLink === link.id ? 'is-active' : ''}`}
              style={activeLink !== link.id ? { color: '#666' } : {}}
            >
              <img src="https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/6942811bece7a69907efd693_Icon.svg" loading="lazy" alt={`${link.label} Icon`} />
              <div className="text-size-medium">{link.label}</div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .sidebar_app_wrapper {
            transform: translate(0%) !important;
          }
        }
      `}</style>
    </>
  )
}