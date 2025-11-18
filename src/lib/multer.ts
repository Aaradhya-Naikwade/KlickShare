import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/groups");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

// File filter
function fileFilter(req: any, file: any, cb: any) {
  const types = ["image/png", "image/jpeg", "image/jpg"];
  if (types.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only png, jpg allowed!"), false);
}

// Max size: 20MB
export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});
