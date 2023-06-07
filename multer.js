const multer = require('multer');

// define Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // set upload destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // set uploaded file name
    }
});

// create Multer instance
const upload = multer({ storage: storage });

module.exports = upload;