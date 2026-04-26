import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { uploadProfileImage } from "./src/services/uploadService.js";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/test-upload", upload.single("image"), async (req, res) => {
  console.log("=== Test Upload Endpoint ===");
  console.log("Has file:", !!req.file);
  
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  console.log("File details:", {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    hasBuffer: !!req.file.buffer,
    bufferLength: req.file.buffer?.length,
  });
  
  try {
    const url = await uploadProfileImage(req.file);
    console.log("Upload result:", url);
    
    if (!url) {
      return res.status(500).json({ error: "Upload failed - no URL returned" });
    }
    
    res.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test upload server running on http://localhost:${PORT}`);
  console.log(`Test with: curl -F "image=@/path/to/image.jpg" http://localhost:${PORT}/test-upload`);
});
