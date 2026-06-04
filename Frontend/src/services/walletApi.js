import api from './api';

const walletApi = {
  /**
   * Get all user wallets
   */
  getWallets: async () => {
    try {
      const response = await api.get('/api/wallets');
      return response;
    } catch (error) {
      console.error('Failed to get wallets:', error);
      throw error;
    }
  },

  /**
   * Add a new wallet
   * @param {Object} walletData { name, walletType, address, label, isDefault, apiKey, apiSecret, network }
   */
  addWallet: async (walletData) => {
    try {
      const response = await api.post('/api/wallets', walletData);
      return response;
    } catch (error) {
      console.error('Failed to add wallet:', error);
      throw error;
    }
  },

  /**
   * Update a wallet
   */
  updateWallet: async (id, updateData) => {
    try {
      const response = await api.put(`/api/wallets/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Failed to update wallet:', error);
      throw error;
    }
  },

  /**
   * Delete a wallet
   */
  deleteWallet: async (id) => {
    try {
      const response = await api.delete(`/api/wallets/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete wallet:', error);
      throw error;
    }
  },

  /**
   * Set a wallet as default
   */
  setDefaultWallet: async (id) => {
    try {
      const response = await api.put(`/api/wallets/${id}/default`);
      return response;
    } catch (error) {
      console.error('Failed to set default wallet:', error);
      throw error;
    }
  },

  /**
   * Get live balances for a specific wallet
   */
  getWalletBalances: async (id) => {
    try {
      const response = await api.get(`/api/wallets/${id}/balances`);
      return response;
    } catch (error) {
      console.error('Failed to get wallet balances:', error);
      throw error;
    }
  },

  /**
   * Get aggregated portfolio summary
   */
  getPortfolioSummary: async () => {
    try {
      const response = await api.get('/api/wallets/portfolio/summary');
      return response;
    } catch (error) {
      console.error('Failed to get portfolio summary:', error);
      throw error;
    }
  },
};

export default walletApi;
