import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Migration script to add email and password to existing users
 * 
 * This script:
 * 1. Finds all users without email or password
 * 2. Generates a temporary email from phone number
 * 3. Sets a default password that users should change
 * 4. Updates the user records
 * 
 * Usage: node server/src/utils/migrateUsersToPasswordAuth.js
 */

const DEFAULT_PASSWORD = "ChangeMe123!";

async function migrateUsers() {
  try {
    console.log("🔄 Starting user migration to password authentication...\n");

    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to database\n");

    // Find users without email (old schema)
    const usersWithoutEmail = await User.find({ 
      $or: [
        { email: { $exists: false } },
        { email: "" },
        { email: null }
      ]
    });

    console.log(`📊 Found ${usersWithoutEmail.length} users to migrate\n`);

    if (usersWithoutEmail.length === 0) {
      console.log("✅ No users need migration. All users already have email and password.");
      await mongoose.disconnect();
      return;
    }

    // Hash the default password once
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

    let successCount = 0;
    let errorCount = 0;

    // Migrate each user
    for (const user of usersWithoutEmail) {
      try {
        // Generate email from phone number
        // Remove + and other special characters
        const cleanPhone = user.phoneNumber.replace(/[^0-9]/g, '');
        const tempEmail = `user${cleanPhone}@farmmarket.temp`;

        // Check if email already exists
        const existingEmail = await User.findOne({ email: tempEmail });
        if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
          console.log(`⚠️  Email ${tempEmail} already exists, skipping user ${user.name}`);
          errorCount++;
          continue;
        }

        // Update user with email and password
        // We need to update directly to bypass the pre-save hook
        await mongoose.connection.collection('users').updateOne(
          { _id: user._id },
          { 
            $set: { 
              email: tempEmail,
              password: hashedPassword
            }
          }
        );

        console.log(`✅ Migrated: ${user.name}`);
        console.log(`   Email: ${tempEmail}`);
        console.log(`   Password: ${DEFAULT_PASSWORD}`);
        console.log(`   Role: ${user.role}\n`);

        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating user ${user.name}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary");
    console.log("=".repeat(60));
    console.log(`✅ Successfully migrated: ${successCount} users`);
    console.log(`❌ Failed: ${errorCount} users`);
    console.log(`📧 Default password: ${DEFAULT_PASSWORD}`);
    console.log("=".repeat(60));

    if (successCount > 0) {
      console.log("\n⚠️  IMPORTANT NEXT STEPS:");
      console.log("1. Notify all migrated users about their temporary credentials");
      console.log("2. Ask users to login and change their password immediately");
      console.log("3. Ask users to update their email address in profile settings");
      console.log("4. Consider implementing a 'force password change' on first login");
    }

    await mongoose.disconnect();
    console.log("\n✅ Migration complete. Database connection closed.");

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateUsers();
