const crypto = require('crypto');

const testKey = "5b40a836abc5ff5683cdc9cb590ec1fb:7f6b445204e4b4ca9c4dcccd45913e0e:a84ea77f0ef9576b5df9db9df9871d7142199d4716057e2377f50e78a436367674107ffb6e69a97702ec29020475ddb41bcc3414d48e51e66fbb9a78b6500bdc";

const textParts = testKey.split(':');
const iv = Buffer.from(textParts[0], 'hex');
const authTag = Buffer.from(textParts[1], 'hex');
const encryptedText = Buffer.from(textParts[2], 'hex');

function tryDecrypt(keyBuffer) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return null;
  }
}

const possibleKeys = [
  '12345678901234567890123456789012',
  'tradeguard-jwt-secret-change-in-', // truncated 32
];

for (const k of possibleKeys) {
  const buf = Buffer.from(k);
  if (buf.length === 32) {
    const res = tryDecrypt(buf);
    if (res) console.log("SUCCESS with string key:", k, res);
  }
}

// Try sha256 hashes of various env vars
const envVars = [
  'tradeguard-jwt-secret-change-in-production-2024',
  'tradeguard-refresh-secret-change-in-production-2024',
  'TradeGuardAI'
];

for (const v of envVars) {
  const hash = crypto.createHash('sha256').update(v).digest();
  const res = tryDecrypt(hash);
  if (res) console.log("SUCCESS with hash of:", v, res);
}
