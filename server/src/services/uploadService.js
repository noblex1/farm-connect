import cloudinary from "../config/cloudinary.js";

const uploadBuffer = (buffer, folder, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "auto", // Let Cloudinary auto-detect the resource type
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary stream error:", error);
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    // Write the buffer to the stream
    stream.write(buffer);
    stream.end();
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

  // Validate buffer is not empty
  if (file.buffer.length === 0) {
    console.error("❌ File buffer is empty!");
    return "";
  }

  // Validate mimetype
  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    console.error("❌ Invalid mimetype:", file.mimetype);
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
    console.log("Buffer first 20 bytes:", file.buffer.slice(0, 20).toString("hex"));
    
    // Upload with format hint from mimetype
    const format = file.mimetype.split("/")[1];
    const result = await uploadBuffer(file.buffer, "farm-market/profiles", {
      format: format,
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" },
      ],
    });
    
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
    console.error("❌ Cloudinary not configured for listing images");
    return [];
  }

  try {
    const uploads = await Promise.all(
      files.map((file) => {
        const format = file.mimetype.split("/")[1];
        return uploadBuffer(file.buffer, "farm-market/listings", {
          format: format,
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto" },
          ],
        });
      })
    );
    return uploads.map((item) => item.secure_url);
  } catch (err) {
    console.error("❌ Cloudinary listing upload error:");
    console.error("  Message:", err.message);
    console.error("  Full error:", err);
    return [];
  }
};
