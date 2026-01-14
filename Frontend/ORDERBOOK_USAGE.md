# Order Book Card - Usage Guide

## Quick Start

The OrderBookCard component is designed to fit perfectly in your `dashboard_main_content` grid layout.

## Import

```jsx
import OrderBookCard from './Components/Chart/OrderBook/OrderBookCard'
```

## Usage

### In your dashboard with grid layout:

```jsx
<div className="dashboard_main_content">
  {/* Your existing chart card */}
  <BinanceCandleChartCard
    name="Bitcoin"
    symbol="BTC"
    price={93000}
    change={2.5}
    chartSymbol="BTCUSDT"
    interval="1m"
    height={400}
  />
  
  {/* New OrderBook card - will align perfectly in the grid */}
  <OrderBookCard 
    symbol="BTCUSDT" 
    maxOrders={15}
    height={400}
  />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `symbol` | string | `'BTCUSDT'` | Trading pair symbol from Binance |
| `maxOrders` | number | `15` | Maximum number of buy/sell orders to display |
| `height` | number | `400` | Height of the order book in pixels |

## Examples

### Bitcoin Order Book
```jsx
<OrderBookCard symbol="BTCUSDT" />
```

### Ethereum Order Book with More Orders
```jsx
<OrderBookCard 
  symbol="ETHUSDT" 
  maxOrders={20}
  height={500}
/>
```

### Different Trading Pairs
```jsx
<OrderBookCard symbol="BNBUSDT" />
<OrderBookCard symbol="ADAUSDT" />
<OrderBookCard symbol="SOLUSDT" />
```

## Grid Layout

The `dashboard_main_content` class uses CSS Grid:
```css
.dashboard_main_content {
  grid-template-columns: 1.75fr 1fr;
  gap: 1.25rem;
}
```

This means:
- First item (chart): Takes 1.75 fraction of space
- Second item (order book): Takes 1 fraction of space
- Perfect alignment with 1.25rem gap

## Features

✅ Real-time order book updates from Binance  
✅ Green buy orders, red sell orders  
✅ Visual quantity bars  
✅ Automatic grid alignment  
✅ Follows your design system  
✅ Responsive layout  

## What Was Fixed

❌ **Before**: Modified BinanceCandleChartCard (wrong approach)  
✅ **After**: Created separate OrderBookCard component (correct approach)

The chart component is now completely untouched and works exactly as before!
