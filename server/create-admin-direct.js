import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdminDirect = async () => {
  try {
    console.log('\n=================================');
    console.log('🔧 Creating Admin Directly in DB');
    console.log('=================================\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = "sharifiddrisu205@gmail.com";
    const password = "123456789z";

    // Delete existing
    await mongoose.connection.collection('users').deleteMany({ email });
    console.log('🗑️  Deleted existing user\n');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed\n');

    // Insert directly into collection (bypasses Mongoose middleware)
    const result = await mongoose.connection.collection('users').insertOne({
      name: "Sharif Iddrisu",
      email: email,
      phoneNumber: "+233536128476",
      password: hashedPassword,
      role: "admin",
      location: "Tamale",
      profilePicture: "",
      whatsappNumber: "+233536128476",
      createdAt: new Date()
    });

    console.log('✅ Admin inserted directly!\n');
    console.log('Inserted ID:', result.insertedId);
    console.log('\n');

    // Verify by reading back
    const admin = await mongoose.connection.collection('users').findOne({ email });
    console.log('📋 Verification:');
    console.log('- Name:', admin.name);
    console.log('- Email:', admin.email);
    console.log('- Phone:', admin.phoneNumber);
    console.log('- Role:', admin.role);
    console.log('- Password Hash:', admin.password.substring(0, 30) + '...');
    console.log('\n');

    // Test password manually
    console.log('🔐 Testing password with bcrypt.compare...');
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (isValid) {
      console.log('✅ Password comparison WORKS!\n');
      console.log('=================================');
      console.log('✅ ADMIN IS READY!');
      console.log('=================================\n');
      console.log('Login Credentials:');
      console.log('Email:    ', email);
      console.log('Password: ', password);
      console.log('\nGo to: http://localhost:8080/login\n');
    } else {
      console.log('❌ Password comparison FAILED!\n');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdminDirect();
