import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const verifyAdmin = async () => {
  try {
    console.log('\n=================================');
    console.log('🔍 Verifying Admin User');
    console.log('=================================\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the admin user
    const admin = await User.findOne({ 
      email: "sharifiddrisu205@gmail.com" 
    }).select('+password');

    if (!admin) {
      console.log('❌ Admin user not found!\n');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('✅ Admin user found!');
    console.log('------------------');
    console.log('Name:     ', admin.name);
    console.log('Email:    ', admin.email);
    console.log('Phone:    ', admin.phoneNumber);
    console.log('Role:     ', admin.role);
    console.log('Location: ', admin.location);
    console.log('Password Hash:', admin.password.substring(0, 20) + '...');
    console.log('\n');

    // Test password
    const testPassword = '123456789z';
    console.log('🔐 Testing password:', testPassword);
    
    const isValid = await admin.comparePassword(testPassword);
    
    if (isValid) {
      console.log('✅ Password is CORRECT!\n');
      console.log('You can login with:');
      console.log('Email:    ', admin.email);
      console.log('Password: ', testPassword);
    } else {
      console.log('❌ Password is INCORRECT!\n');
      console.log('Let me fix it...\n');
      
      // Fix the password
      const newHash = bcrypt.hashSync(testPassword, 10);
      admin.password = newHash;
      await admin.save();
      
      console.log('✅ Password has been reset!');
      console.log('You can now login with:');
      console.log('Email:    ', admin.email);
      console.log('Password: ', testPassword);
    }

    console.log('\n=================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

verifyAdmin();
