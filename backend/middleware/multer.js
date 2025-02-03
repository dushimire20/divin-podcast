const multer = require("multer");
const path = require("path");

// Set storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

// Initialize upload
const upload = multer({ storage: storage });

module.exports = upload;