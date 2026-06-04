require('dotenv').config();
const { decrypt } = require('./src/utils/cryptoUtils');

const testKey = "5b40a836abc5ff5683cdc9cb590ec1fb:7f6b445204e4b4ca9c4dcccd45913e0e:a84ea77f0ef9576b5df9db9df9871d7142199d4716057e2377f50e78a436367674107ffb6e69a97702ec29020475ddb41bcc3414d48e51e66fbb9a78b6500bdc";

const dec = decrypt(testKey);
console.log("Decrypted key length:", dec ? dec.length : "FAILED");
