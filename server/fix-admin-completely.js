import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const fixAdmin = async () => {
  try {
    console.log('\n=================================');
    console.log('🔧 Fixing Admin User Completely');
    console.log('=================================\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = "sharifiddrisu205@gmail.com";
    const password = "123456789z";

    // Delete existing admin if exists
    await User.deleteMany({ email });
    console.log('🗑️  Deleted any existing user with this email\n');

    // Create fresh admin user WITHOUT using the model's pre-save hook
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await User.create({
      name: "Sharif Iddrisu",
      email: email,
      phoneNumber: "+233536128476",
      password: hashedPassword, // Already hashed, won't be hashed again
      role: "admin",
      location: "Tamale",
      profilePicture: "",
      whatsappNumber: "+233536128476"
    });

    console.log('✅ Admin user created!\n');

    // Verify it was created correctly
    const verifyAdmin = await User.findById(admin._id).select('+password');
    console.log('📋 Admin Details:');
    console.log('- Name:', verifyAdmin.name);
    console.log('- Email:', verifyAdmin.email);
    console.log('- Phone:', verifyAdmin.phoneNumber);
    console.log('- Role:', verifyAdmin.role);
    console.log('- Password Hash:', verifyAdmin.password.substring(0, 30) + '...');
    console.log('\n');

    // Test the password
    console.log('🔐 Testing password...');
    const isValid = await verifyAdmin.comparePassword(password);
    
    if (isValid) {
      console.log('✅ Password test PASSED!\n');
      console.log('=================================');
      console.log('✅ ADMIN IS READY TO USE!');
      console.log('=================================\n');
      console.log('Login with:');
      console.log('Email:    ', email);
      console.log('Password: ', password);
      console.log('\nGo to: http://localhost:8080/login\n');
    } else {
      console.log('❌ Password test FAILED!\n');
      console.log('Something is wrong with the password comparison.\n');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

fixAdmin();
