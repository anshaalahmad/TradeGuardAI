import React, { createContext, useContext, useEffect, useState } from 'react';
import memberstack from '../lib/memberstack';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: currentMember } = await memberstack.getCurrentMember();
        setMember(currentMember);
      } catch (err) {
        console.error('Failed to get current member:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for authentication state changes
    const authListener = memberstack.onAuthChange((member) => {
      setMember(member);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data: loggedInMember } = await memberstack.loginMemberEmailPassword({
        email,
        password,
      });
      console.log('Login response:', loggedInMember);
      // Fetch the complete member data after login
      const { data: currentMember } = await memberstack.getCurrentMember();
      console.log('Current member after login:', currentMember);
      setMember(currentMember || loggedInMember);
      return { success: true, member: currentMember || loggedInMember };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (email, password, customFields = {}) => {
    try {
      console.log('Signing up with customFields:', customFields);
      const { data: newMember } = await memberstack.signupMemberEmailPassword({
        email,
        password,
        customFields,
      });
      console.log('Signup response:', newMember);
      // Fetch the complete member data after signup to ensure customFields are loaded
      const { data: currentMember } = await memberstack.getCurrentMember();
      console.log('Current member after signup:', currentMember);
      setMember(currentMember || newMember);
      return { success: true, member: currentMember || newMember };
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await memberstack.logout();
      setMember(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Logout failed' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data: loggedInMember } = await memberstack.loginWithProvider({
        provider: 'google',
      });
      // Fetch the complete member data after login
      const { data: currentMember } = await memberstack.getCurrentMember();
      setMember(currentMember || loggedInMember);
      return { success: true, member: loggedInMember };
    } catch (err) {
      return { success: false, error: err.message || 'Google login failed' };
    }
  };

  const signupWithGoogle = async () => {
    try {
      // OAuth providers in Memberstack automatically handle both login and signup
      const { data: member } = await memberstack.loginWithProvider({
        provider: 'google',
      });
      // Fetch the complete member data
      const { data: currentMember } = await memberstack.getCurrentMember();
      setMember(currentMember || member);
      return { success: true, member };
    } catch (err) {
      console.error('Google signup error:', err);
      const errorMsg = err.message || '';
      // If account doesn't exist, provide helpful message
      if (errorMsg.toLowerCase().includes('not found') || errorMsg.toLowerCase().includes('does not exist')) {
        return { 
          success: false, 
          error: 'No account found. Please sign up with email first, or contact support to enable Google signup.' 
        };
      }
      return { 
        success: false, 
        error: errorMsg || 'Google signup failed. Please try again.' 
      };
    }
  };

  const sendPasswordResetEmail = async (email) => {
    try {
      await memberstack.sendMemberResetPasswordEmail({ email });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to send reset email' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const result = await memberstack.resetMemberPassword({ 
        token: token,
        newPassword: newPassword 
      });
      return { success: true, data: result };
    } catch (err) {
      console.error('Password reset error:', err);
      return { success: false, error: err.message || 'Password reset failed' };
    }
  };

  const updateMemberInfo = async (customFields) => {
    try {
      const { data: updatedMember } = await memberstack.updateMember({ customFields });
      setMember(updatedMember);
      return { success: true, member: updatedMember };
    } catch (err) {
      return { success: false, error: err.message || 'Update failed' };
    }
  };

  const updateMemberAuth = async (currentPassword, newEmail = null, newPassword = null) => {
    try {
      // For password change: use setPassword method with correct parameter names
      if (newPassword) {
        console.log('Using setPassword method');
        // Try different parameter combinations
        const result = await memberstack.setPassword({
          oldPassword: currentPassword,
          password: newPassword,
        });
        console.log('setPassword result:', result);
        
        const { data: currentMember } = await memberstack.getCurrentMember();
        setMember(currentMember);
        return { success: true, member: currentMember };
      }
      
      // For email change: use updateMemberAuth method
      if (newEmail) {
        console.log('Using updateMemberAuth for email change');
        const result = await memberstack.updateMemberAuth({
          currentPassword,
          email: newEmail,
        });
        console.log('updateMemberAuth result:', result);
        
        const { data: currentMember } = await memberstack.getCurrentMember();
        setMember(currentMember || result?.data);
        return { success: true, member: currentMember || result?.data };
      }
      
      return { success: false, error: 'No update parameters provided' };
    } catch (err) {
      console.error('Update member auth error:', err);
      console.error('Error details:', err.response || err);
      return { success: false, error: err.message || 'Update failed' };
    }
  };

  const deleteMemberAccount = async () => {
    try {
      await memberstack.deleteMember();
      setMember(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Delete failed' };
    }
  };

  const value = {
    member,
    loading,
    error,
    isAuthenticated: !!member,
    memberstack,
    // Auth methods
    login,
    signup,
    logout,
    loginWithGoogle,
    signupWithGoogle,
    sendPasswordResetEmail,
    resetPassword,
    updateMemberInfo,
    updateMemberAuth,
    deleteMemberAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
