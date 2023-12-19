const { check } = require('express-validator');
const validation = require('../middlewares/validate.js');
const OrderModel = require('../models/order.js');

const getOrderValidator = [check('id').isMongoId().withMessage('رقم تعريفى غير صالح'), validation];

const createOrderValidator = [
  check('user').isMongoId(),
  check('service').isMongoId(),
  check('extra_props').optional().isMongoId(),
  check('total_price')
    .notEmpty()
    .withMessage('اجمالي السعر مطلوب')
    .isNumeric()
    .withMessage('سعر غير صالح'),
  validation,
];

const updateOrderValidator = [
  check('id').isMongoId().withMessage('رقم تعريفى غير صالح'),
  check('user').isMongoId().withMessage('اسم المستخدم مطلوب'),
  validation,
];

const deleteOrderValidator = [
  check('id').isMongoId().withMessage('رقم تعريفى غير صالح'),
  validation,
];

module.exports = {
  updateOrderValidator,
  deleteOrderValidator,
  createOrderValidator,
  getOrderValidator,
};
