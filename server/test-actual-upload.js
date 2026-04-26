import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a test PNG file (1x1 red pixel)
const createTestPNG = () => {
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
    0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb4, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
};

async function testUpload() {
  console.log("=== Testing Profile Picture Upload ===\n");

  // First, login to get a token
  console.log("1. Logging in...");
  const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailOrPhone: "sharifiddrisu156@gmail.com",
      password: "your-password-here", // UPDATE THIS
    }),
  });

  if (!loginResponse.ok) {
    console.error("❌ Login failed:", await loginResponse.text());
    return;
  }

  const loginData = await loginResponse.json();
  const token = loginData.token;
  console.log("✅ Login successful");
  console.log("Token:", token.substring(0, 20) + "...\n");

  // Create test image
  console.log("2. Creating test PNG image...");
  const imageBuffer = createTestPNG();
  console.log("✅ Test PNG created:", imageBuffer.length, "bytes");
  console.log("First 20 bytes:", imageBuffer.slice(0, 20).toString("hex"), "\n");

  // Upload profile picture
  console.log("3. Uploading profile picture...");
  const formData = new FormData();
  formData.append("name", "Test User");
  formData.append("location", "Test Location");
  formData.append("email", "sharifiddrisu156@gmail.com");
  formData.append("whatsappNumber", "0206558156");
  formData.append("profilePicture", imageBuffer, {
    filename: "test.png",
    contentType: "image/png",
  });

  const uploadResponse = await fetch("http://localhost:5000/api/auth/me", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  console.log("Response status:", uploadResponse.status);
  console.log("Response headers:", Object.fromEntries(uploadResponse.headers.entries()));

  const responseText = await uploadResponse.text();
  console.log("Response body:", responseText);

  if (uploadResponse.ok) {
    console.log("\n✅ Upload successful!");
    const data = JSON.parse(responseText);
    console.log("Profile picture URL:", data.user.profilePicture);
  } else {
    console.log("\n❌ Upload failed!");
  }
}

testUpload().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
