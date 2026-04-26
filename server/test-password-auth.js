import bcrypt from "bcryptjs";

/**
 * Quick test to verify bcrypt password hashing works correctly
 * 
 * Usage: node server/test-password-auth.js
 */

async function testPasswordAuth() {
  console.log("🔐 Testing Password Authentication\n");
  console.log("=".repeat(60));

  const testPassword = "MySecurePassword123!";
  console.log(`\n1️⃣  Original Password: ${testPassword}`);

  // Hash the password
  console.log("\n2️⃣  Hashing password...");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testPassword, salt);
  console.log(`   Hashed Password: ${hashedPassword}`);
  console.log(`   Length: ${hashedPassword.length} characters`);

  // Test correct password
  console.log("\n3️⃣  Testing correct password...");
  const isCorrect = await bcrypt.compare(testPassword, hashedPassword);
  console.log(`   Result: ${isCorrect ? "✅ PASS" : "❌ FAIL"}`);

  // Test wrong password
  console.log("\n4️⃣  Testing wrong password...");
  const isWrong = await bcrypt.compare("WrongPassword", hashedPassword);
  console.log(`   Result: ${isWrong ? "❌ FAIL (should be false)" : "✅ PASS (correctly rejected)"}`);

  // Test case sensitivity
  console.log("\n5️⃣  Testing case sensitivity...");
  const isCaseSensitive = await bcrypt.compare("mysecurepassword123!", hashedPassword);
  console.log(`   Result: ${isCaseSensitive ? "❌ FAIL (should be case-sensitive)" : "✅ PASS (correctly case-sensitive)"}`);

  console.log("\n" + "=".repeat(60));
  console.log("✅ Password authentication test complete!");
  console.log("=".repeat(60));
}

testPasswordAuth().catch(console.error);
