const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imagesDirectory = path.join(__dirname, "../public/images");
fs.mkdirSync(imagesDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imagesDirectory),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);
const fileFilter = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) return cb(null, true);
  const error = new Error("Formato inválido. Envie uma imagem JPEG ou PNG.");
  error.status = 400;
  return cb(error);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
