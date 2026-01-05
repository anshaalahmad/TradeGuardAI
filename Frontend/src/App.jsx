import React, { useState } from 'react'
import './css/normalize.css'
import './css/tradeguard-ai.webflow.css'
import './css/webflow.css'
import Navbar from './Components/Dashboard Pages/Navbar'
import Sidebar from './Components/Dashboard Pages/Sidebar'
import Navlinks from './Components/Dashboard Pages/Navlinks'

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='page-wrapper'>
      <div className='main-wrapper is-dashboard'>
        <Sidebar isOpen={isSidebarOpen} />
        <div className='dashboard_main_wrapper'>
          <Navbar onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />
          <Navlinks />
        </div>
      </div>
    </div>
  )
}
