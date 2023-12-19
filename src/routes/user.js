const express = require('express');
const {
  getAllUsers,
  addUser,
  getUser,
  deleteUser,
  updateUser,
  uploadUserImage,
  saveImgInDB,
  updateSaveImgInDB,
} = require('../controllers/user.js');
const {
  addUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
} = require('../validations/user.js');
const { isAllowed, isMine, verifyToken } = require('../middlewares/auth.js');
const { removeUsernameAndEmail } = require('../middlewares/handlePatchRequest.js');
const { deleteImage } = require('../middlewares/uploadImage.js');
const UserModel = require('../models/user.js');

const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(verifyToken, isAllowed('Admin'), uploadUserImage, saveImgInDB, addUserValidator, addUser);

router
  .route('/:id')
  .get(verifyToken, getUserValidator, isMine, getUser)
  .delete(
    verifyToken,
    deleteUserValidator,
    isMine,
    deleteImage(UserModel, 'image', 'user'),
    deleteUser,
  )
  .patch(
    verifyToken,
    uploadUserImage,
    updateSaveImgInDB,
    removeUsernameAndEmail,
    updateUserValidator,
    isMine,
    deleteImage(UserModel, 'image', 'user'),
    updateUser,
  );

module.exports = router;
