# Quick Reference Guide

## Component Usage

### OrderBook Component

```jsx
import OrderBook from './Components/Chart/OrderBook/OrderBook'

// Basic usage
<OrderBook symbol="BTCUSDT" />

// With custom options
<OrderBook symbol="ETHUSDT" maxOrders={15} />

// Props:
// - symbol: string (default: 'BTCUSDT') - Trading pair symbol
// - maxOrders: number (default: 10) - Max buy/sell orders to display
```

### BinanceCandleChartCard (Updated)

```jsx
import BinanceCandleChartCard from './Components/Chart/CandleChart/BinanceCandleChartCard'

<BinanceCandleChartCard
  name="Bitcoin"
  symbol="BTC"
  price={93000}
  change={2.5}
  chartSymbol="BTCUSDT"
  interval="1m"
  height={400}
/>

// Now includes:
// - Candlestick chart on the left
// - Order book on the right
// - All original functionality preserved
```

## Key Design System Colors

```css
/* For use in inline styles or CSS */
var(--color-green)                    /* #26a69a - Buy orders */
var(--color-red)                      /* #ef5350 - Sell orders */
var(--base-color-neutral--white)      /* #fff - Card background */
var(--border-color--border-primary)   /* #e5e5e7 - Borders */
var(--text-color--text-primary)       /* #323539 - Main text */
var(--text-color--text-secondary)     /* #858c95 - Secondary text */
var(--background-grey)                /* #fafbfc - Backgrounds */
var(--base-color-brand--color-primary)/* #1e65fa - Primary blue */
```

## CSS Classes

```html
<!-- Card Structure -->
<div class="card_app_wrapper">
  <div class="card_app_header">
    <div class="card_main_text_wrapper is-centered">
      <!-- Content -->
    </div>
  </div>
</div>

<!-- Typography -->
<div class="text-size-large text-weight-medium text-color-primary">
  Large Medium Primary Text
</div>

<div class="text-size-regular text-color-green">
  Regular Green Text
</div>

<div class="text-size-small text-color-secondary">
  Small Secondary Text
</div>

<!-- Color Classes -->
<div class="text-color-green">Green text for buys</div>
<div class="text-color-red">Red text for sells</div>
<div class="text-color-primary">Primary text color</div>
<div class="text-color-secondary">Secondary text color</div>
```

## Tailwind Configuration

```javascript
// Available custom theme colors
colors: {
  brand: {
    primary: '#1e65fa',
    secondary: '#f3ff43',
    black: '#0f0f0f',
    blue: '#2d62ff',
    'blue-dark': '#080331',
  },
  neutral: {
    white: '#fff',
    black: '#0f0f0f',
    lightest: '#eee',
    lighter: '#ccc',
    light: '#aaa',
    gray: '#666',
    dark: '#444',
    darker: '#222',
    darkest: '#111',
  },
  system: {
    green: '#26a69a',
    red: '#ef5350',
  },
}

// Usage in components
<div className="text-brand-primary">Primary text</div>
<div className="bg-system-green">Green background</div>
<div className="border-neutral-lighter">Light border</div>
```

## Common Patterns

### Flex Layout with Chart and Orderbook
```jsx
<div style={{ display: 'flex', gap: '1.25rem' }}>
  <div style={{ flex: 1 }}>
    {/* Chart here */}
  </div>
  <div style={{ width: '300px' }}>
    {/* OrderBook here */}
  </div>
</div>
```

### Card with Header and Content
```jsx
<div className="card_app_wrapper">
  <div className="card_app_header">
    <div className="text-size-large text-weight-medium">
      Card Title
    </div>
  </div>
  <div style={{ padding: '1.25rem' }}>
    {/* Card content */}
  </div>
</div>
```

### Colored Text (Green for Buy, Red for Sell)
```jsx
<div className="text-color-green">+2.5%</div>
<div className="text-color-red">-1.8%</div>
```

## Popular Spacing Values

```css
0.25rem  /* tiny */
0.5rem   /* xsmall */
0.75rem  /* small */
1rem     /* medium */
1.25rem  /* large */
1.5rem   /* xlarge */
2rem     /* xxlarge */
2.5rem   /* xxxlarge */
4rem     /* xxhuge */
```

## Font Sizes

```css
text-size-tiny       /* Smallest */
text-size-small      /* Small */
text-size-regular    /* Regular body text */
text-size-medium     /* Medium */
text-size-large      /* Large */
```

## Font Weights

```css
text-weight-light    /* 300 */
text-weight-normal   /* 400 */
text-weight-medium   /* 500-600 */
text-weight-bold     /* 700 */
text-weight-xbold    /* 800-900 */
```

## npm Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint

# Tailwind (if needed)
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

## Troubleshooting

### Order book not updating?
Check browser DevTools:
1. Network tab → Filter by "WS" (WebSocket)
2. Should see `depth@100ms` connection
3. Check Console for errors

### Colors not showing?
1. Verify CSS files are linked in HTML
2. Check browser DevTools → Styles
3. Ensure classes match exactly (case-sensitive)

### Layout broken?
1. Check parent container has `display: flex`
2. Verify gap value is set
3. Check width/flex values on children

### Tailwind not working?
1. Run `npm install` to ensure packages installed
2. Check `tailwind.config.js` exists
3. Check `postcss.config.js` exists
4. Clear cache: `npm cache clean --force`

## Performance Tips

1. **Limit orders displayed** - Default 10 is good, 15+ may slow down
2. **Use production build** - `npm run build` for optimized output
3. **Monitor WebSocket** - High-frequency updates may impact performance
4. **Lazy load components** - Use React.lazy for OrderBook if needed
5. **Memoize if needed** - Use React.memo for OrderBook if parent re-renders frequently

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Requires WebSocket support

## Resources

- [Lightweight Charts Documentation](https://tradingview.github.io/lightweight-charts/)
- [Binance API Documentation](https://binance-docs.github.io/apidocs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Design System](./CSS_DESIGN_SYSTEM.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)

---

**Last Updated:** January 12, 2026  
**Status:** ✅ Production Ready
