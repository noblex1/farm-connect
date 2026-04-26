import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("=== Cloudinary Configuration Test ===\n");

// Check environment variables
console.log("1. Environment Variables:");
console.log("   CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ MISSING");
console.log("   CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ SET" : "❌ MISSING");
console.log("   CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ SET" : "❌ MISSING");
console.log();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Cloudinary credentials are missing in .env file");
  console.log("\nPlease add the following to server/.env:");
  console.log("CLOUDINARY_CLOUD_NAME=your_cloud_name");
  console.log("CLOUDINARY_API_KEY=your_api_key");
  console.log("CLOUDINARY_API_SECRET=your_api_secret");
  process.exit(1);
}

// Test connection by fetching account details
console.log("2. Testing Cloudinary Connection...");

cloudinary.api
  .ping()
  .then((result) => {
    console.log("   ✅ Connection successful!");
    console.log("   Status:", result.status);
    console.log();

    // Test upload with a simple buffer
    console.log("3. Testing Image Upload...");
    
    // Create a simple 1x1 pixel PNG buffer
    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "farm-market/test",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
      stream.end(testImageBuffer);
    });
  })
  .then((uploadResult) => {
    console.log("   ✅ Upload successful!");
    console.log("   URL:", uploadResult.secure_url);
    console.log("   Public ID:", uploadResult.public_id);
    console.log();

    // Clean up test image
    console.log("4. Cleaning up test image...");
    return cloudinary.uploader.destroy(uploadResult.public_id);
  })
  .then(() => {
    console.log("   ✅ Test image deleted");
    console.log();
    console.log("=== All Tests Passed! ===");
    console.log("✅ Cloudinary is properly configured and working");
    console.log("✅ You can now upload profile pictures and listing images");
  })
  .catch((error) => {
    console.error("\n❌ Test Failed!");
    console.error("Error:", error.message);
    
    if (error.http_code === 401) {
      console.error("\n⚠️  Authentication failed - check your API credentials");
    } else if (error.http_code === 404) {
      console.error("\n⚠️  Cloud name not found - check CLOUDINARY_CLOUD_NAME");
    } else {
      console.error("\nFull error:", error);
    }
    
    process.exit(1);
  });
