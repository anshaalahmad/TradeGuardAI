import React, { useState } from 'react'
import './css/normalize.css'
import './css/tradeguard-ai.webflow.css'
import './css/webflow.css'
import Navbar from './Components/Dashboard Pages/Navbar'
import Sidebar from './Components/Dashboard Pages/Sidebar'
import Navlinks from './Components/Dashboard Pages/Navlinks'
import BinanceCandleChartCard from './Components/Chart/CandleChart/BinanceCandleChartCard.jsx'
import OrderBookCard from './Components/Chart/OrderBook/OrderBookCard.jsx'
import MarketTradesCard from './Components/Chart/MarketTrades/MarketTradesCard.jsx'

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Trading pair configuration - change here to update both components
  const tradingConfig = {
    name: "Bitcoin",
    symbol: "BTC",
    chartSymbol: "BTCUSDT",
    interval: "1h",
    height: 400,
    maxOrders: 8,
    maxTrades: 10
  }

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
          <div className='dashboard_main_app'>
            <div className='dashboard_main_content'>
              <BinanceCandleChartCard
                name={tradingConfig.name}
                symbol={tradingConfig.symbol}
                chartSymbol={tradingConfig.chartSymbol}
                interval={tradingConfig.interval}
                height={tradingConfig.height}
              />
              <div className='content_main_flex'>
                <OrderBookCard 
                symbol={tradingConfig.chartSymbol}
                baseAsset={tradingConfig.symbol}
                maxOrders={tradingConfig.maxOrders}
              />
                <MarketTradesCard 
                symbol={tradingConfig.chartSymbol}
                baseAsset={tradingConfig.symbol}
                maxTrades={tradingConfig.maxTrades}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
