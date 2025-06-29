const multer = require('multer');
const fs = require('fs'); // 👈 Don't forget this!
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadType = req.body.uploadType; 
        const folder = uploadType === "employee" ? "uploads/employees/" : "uploads/products/";

        console.log("🧾 DESTINATION FOLDER:", folder); // log for debugging

    // Ensure folder exists
    try {
        fs.mkdirSync(folder, { recursive: true });
    } catch (err) {
        console.error("❌ Failed to create folder:", err);
    }


        // Ensure the folder exists
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// File Filter (ensures only image files are accepted)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

module.exports = {
    storage,
    fileFilter
}