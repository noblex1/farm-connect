import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Admin details
    const adminData = {
      name: "Sharif Iddrisu",
      email: "sharifiddrisu205@gmail.com",
      phoneNumber: "+233536128476",
      password: "123456789z",
      role: "admin",
      location: "Tamale"
    };

    console.log('\n=================================');
    console.log('👤 Creating Admin User');
    console.log('=================================\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: adminData.email },
        { phoneNumber: adminData.phoneNumber }
      ]
    });

    if (existingUser) {
      console.log('⚠️  User already exists!');
      console.log('Updating existing user to admin role...\n');
      
      // Update existing user
      const hashedPassword = bcrypt.hashSync(adminData.password, 10);
      existingUser.name = adminData.name;
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      existingUser.location = adminData.location;
      await existingUser.save();
      
      console.log('✅ User updated successfully!');
    } else {
      // Create new admin user
      console.log('Creating new admin user...');
      const hashedPassword = bcrypt.hashSync(adminData.password, 10);
      
      const admin = new User({
        name: adminData.name,
        email: adminData.email,
        phoneNumber: adminData.phoneNumber,
        password: hashedPassword,
        role: 'admin',
        location: adminData.location,
        profilePicture: '',
        whatsappNumber: ''
      });

      await admin.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n=================================');
    console.log('✅ Admin User Ready!');
    console.log('=================================\n');
    console.log('Login Credentials:');
    console.log('------------------');
    console.log('Email:    ', adminData.email);
    console.log('Phone:    ', adminData.phoneNumber);
    console.log('Password: ', adminData.password);
    console.log('Role:     ', adminData.role);
    console.log('\n📱 You can login with either email or phone number!');
    console.log('🌐 Go to: http://localhost:8080/login\n');

    await mongoose.disconnect();
    console.log('✅ Done!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
