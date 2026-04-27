import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=================================');
console.log('🔐 Password Hasher');
console.log('=================================\n');

rl.question('Enter password to hash: ', (password) => {
  if (!password || password.length < 6) {
    console.log('\n❌ Password must be at least 6 characters long\n');
    rl.close();
    return;
  }

  const hash = bcrypt.hashSync(password, 10);
  
  console.log('\n=================================');
  console.log('✅ Password Hashed Successfully');
  console.log('=================================\n');
  console.log('Original Password:', password);
  console.log('\nHashed Password (use this in MongoDB):\n');
  console.log(hash);
  console.log('\n=================================\n');
  
  rl.close();
});
