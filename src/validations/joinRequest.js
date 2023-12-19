const { check } = require('express-validator');
const validation = require('../middlewares/validate.js');
const JoinModel = require('../models/joinRequest.js');

const addRequestValidator = [
  check('full_name')
    .trim()
    .notEmpty()
    .withMessage('الاسم الكامل مطلوب')
    .isString()
    .withMessage('الاسم لا بد ان يتكون من احرف فقط'),
  check('username')
    .trim()
    .notEmpty()
    .withMessage('اسم السمتخدم مطلوب')
    .isString()
    .withMessage('لابد ان يتكون اسم المستخدم متكون من احرف فقط')
    .custom((value) => {
      return JoinModel.find({ username: value }).then((username) => {
        if (username.length > 0) {
          throw 'اسم السمتخدم مسجل بالفعل';
        }
      });
    }),
  check('email')
    .notEmpty()
    .withMessage('البريد الالكترونى مطلوب')
    .isEmail()
    .withMessage('بريد الكترونى غير صالح')
    .normalizeEmail()
    .custom((value) => {
      return JoinModel.find({ email: value }).then((mail) => {
        if (mail.length > 0) {
          throw 'البريد الالكترونى مسجل بالفعل';
        }
      });
    }),
  check('phone_number').optional().isMobilePhone().withMessage('رقم هاتف غير صالح'),
  check('image')
    .optional()
    .isArray()
    .custom((value) => {
      if (!value.every((item) => typeof item === 'string')) {
        throw new Error('لابد ان يكون اسم الصور مكون من احرف فقط');
      }
      return true;
    }),
  check('social_links').optional().isString().withMessage('رابط غير صالح'),
  validation,
];

const getRequestValidator = [check('id').isMongoId().withMessage('رقم طلب غير صالح'), validation];

const deleteRequestValidator = [
  check('id').isMongoId().withMessage('رقم طلب غير صالح'),
  validation,
];

const updateRequestValidator = [
  check('id').isMongoId().withMessage('رقم طلب غير صالح'),
  check('full_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('الاسم الكامل مطلوب')
    .isString()
    .withMessage('لابد ان يتكون الاسم من حروف فقط'),
  check('username')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('اسم المستخدم مطلوب')
    .isString()
    .withMessage('لابد ان اسم المستخدم ان يتكون من احرف فقط')
    .custom((value) => {
      return JoinModel.find({ full: value }).then((username) => {
        if (username.length > 0) {
          throw 'اسم المستخدم مسجل بالفعل';
        }
      });
    }),
  check('email')
    .optional()
    .notEmpty()
    .withMessage('البريد الالكترونى مسجل بالفعل ')
    .isEmail()
    .withMessage('بريد الكترونى غير صالح')
    .normalizeEmail()
    .custom((value) => {
      return JoinModel.find({ email: value }).then((mail) => {
        if (mail.length > 0) {
          throw 'البريد الالكترونى مسجل بالفعل';
        }
      });
    }),
  check('phone_number').optional().isMobilePhone().withMessage('رقم هاتف غير صالح'),
  check('image')
    .optional()
    .isArray()
    .custom((value) => {
      if (!value.every((item) => typeof item === 'string')) {
        throw new Error('لابد ان يكون اسم الصور مكون من احرف فقط');
      }
      return true;
    }),
  check('social_links').optional().isString().withMessage('رابط غير صالح'),
  validation,
];
module.exports = {
  addRequestValidator,
  updateRequestValidator,
  deleteRequestValidator,
  getRequestValidator,
};
