import React, { useState } from 'react'

export default function Navlinks({ onFilterChange, activeFilter }) {
  const [active, setActive] = useState(activeFilter || 'top')

  const filters = [
    { id: 'top', label: 'Top' },
    { id: 'trending', label: 'Trending' },
    { id: 'visited', label: 'Most Visited' },
    { id: 'new', label: 'New' },
  ]

  const handleFilterClick = (filterId) => {
    setActive(filterId)
    onFilterChange?.(filterId)
  }

  return (
    <div className="navbar_app_component">
      <div className="main_app_nav_container">
        <div className="main_app_nav_content">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`main_app_nav_link ${active === filter.id ? 'is-active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}