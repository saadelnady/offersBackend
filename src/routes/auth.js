const { Router } = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  uploadUserImage,
  saveImgInDB,
} = require('../controllers/auth.js');
const { addUserValidator, loginUserValidator } = require('../validations/user.js');
const { verifyToken } = require('../middlewares/auth.js');
const cookieParser = require('cookie-parser');

const router = Router();

router.use(cookieParser());

router.route('/register').post(uploadUserImage, saveImgInDB, addUserValidator, registerUser);
router.route('/login').post(loginUserValidator, loginUser);
router.route('/logout').post(verifyToken, logoutUser);

module.exports = router;
