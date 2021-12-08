const path = require("path");
const fs = require("fs");
const multer = require("multer");
const timestamp = require("time-stamp");

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let storagePath = path.join(__basedir, "public/tmp");
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
        }
        cb(null, storagePath);
    },
    filename: function (req, file, cb) {
        let fileName = timestamp('YYYYMMDDHHmmss') + "-" + file.originalname;
        cb(null, fileName);
    }
})
// Filter 
const imageFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb("Upload an Image file (.jpeg, .jpg, .png)", false);
    }
}

// maximum size 2 mb
const maxSize = 2 * 1024 * 1024

const uploadImage = multer({ storage: storage, fileFilter: imageFilter, limits: { fileSize: maxSize } });

module.exports = { uploadImage }