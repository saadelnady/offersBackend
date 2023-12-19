const { Router } = require('express');
const {
  AddOrder,
  deleteOrder,
  getAllOrders,
  getCompanyOrders,
  getOrder,
  updateOrder,
} = require('../controllers/order.js');

const {
  getOrderValidator,
  createOrderValidator,
  updateOrderValidator,
  deleteOrderValidator,
} = require('../validations/orders.js');

const {
  isAllowed,
  isMine,
  verifyToken,
  isTheSameCompany,
  isMyService,
  isOrderAllowed,
} = require('../middlewares/auth.js');

const router = Router();
router
  .route('/')
  .get(verifyToken, getAllOrders)
  .post(verifyToken, isAllowed('User'), createOrderValidator, AddOrder);

router
  .route('/:id')
  .get(verifyToken, isOrderAllowed, getOrderValidator, getOrder)
  .delete(verifyToken, isOrderAllowed, deleteOrderValidator, deleteOrder)
  .patch(verifyToken, isOrderAllowed, updateOrderValidator, updateOrder);

router
  .route('/company/:id')
  .get(verifyToken, isAllowed('Company', 'Admin'), isMine, getCompanyOrders);

module.exports = router;
