import cloudinary from "../config/cloudinary.js";

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
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

    stream.end(buffer);
  });

export const uploadProfileImage = async (file) => {
  console.log("=== uploadProfileImage called ===");
  console.log("File parameter:", file);
  console.log("File type:", typeof file);
  console.log("File is null?", file === null);
  console.log("File is undefined?", file === undefined);
  
  if (!file) {
    console.log("❌ No file provided for upload");
    return "";
  }

  console.log("✅ File exists, checking properties...");
  console.log("Attempting to upload profile image:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    hasBuffer: !!file.buffer,
    bufferLength: file.buffer?.length,
  });

  if (!file.buffer) {
    console.error("❌ File has no buffer!");
    return "";
  }

  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
    console.error("❌ Cloudinary not configured - missing environment variables");
    console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING");
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING");
    return "";
  }

  console.log("✅ Cloudinary configured:", {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
  });

  try {
    console.log("Starting Cloudinary upload...");
    console.log("Buffer size:", file.buffer.length, "bytes");
    const result = await uploadBuffer(file.buffer, "farm-market/profiles");
    console.log("✅ Cloudinary upload successful!");
    console.log("Secure URL:", result.secure_url);
    console.log("Public ID:", result.public_id);
    return result.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary upload error:");
    console.error("  Message:", err.message);
    console.error("  HTTP Code:", err.http_code);
    console.error("  Error:", err.error);
    console.error("  Full error:", JSON.stringify(err, null, 2));
    
    // Return empty string so controller can handle it
    return "";
  }
};

export const uploadListingImages = async (files = []) => {
  if (!files.length) return [];

  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
    return [];
  }

  try {
    const uploads = await Promise.all(files.map((file) => uploadBuffer(file.buffer, "farm-market/listings")));
    return uploads.map((item) => item.secure_url);
  } catch (err) {
    console.error("Cloudinary listing upload error:", err && (err.message || err));
    return [];
  }
};
