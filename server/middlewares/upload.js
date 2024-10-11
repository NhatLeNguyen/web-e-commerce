import multer from "multer";
import path from "path";

// Cấu hình lưu trữ file
const storage = multer.memoryStorage();

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 500 },
  fileFilter,
});

export default upload;
