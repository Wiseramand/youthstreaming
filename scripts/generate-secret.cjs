const crypto = require('crypto');

// Generate a strong JWT secret
const secret = crypto.randomBytes(64).toString('hex');
console.log('JWT Secret:', secret);
console.log('Length:', secret.length);

// Generate a random string for session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('Session Secret:', sessionSecret);
console.log('Length:', sessionSecret.length);