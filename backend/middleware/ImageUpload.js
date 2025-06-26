const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadType = req.body.uploadType; // 'product' or 'user'
        const folder = uploadType === "employee" ? "uploads/employees/" : "uploads/products/";

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