import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'readline';
import User from '../src/models/User.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=================================');
console.log('👤 Create Admin User');
console.log('=================================\n');

const questions = [
  'Enter admin name: ',
  'Enter admin email: ',
  'Enter admin phone (e.g., +233500000000): ',
  'Enter admin password (min 6 chars): ',
  'Enter admin location: '
];

const answers = [];

const askQuestion = (index) => {
  if (index >= questions.length) {
    createAdmin();
    return;
  }

  rl.question(questions[index], (answer) => {
    answers.push(answer.trim());
    askQuestion(index + 1);
  });
};

const createAdmin = async () => {
  const [name, email, phoneNumber, password, location] = answers;

  // Validate inputs
  if (!name || !email || !phoneNumber || !password || !location) {
    console.log('\n❌ All fields are required\n');
    rl.close();
    process.exit(1);
  }

  if (password.length < 6) {
    console.log('\n❌ Password must be at least 6 characters\n');
    rl.close();
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      console.log('❌ User with this email or phone already exists\n');
      await mongoose.disconnect();
      rl.close();
      process.exit(1);
    }

    // Create admin user
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const admin = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'admin',
      location,
      profilePicture: '',
      whatsappNumber: ''
    });

    await admin.save();

    console.log('=================================');
    console.log('✅ Admin User Created Successfully!');
    console.log('=================================\n');
    console.log('Admin Details:');
    console.log('- Name:', name);
    console.log('- Email:', email);
    console.log('- Phone:', phoneNumber);
    console.log('- Role: admin');
    console.log('- Location:', location);
    console.log('\nYou can now login with these credentials!\n');

    await mongoose.disconnect();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    await mongoose.disconnect();
    rl.close();
    process.exit(1);
  }
};

// Start asking questions
askQuestion(0);
