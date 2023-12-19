const express = require('express');
const multer = require('multer');
const ErrorAPI = require('../utils/errorAPI.js');
const router = express.Router();

const {
  addNewService,
  getAllServices,
  getService,
  updateService,
  deleteService,
  getCompanyServices,
  uploadSeriveImg,
  saveImgInDB,
} = require('../controllers/services.js');
const {
  addNewServiceValidator,
  getServiceValidator,
  deleteServiceValidator,
  updateServiceValidator,
} = require('../validations/service.js');
const {
  isAllowed,
  isMine,
  verifyToken,
  isTheSameCompany,
  isMyService,
  isOrderAllowed,
} = require('../middlewares/auth.js');
const Service = require('../models/service.js');
const { deleteImage } = require('../middlewares/uploadImage.js');
const { deleteExtraProps } = require('../middlewares/handlePatchRequest.js');

router
  .route('/')
  .post(
    verifyToken,
    isAllowed('Company', 'Admin'),
    uploadSeriveImg,
    saveImgInDB,
    addNewServiceValidator,
    isTheSameCompany,
    addNewService,
  )
  .get(getAllServices);
router
  .route('/:id')
  .get(getServiceValidator, getService)
  .patch(
    verifyToken,
    uploadSeriveImg,
    saveImgInDB,
    updateServiceValidator,
    isMyService,
    deleteExtraProps,
    deleteImage(Service, 'images', 'service'),
    updateService,
  )
  .delete(
    verifyToken,
    deleteServiceValidator,
    isMyService,
    deleteImage(Service, 'images', 'service'),
    deleteService,
  );

router.route('/company/:id').get(getCompanyServices);
module.exports = router;
