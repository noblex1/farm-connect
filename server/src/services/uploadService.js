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
  if (!file) return "";

  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
    // Cloudinary not configured — skip remote upload and return empty string
    return "";
  }

  try {
    const result = await uploadBuffer(file.buffer, "farm-market/profiles");
    return result.secure_url;
  } catch (err) {
    // Log the error and continue — don't fail the whole request for image upload issues
    console.error("Cloudinary upload error:", err && (err.message || err));
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
