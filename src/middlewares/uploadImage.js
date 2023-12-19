const multer = require('multer');
const asyncHandler = require('express-async-handler');
const ErrorAPI = require('../utils/errorAPI.js');
const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const uploadMixOfImages = (fieldName, numberOfImgs, path, prefix) => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path);
    },
    filename: function (req, file, cb) {
      const exe = file.mimetype.split('/')[1];
      const fileName = `${prefix}-${Date.now()}.${exe}`;
      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType === 'image') {
      return cb(null, true);
    } else {
      return cb(new ErrorAPI('يجب أن يكون الملف صورة', 400), false);
    }
  };

  const upload = multer({ storage: diskStorage, fileFilter: fileFilter });
  return upload.array(fieldName, numberOfImgs);
};

const deleteImage = (model, fieldName, imgFolder) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.body[fieldName] || req.body[fieldName].length === 0) return next();
    const id = req.params.id;
    const deletedItem = await model.findById(id);
    const imgPathes = deletedItem[fieldName];

    imgPathes.forEach((imagePath, i) => {
      const absoluteImagePath = path.join(__dirname, '..', 'uploads', imgFolder, imagePath);
      if (imagePath === 'profie.jpg') {
        return;
      }
      if (fs.existsSync(absoluteImagePath)) {
        fs.unlinkSync(absoluteImagePath);

        console.log(`Deleted image: ${imagePath}`);
      }
    });
    next();
  });
};

module.exports = {
  uploadMixOfImages,
  deleteImage,
};
