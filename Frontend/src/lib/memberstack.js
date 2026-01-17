import memberstackDOM from '@memberstack/dom';

// Initialize Memberstack with your public key
// Get this from your Memberstack dashboard: Settings > API Keys
const memberstack = memberstackDOM.init({
  publicKey: import.meta.env.VITE_MEMBERSTACK_PUBLIC_KEY || 'pk_sb_your_public_key_here',
  sessionDurationDays: 7, // JWT session duration (default is 14)
});

export default memberstack;
