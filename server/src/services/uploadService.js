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
  const result = await uploadBuffer(file.buffer, "farm-market/profiles");
  return result.secure_url;
};

export const uploadListingImages = async (files = []) => {
  const uploads = await Promise.all(files.map((file) => uploadBuffer(file.buffer, "farm-market/listings")));
  return uploads.map((item) => item.secure_url);
};
