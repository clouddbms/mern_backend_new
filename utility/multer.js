const multer = require("multer");

const upload = multer({ dest: "./imageUploads" });

module.exports = upload;
