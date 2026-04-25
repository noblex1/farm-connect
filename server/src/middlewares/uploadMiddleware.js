import multer from "multer";

const storage = multer.memoryStorage();

const imageFileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter: imageFileFilter,
});
