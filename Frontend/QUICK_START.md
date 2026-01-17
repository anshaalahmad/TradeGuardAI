# TradeGuard AI - Quick Start Guide 🚀

## Your App is Running! 🎉

**Development Server:** http://localhost:5174/

## Complete App Flow

### 1. Landing Page (`/`)
- Hero section with "Get Started" and "Contact Us" CTAs
- Features showcase
- Pricing plans
- FAQ section
- Footer with navigation

**Actions:**
- Click "Get Started" → Redirects to `/app` (protected, will redirect to login if not authenticated)
- Click "Sign up" in navbar → Goes to `/signup`
- Click "Log in" in navbar → Goes to `/login`

### 2. Sign Up Page (`/signup`)
- Create new account with:
  - Name
  - Email
  - Password (with real-time validation)
- Google OAuth signup button
- Link to login page if already have account

**Flow:**
- Fill form → Click "Submit" → Auto-login → Redirect to `/app` dashboard

### 3. Login Page (`/login`)
- Login with email/password
- Google OAuth login
- "Forgot Password" link
- Link to signup page

**Flow:**
- Enter credentials → Click "Submit" → Redirect to `/app` dashboard

### 4. Forgot Password Page (`/forgot-password`)
- **Step 1:** Enter email → Send reset code
- **Step 2:** Enter 6-digit code + new password (with validation) + confirm password
- **Step 3:** Success message → Back to login

### 5. Dashboard App (`/app`) - **PROTECTED**
- Only accessible when authenticated
- Shows real-time crypto data:
  - Candlestick chart (Bitcoin by default)
  - Order book
  - Market trades
- User profile dropdown with logout in navbar
- Sidebar navigation

**Features:**
- Real-time WebSocket data from Binance
- Throttled updates (250ms) for smooth UI
- Configurable trading pairs

### 6. User Features in Navbar
- Shows user name (from Memberstack profile or email)
- Profile dropdown with:
  - User email
  - Logout button

## Setting Up Memberstack (Required for Auth to Work)

### Step 1: Get Memberstack Account
1. Go to https://app.memberstack.com/
2. Sign up or login
3. Create a new project or use existing

### Step 2: Get API Key
1. In Memberstack dashboard → Settings → API Keys
2. Copy your **Public Key** (starts with `pk_`)

### Step 3: Update .env File
```bash
# Edit Frontend/.env
REACT_APP_MEMBERSTACK_PUBLIC_KEY=pk_sb_your_actual_key_here
```

### Step 4: Configure Memberstack Dashboard
1. **Gated Content:**
   - URL Pattern: `/app`
   - Method: "Starts with"
   - Required: All logged-in members

2. **Redirects:**
   - Access Denied URL: `/login`
   - After Login: `/app`
   - After Signup: `/app`

3. **Optional - Enable Google OAuth:**
   - Settings → OAuth Providers
   - Enable Google
   - Add OAuth credentials

### Step 5: Test the Flow
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Visit http://localhost:5174/
3. Click "Sign up" and create test account
4. Should auto-redirect to dashboard
5. Test logout from profile menu
6. Test login again

## Navigation Flow Chart

```
Landing (/)
   ├─> Sign Up (/signup)
   │    └─> [Success] → Dashboard (/app)
   │    
   ├─> Log In (/login)
   │    ├─> [Success] → Dashboard (/app)
   │    └─> Forgot Password (/forgot-password)
   │         └─> Reset Success → Login (/login)
   │
   ├─> Get Started Button → Dashboard (/app)
   │    └─> [Not Authenticated] → Login (/login)
   │
   └─> Dashboard (/app) [PROTECTED]
        ├─> [Not Authenticated] → Login (/login)
        └─> [Authenticated] → Show Dashboard
             └─> Logout → Landing (/)
```

## Key Features Implemented

✅ **Authentication System**
- Memberstack integration with React Context
- Protected routes
- Auto-redirect on auth state changes

✅ **User Experience**
- Smooth navigation between pages
- Real-time password validation
- Error handling with user-friendly messages
- Loading states during API calls

✅ **Dashboard**
- Real-time crypto data
- WebSocket connections
- Interactive charts
- Order book & market trades

✅ **Responsive Design**
- All Webflow CSS preserved
- Mobile-friendly navigation
- Adaptive layouts

## Troubleshooting

### "Login not working"
- Check if Memberstack API key is set in `.env`
- Verify key starts with `pk_` (public key, not secret)
- Check browser console for errors

### "Redirect loop"
- Clear browser cache and cookies
- Check Memberstack dashboard redirect settings
- Ensure gated content is configured correctly

### "WebSocket errors in dashboard"
- This is normal if Binance API is rate-limited
- Data will still load, just might take a moment
- Check internet connection

### "Images not loading"
- Ensure `/public/images/` folder has all assets
- Check image paths in components

## Next Steps

1. **Add More Pages:**
   - Predictions page
   - Portfolio management
   - Resources/blog
   - User profile settings

2. **Backend Integration:**
   - Connect to your Express backend (already created in `/Backend`)
   - Set up webhook endpoints for Memberstack events
   - Sync user data to MongoDB

3. **Premium Features:**
   - Add subscription plans in Memberstack
   - Gate premium features with plan checks
   - Implement upgrade flow

4. **Customization:**
   - Update branding colors
   - Add custom crypto symbols
   - Customize email templates in Memberstack

## Support

- Memberstack Docs: https://developers.memberstack.com/
- React Router: https://reactrouter.com/
- Vite: https://vite.dev/

---

**Happy Trading! 📈🚀**
