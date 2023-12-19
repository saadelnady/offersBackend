const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ErrorApi = require('../utils/errorAPI.js');
const Service = require('../models/service.js');
const OrderModel = require('../models/order.js');

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers['token'];
  if (!token) {
    return next(new ErrorApi(`يجب عليك تسجيل الدخول أولا `, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.currentUser = decoded;
  } catch (err) {
    return next(new ErrorApi(`رمز غير صالح`, 401));
  }
  return next();
});

const isAllowed =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.currentUser.role)) {
      next();
    } else return next(new ErrorApi('ليس لك صلاحية للدخول لهذه الصفحة '));
  };

const isMine = asyncHandler(async (req, res, next) => {
  if (req.currentUser.role === 'Admin') next();
  else if (req.params.id === req.currentUser.id) return next();
  else return next(new ErrorApi('ليس لك صلاحية للدخول لهذه الصفحة '));
});

const isTheSameCompany = asyncHandler(async (req, res, next) => {
  if (req.currentUser.role === 'Admin') return next();
  else if (req.body.company === req.currentUser.id) return next();
  else return next(new ErrorApi('ليس لك صلاحية للدخول لهذه الصفحة '));
});
const isMyService = asyncHandler(async (req, res, next) => {
  if (req.currentUser.role === 'Admin') return next();

  const service = await Service.findById(req.params.id);
  const companyId = service.company;

  if (companyId.toString() === req.currentUser.id) return next();
  else return next(new ErrorApi('ليس لك صلاحية للدخول لهذه الصفحة '));
});

const isOrderAllowed = asyncHandler(async (req, res, next) => {
  if (req.currentUser.role === 'Admin') return next();
  const order = await OrderModel.findById(req.params.id);
  const userId = order.user;
  const companyId = order.company;

  if (req.currentUser.id === userId.toString() || req.currentUser.id === companyId.toString()) {
    return next();
  } else return next(new ErrorApi('ليس لك صلاحية للدخول لهذه الصفحة '));
});

module.exports = {
  isAllowed,
  isMine,
  isMyService,
  isTheSameCompany,
  isOrderAllowed,
  verifyToken,
};
