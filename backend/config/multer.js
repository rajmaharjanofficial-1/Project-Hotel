import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    // Generates a unique filename by prefixing the current timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage: storage });