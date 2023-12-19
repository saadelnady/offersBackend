const { check } = require('express-validator');
const validation = require('../middlewares/validate.js');

const getCategoryValidator = [
  check('id').isMongoId().withMessage('رقم تعريف غير صالح'),
  validation,
];

const createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('اسم الفئة مطلوب')
    .isLength({ max: 32, min: 3 })
    .withMessage('يجب أن يتراوح طول اسم الفئة من 3 إلى 32 حرفًا'),
  check('service').isMongoId(),
  validation,
];

const updateCategoryValidator = [
  check('id').isMongoId().withMessage('رقم تعريف غير صالح'),
  check('name')
    .notEmpty()
    .withMessage('اسم الفئة مطلوب')
    .isLength({ max: 32, min: 3 })
    .withMessage('يجب أن يتراوح طول اسم الفئة من 3 إلى 32 حرفًا'),
  check('service').isMongoId().withMessage('Service ID is required'),
  validation,
];

const deleteCategoryValidator = [
  check('id').isMongoId().withMessage('رقم تعريف غير صالح'),
  validation,
];
module.exports = {
  deleteCategoryValidator,
  updateCategoryValidator,
  createCategoryValidator,
  getCategoryValidator,
};
