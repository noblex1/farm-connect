import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (!configured) {
    console.log("=== Cloudinary Configuration ===");
    console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET (" + process.env.CLOUDINARY_API_KEY.substring(0, 6) + "...)" : "MISSING");
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING");

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    console.log("✅ Cloudinary configured\n");
    configured = true;
  }
}

// Create a proxy that ensures configuration before any operation
const cloudinaryProxy = new Proxy(cloudinary, {
  get(target, prop) {
    ensureConfigured();
    return target[prop];
  },
});

export default cloudinaryProxy;
