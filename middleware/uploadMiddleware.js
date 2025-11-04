const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // 🟢 Detect whether it's a food or hotel upload
    let folder = "others";

    if (req.baseUrl.includes("hotels")) folder = "hotels";
    else if (req.baseUrl.includes("foods")) folder = "foodimages";

    const uploadPath = path.join(__dirname, "..", "uploads", folder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb("Images only!");
}

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => checkFileType(file, cb),
});

module.exports = upload;
