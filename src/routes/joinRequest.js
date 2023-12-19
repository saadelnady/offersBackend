const express = require('express');
const {
  getAllRequests,
  addRequest,
  getRequest,
  deleteRequest,
  updateRequest,
  uploadUserImage,
  saveImgInDB,
  addUserToDb,
} = require('../controllers/joinRequest.js');
const { isAllowed, verifyToken } = require('../middlewares/auth.js');
const {
  addRequestValidator,
  getRequestValidator,
  deleteRequestValidator,
  updateRequestValidator,
} = require('../validations/joinRequest.js');
const router = express.Router();
router
  .route('/')
  .get(verifyToken, isAllowed('Admin'), getAllRequests)
  .post(uploadUserImage, saveImgInDB, addRequestValidator, addRequest);

router
  .route('/:id')
  .get(verifyToken, isAllowed('Admin'), getRequestValidator, getRequest)
  .delete(verifyToken, isAllowed('Admin'), deleteRequestValidator, deleteRequest)
  .patch(verifyToken, isAllowed('Admin'), updateRequestValidator, updateRequest)
  .post(verifyToken, isAllowed('Admin'), addUserToDb);

module.exports = router;
