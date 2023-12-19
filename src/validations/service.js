const { check } = require('express-validator');
const validation = require('../middlewares/validate.js');

const addNewServiceValidator = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('اسم الخدمة مطلوب')
    .isString()
    .withMessage('لابد اسم الخدمة ان يتكون من احرف فقط'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('وصف الخدمة مطلوب')
    .isString()
    .withMessage('لابد اسم الخدمة ان يتكون من احرف فقط '),
  check('price')
    .exists()
    .withMessage('سعر الخدمة مطلوب')
    .isNumeric()
    .withMessage('سعر خدمة غير صالح'),
  check('category')
    .trim()
    .notEmpty()
    .withMessage('فئة الخدمة مطلوبة')
    .isString()
    .withMessage('فئة خدمة غير صالحة'),
  check('company')
    .exists()
    .withMessage('اسم الشركة المقدمة للخدمة مطلوب')
    .isMongoId()
    .withMessage('يجب أن تكون الخدمة مملوكة لمستخدم (شركة)'),
  check('images')
    .optional()
    .isArray()
    .custom((value) => {
      if (!value.every((item) => typeof item === 'string')) {
        throw new Error('لابد ان يكون اسم الصور مكون من احرف فقط');
      }
      return true;
    }),
  check('props')
    .optional()
    .isArray()
    .custom((value) => {
      if (!value.every((item) => typeof item === 'string')) {
        throw new Error('لابد اسم الخدمة الاضافية ان يتكون من احرف فقط');
      }
      return true;
    }),
  validation,
];

const getServiceValidator = [
  check('id').isMongoId().withMessage('رقم تعريفى غير صالح'),
  validation,
];

const deleteServiceValidator = [
  check('id').isMongoId().withMessage('رقم تعريفى غير صالح'),
  validation,
];

const updateServiceValidator = [
  check('id').isMongoId().withMessage('رقم تعريفى غير صالح'),
  check('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('اسم الخدمة مطلوب')
    .isString()
    .withMessage('اسم الخدمة لا بد ان يتكون من احرف فقط')
    .trim(),
  check('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('وصف الخدمة مطلوب')
    .isString()
    .withMessage('لابد ان يتكون وصف الخدمة من احرف فقط'),
  check('price').optional().isNumeric().withMessage('سعر غير صالح'),
  check('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('فئة الخدمة مطلوبة')
    .isString()
    .withMessage('فئة خدمة غير صالحة'),
  check('company').optional().isMongoId().withMessage('يجب أن تكون الخدمة مملوكة لمستخدم (شركة)'),
  check('images')
    .optional()
    .isArray()
    .custom((value) => {
      if (!value.every((item) => typeof item === 'string')) {
        throw new Error('لابد ان يكون اسم الصور مكون من احرف فقط');
      }
      return true;
    }),
  check('props')
    .optional()
    .isArray()
    .custom((value) => {
      if (!value.every((item) => typeof item === 'string')) {
        throw new Error('لابد ان تكون الخدمة الاضافية مكونة من احرف فقط');
      }
      return true;
    }),
  validation,
];

module.exports = {
  addNewServiceValidator,
  updateServiceValidator,
  deleteServiceValidator,
  getServiceValidator,
};
