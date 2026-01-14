# TradeGuard AI - CSS Design System Analysis

## Overview
The application uses a comprehensive Webflow-generated CSS system with a well-defined color palette, component structure, and responsive design patterns.

## Color Palette

### Primary Colors
- **Brand Primary Blue**: `#1e65fa` - Used for buttons, links, primary UI elements
- **Brand Secondary Yellow**: `#f3ff43` - Accent color for highlights
- **Brand Black**: `#0f0f0f` - Primary background and text
- **Brand Blue Dark**: `#080331` - Dark blue variant for dark elements
- **Brand Blue**: `#2d62ff` - Secondary blue

### System Colors
- **Red (Errors/Sell)**: `#ef5350` - Used for negative values, sell orders
  - Used in class: `.text-color-red` and `.color-red`
- **Green (Success/Buy)**: `#26a69a` - Used for positive values, buy orders
  - Used in class: `.text-color-green` and `.color-green`

### Neutral Colors
- **White**: `#fff` - Primary background for cards
- **Black**: `#0f0f0f` / `#0f0f0f` - Primary text
- **Light Grey**: `#fafbfc` - Background grey
- **Border Grey**: `#e5e5e7` - Border color (primary)
- **Neutral Lighter**: `#ccc`
- **Neutral Light**: `#aaa`
- **Neutral**: `#666`
- **Neutral Dark**: `#444`
- **Neutral Darker**: `#222`
- **Neutral Darkest**: `#111`

## Typography Classes

### Font Sizes
- `.text-size-tiny`: Smallest text
- `.text-size-small`: Small text
- `.text-size-regular`: Regular/body text
- `.text-size-medium`: Medium text
- `.text-size-large`: Large text

### Font Weights
- `.text-weight-light`: 300
- `.text-weight-normal`: 400
- `.text-weight-medium`: 500-600
- `.text-weight-bold`: 700
- `.text-weight-xbold`: 800-900

### Text Colors
- `.text-color-primary`: `#323539` - Primary text
- `.text-color-secondary`: `#858c95` - Secondary text
- `.text-color-green`: `#26a69a` - Success/buy
- `.text-color-red`: `#ef5350` - Error/sell
- `.text-color-alternate`: White text

## Card Components

### Card Wrapper
```css
.card_app_wrapper {
  border: 1px solid var(--border-color--border-primary); /* #e5e5e7 */
  background-color: var(--base-color-neutral--white);     /* #fff */
  border-radius: .75rem;
  overflow: hidden !important;
}
```

### Card Header
```css
.card_app_header {
  border-bottom: 1px solid var(--border-color--border-primary);
  padding: 1rem 1.25rem;
  flex-flow: column;
  display: flex;
}
```

### Card Price
```css
.card_app_price {
  font-size: 2.5rem;
  line-height: 1;
}
```

### Card Text Wrapper
```css
.card_main_text_wrapper {
  display: flex;
  gap: 0.5rem;
}

.card_main_text_wrapper.is-centered {
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
```

### Crypto Icon
```css
.card_main_crypto_icon {
  max-width: 1.5rem;
  border-radius: 100%;
}
```

## Layout Classes

### Grid System
- `.dashboard_main_content`: 2-column grid (1.75fr 1fr) with 1.25rem gap
- `.dashboard_main_content.is-app`: 1-column layout (1.75fr)

### Spacing (Padding & Margin)
All spacing uses increments:
- `-tiny`: 0.25rem
- `-xsmall`: 0.5rem
- `-small`: 0.75rem
- `-medium`: 1rem
- `-large`: 1.25rem
- `-xlarge`: 2rem
- `-xxlarge`: 2.5rem
- etc.

Common padding: `1rem 1.25rem` (vertical horizontal)

### Border Radius
- `.card-radius`: 0.5rem
- Card default: 0.75rem

## Buttons

### Default Button
```css
.button {
  padding: 0.75rem 1.5rem;
  display: inline-block;
  border: none;
  cursor: pointer;
  background-color: var(--base-color-brand--color-primary);
  color: white;
  border-radius: 0.5rem;
}

.button:hover {
  opacity: 0.9;
}
```

### Button Variants
- `.button.is-secondary`: Secondary style
- `.button.is-text`: Text-only button
- `.button.is-small`: Smaller size
- `.button.is-large`: Larger size
- `.button.is-full-width`: 100% width
- `.button.is-icon`: Icon-only button

## Form Elements

### Input
```css
.form_input {
  padding: 0.75rem;
  border: 1px solid var(--border-color--border-primary);
  border-radius: 0.5rem;
  font-size: 1rem;
}
```

### Form Labels
```css
.form_input::placeholder {
  color: #858c95;
}
```

## Specific Components Used in Order Book

### Table Styling
- Border: `1px solid var(--border-color--border-primary)` (#e5e5e7)
- Padding: `0.5rem 0.75rem` typical for cells
- Font size: `0.875rem` for table content
- Sticky headers with `backgroundColor: var(--background-grey)` (#fafbfc)

### Color Application
- Buy Orders (Bids): `.text-color-green` (`#26a69a`) with `rgba(38, 166, 154, 0.08)` background
- Sell Orders (Asks): `.text-color-red` (`#ef5350`) with `rgba(239, 83, 80, 0.08)` background

## Responsive Design

### Breakpoints
- Desktop: 992px+
- Tablet: 768px - 991px
- Mobile: Below 767px

### Media Queries Used
```css
@media screen and (max-width: 991px) { ... }
@media screen and (max-width: 767px) { ... }
@media screen and (max-width: 479px) { ... }
```

## Key Variable Definitions

```css
:root {
  /* Primary Colors */
  --base-color-brand--color-primary: #1e65fa;
  --base-color-brand--color-secondary: #f3ff43;
  --base-color-brand--color-black: #0f0f0f;
  
  /* System Colors */
  --color-red: #ef5350;
  --color-green: #26a69a;
  
  /* Borders */
  --border-color--border-primary: #e5e5e7;
  --border-color--border-secondary: #1e65fa;
  
  /* Backgrounds */
  --background-color--background-primary: #0f0f0f;
  --background-color--background-alternate: #fff;
  --background-color--background-secondary: #1e65fa;
  
  /* Text */
  --text-color--text-primary: #323539;
  --text-color--text-secondary: #858c95;
  --text-color--text-alternate: #fff;
  
  /* Other */
  --background-grey: #fafbfc;
  --card-radius: 0.5rem;
}
```

## Best Practices for Custom UI

1. **Always use CSS Variables** for consistency: `var(--color-red)`, `var(--color-green)`, etc.
2. **Keep border color consistent**: Use `var(--border-color--border-primary)` (#e5e5e7)
3. **Background for cards**: Use `var(--base-color-neutral--white)` (#fff)
4. **Text colors**: Use `.text-color-primary`, `.text-color-secondary`, or `.text-color-green`/`.text-color-red`
5. **Spacing**: Use predefined padding/margin classes like `.padding-large`, `.margin-medium`
6. **Border radius**: Use `.75rem` for cards, `.5rem` for smaller elements
7. **Border style**: `1px solid var(--border-color--border-primary)` is standard
8. **Hover states**: Usually opacity change or subtle color adjustment

## Order Book Specific Styling

The OrderBook component uses:
- **Container**: `card_app_wrapper` - white background with light border
- **Header**: `card_app_header` - with bottom border
- **Buy Orders**: `.text-color-green` (#26a69a) with subtle green background
- **Sell Orders**: `.text-color-red` (#ef5350) with subtle red background
- **Tables**: Clean minimal styling with row borders at #f0f0f0
- **Sticky headers**: Grey background (#fafbfc) to indicate column headers
- **Price precision**: 2-8 decimal places depending on price level
- **Amount precision**: 4-8 decimal places for quantities

## Installation Notes

### Tailwind Configuration
Tailwind has been configured with custom theme extending to match the existing color system:

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#1e65fa',
        secondary: '#f3ff43',
        black: '#0f0f0f',
      },
      system: {
        green: '#26a69a',
        red: '#ef5350',
      },
      neutral: { /* ... */ }
    },
    borderRadius: {
      card: '0.75rem',
      sm: '0.5rem',
    }
  }
}
```

This allows using Tailwind classes like `text-brand-primary`, `bg-system-green`, `border-neutral-lighter`, etc., while maintaining consistency with the existing Webflow CSS system.
