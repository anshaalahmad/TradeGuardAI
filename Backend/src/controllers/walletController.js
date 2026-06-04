const { PrismaClient } = require('@prisma/client');
const { encrypt, decrypt } = require('../utils/cryptoUtils');
const { getWalletPortfolio } = require('../services/balanceService');

const prisma = new PrismaClient();

/**
 * Get all wallets for the authenticated user
 */
const getWallets = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wallets = await prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Strip encrypted keys from response — never send to frontend
    const safeWallets = wallets.map((w) => ({
      ...w,
      apiKey: w.apiKey ? '••••••••' : null,
      apiSecret: w.apiSecret ? '••••••••' : null,
      hasApiKeys: !!(w.apiKey && w.apiSecret),
    }));

    res.json({ success: true, wallets: safeWallets });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wallets' });
  }
};

/**
 * Add a new wallet for the authenticated user
 */
const addWallet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, walletType, address, label, isDefault, apiKey, apiSecret, network } = req.body;

    if (!name || !walletType) {
      return res.status(400).json({
        success: false,
        error: 'Name and wallet type are required',
      });
    }

    // Exchange wallets require API key/secret
    if (walletType === 'BINANCE' && (!apiKey || !apiSecret)) {
      return res.status(400).json({
        success: false,
        error: 'API Key and API Secret are required for Binance wallets',
      });
    }

    // On-chain wallets require an address
    if (['METAMASK', 'TRUST_WALLET', 'COINBASE', 'LEDGER', 'PHANTOM'].includes(walletType) && !address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required for on-chain wallets',
      });
    }

    // If making this the default, un-default others
    if (isDefault) {
      await prisma.wallet.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check if it's the first wallet, make it default
    const count = await prisma.wallet.count({ where: { userId } });
    const shouldBeDefault = isDefault || count === 0;

    // Encrypt API keys before storing (trim whitespace to prevent HMAC errors)
    const encryptedApiKey = apiKey ? encrypt(apiKey.trim()) : null;
    const encryptedApiSecret = apiSecret ? encrypt(apiSecret.trim()) : null;

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name,
        walletType,
        address: address || null,
        label,
        apiKey: encryptedApiKey,
        apiSecret: encryptedApiSecret,
        network: network || null,
        isDefault: shouldBeDefault,
      },
    });

    // Return safe version
    res.status(201).json({
      success: true,
      wallet: {
        ...wallet,
        apiKey: wallet.apiKey ? '••••••••' : null,
        apiSecret: wallet.apiSecret ? '••••••••' : null,
        hasApiKeys: !!(wallet.apiKey && wallet.apiSecret),
      },
    });
  } catch (error) {
    console.error('Error adding wallet:', error);
    res.status(500).json({ success: false, error: 'Failed to add wallet' });
  }
};

/**
 * Update a wallet (label, isDefault)
 */
const updateWallet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { label, isDefault } = req.body;

    const wallet = await prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    if (isDefault && !wallet.isDefault) {
      await prisma.wallet.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id },
      data: {
        label: label !== undefined ? label : wallet.label,
        isDefault: isDefault !== undefined ? isDefault : wallet.isDefault,
      },
    });

    res.json({
      success: true,
      wallet: {
        ...updatedWallet,
        apiKey: updatedWallet.apiKey ? '••••••••' : null,
        apiSecret: updatedWallet.apiSecret ? '••••••••' : null,
        hasApiKeys: !!(updatedWallet.apiKey && updatedWallet.apiSecret),
      },
    });
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ success: false, error: 'Failed to update wallet' });
  }
};

/**
 * Delete a wallet
 */
const deleteWallet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const wallet = await prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    await prisma.wallet.delete({ where: { id } });

    // If deleted wallet was default, make the next one default
    if (wallet.isDefault) {
      const nextWallet = await prisma.wallet.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (nextWallet) {
        await prisma.wallet.update({
          where: { id: nextWallet.id },
          data: { isDefault: true },
        });
      }
    }

    res.json({ success: true, message: 'Wallet deleted successfully' });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    res.status(500).json({ success: false, error: 'Failed to delete wallet' });
  }
};

/**
 * Set a wallet as default
 */
const setDefaultWallet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const wallet = await prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    if (wallet.isDefault) {
      return res.json({ 
        success: true, 
        wallet: {
          ...wallet,
          apiKey: wallet.apiKey ? '••••••••' : null,
          apiSecret: wallet.apiSecret ? '••••••••' : null,
          hasApiKeys: !!(wallet.apiKey && wallet.apiSecret),
        } 
      });
    }

    await prisma.wallet.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    const updatedWallet = await prisma.wallet.update({
      where: { id },
      data: { isDefault: true },
    });

    res.json({ 
      success: true, 
      wallet: {
        ...updatedWallet,
        apiKey: updatedWallet.apiKey ? '••••••••' : null,
        apiSecret: updatedWallet.apiSecret ? '••••••••' : null,
        hasApiKeys: !!(updatedWallet.apiKey && updatedWallet.apiSecret),
      } 
    });
  } catch (error) {
    console.error('Error setting default wallet:', error);
    res.status(500).json({ success: false, error: 'Failed to set default wallet' });
  }
};

/**
 * Get live balances for a specific wallet
 */
const getWalletBalances = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const wallet = await prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    // Decrypt API keys if present
    const decryptedKey = wallet.apiKey ? decrypt(wallet.apiKey) : null;
    const decryptedSecret = wallet.apiSecret ? decrypt(wallet.apiSecret) : null;

    const portfolio = await getWalletPortfolio(wallet, decryptedKey, decryptedSecret);

    res.json({
      success: true,
      walletId: wallet.id,
      walletName: wallet.label || wallet.name,
      walletType: wallet.walletType,
      ...portfolio,
    });
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch wallet balances',
    });
  }
};

/**
 * Get aggregated portfolio summary across all wallets
 */
const getPortfolioSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wallets = await prisma.wallet.findMany({
      where: { userId },
    });

    if (wallets.length === 0) {
      return res.json({
        success: true,
        wallets: [],
        holdings: [],
        totalValueUsd: 0,
      });
    }

    let allHoldings = [];
    const walletSummaries = [];

    for (const wallet of wallets) {
      try {
        const decryptedKey = wallet.apiKey ? decrypt(wallet.apiKey) : null;
        const decryptedSecret = wallet.apiSecret ? decrypt(wallet.apiSecret) : null;

        const portfolio = await getWalletPortfolio(wallet, decryptedKey, decryptedSecret);

        walletSummaries.push({
          walletId: wallet.id,
          walletName: wallet.label || wallet.name,
          walletType: wallet.walletType,
          totalValueUsd: portfolio.totalValueUsd,
          holdingsCount: portfolio.holdings.length,
        });

        // Tag each holding with wallet info for aggregation
        for (const h of portfolio.holdings) {
          allHoldings.push({
            ...h,
            walletId: wallet.id,
            walletName: wallet.label || wallet.name,
          });
        }
      } catch (walletError) {
        console.error(`Error fetching balances for wallet ${wallet.id}:`, walletError.message);
        walletSummaries.push({
          walletId: wallet.id,
          walletName: wallet.label || wallet.name,
          walletType: wallet.walletType,
          totalValueUsd: 0,
          holdingsCount: 0,
          error: walletError.message,
        });
      }
    }

    // Aggregate holdings by asset across all wallets
    const aggregated = {};
    for (const h of allHoldings) {
      if (!aggregated[h.asset]) {
        aggregated[h.asset] = {
          asset: h.asset,
          total: 0,
          valueUsd: 0,
          priceUsd: h.priceUsd,
          change24h: h.change24h,
        };
      }
      aggregated[h.asset].total += h.total;
      aggregated[h.asset].valueUsd += h.valueUsd;
    }

    const mergedHoldings = Object.values(aggregated).sort((a, b) => b.valueUsd - a.valueUsd);
    const totalValueUsd = mergedHoldings.reduce((sum, h) => sum + h.valueUsd, 0);

    res.json({
      success: true,
      wallets: walletSummaries,
      holdings: mergedHoldings,
      totalValueUsd,
    });
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio summary',
    });
  }
};

module.exports = {
  getWallets,
  addWallet,
  updateWallet,
  deleteWallet,
  setDefaultWallet,
  getWalletBalances,
  getPortfolioSummary,
};
