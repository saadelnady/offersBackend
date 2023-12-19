const { check } = require('express-validator');

const validation = require('../middlewares/validate.js');
const getPropsValidator = [check('id').isMongoId().withMessage('رقم تعريف غير صالح'), validation];

const createPropsValidator = [
  check('price').notEmpty().withMessage('السعر مطلوب'),
  check('description')
    .notEmpty()
    .withMessage('الوصف مطلوب')
    .isLength({ max: 32, min: 3 })
    .withMessage('يجب أن يتراوح طول مدخل الوصف بين 3 و32 حرفًا'),
  validation,
];

const updatePropsValidator = [
  check('id').isMongoId().withMessage('رقم تعريف غير صالح'),
  check('price').notEmpty().withMessage('السعر مطلوب '),
  check('description')
    .notEmpty()
    .withMessage('الوصف مطلوب')
    .isLength({ max: 32, min: 3 })
    .withMessage('يجب أن يتراوح طول مدخل الوصف بين 3 و32 حرفًا'),
  validation,
];

const deletePropsValidator = [
  check('id').isMongoId().withMessage('رقم تعريف غير صالح'),
  validation,
];
module.exports = {
  deletePropsValidator,
  updatePropsValidator,
  createPropsValidator,
  getPropsValidator,
};
