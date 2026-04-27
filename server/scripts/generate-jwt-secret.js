import crypto from 'crypto';

// Generate a secure random JWT secret (64 characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n=================================');
console.log('🔑 JWT Secret Generated');
console.log('=================================\n');
console.log('Copy this to your .env file as JWT_SECRET:\n');
console.log(jwtSecret);
console.log('\n=================================\n');
