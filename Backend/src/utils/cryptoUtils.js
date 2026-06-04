const crypto = require('crypto');

// The encryption key must be 32 bytes (256 bits) for aes-256.
// It will attempt to use the ENCRYPTION_KEY environment variable.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';

/**
 * Encrypts a plain text string securely using AES-256-GCM.
 * @param {string} text - The text to encrypt (e.g., API Secret).
 * @returns {string} The encrypted text in format "IV:AuthTag:EncryptedData".
 */
function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return iv.toString('hex') + ':' + authTag + ':' + encrypted;
}

/**
 * Decrypts a previously encrypted string.
 * Supports both AES-256-GCM (3 parts) and fallback AES-256-CBC (2 parts).
 * @param {string} text - The encrypted string format "IV:AuthTag:EncryptedData".
 * @returns {string|null} The decrypted plain text, or null if it fails.
 */
function decrypt(text) {
  if (!text) return null;
  try {
    const textParts = text.split(':');
    
    // Support legacy CBC format if it only has 2 parts
    if (textParts.length === 2) {
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    }
    
    // Support GCM format (3 parts: IV:AuthTag:EncryptedText)
    if (textParts.length === 3) {
      const iv = Buffer.from(textParts[0], 'hex');
      const authTag = Buffer.from(textParts[1], 'hex');
      const encryptedText = Buffer.from(textParts[2], 'hex');
      const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
    
    throw new Error('Unsupported encryption format');
  } catch (err) {
    console.error('Decryption failed:', err.message);
    return null;
  }
}

module.exports = {
  encrypt,
  decrypt
};
