const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const dotenv = require('dotenv');

// Configuration
dotenv.config();

const asyncHandler = require('express-async-handler');
const OrderModel = require('../models/order.js');
const ErrorApi = require('../utils/errorAPI.js');

const getAllOrders = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const orders = await OrderModel.find({})
    .populate({ path: 'user', select: 'full_name -_id' })
    .populate({
      path: 'company',
      select: 'full_name -_id',
    })
    .populate({ path: 'service', select: 'title -_id' })
    .populate({
      path: 'extra_props',
      select: 'description -_id',
    })
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    status: 'success',
    result: orders.length,
    data: {
      orders,
    },
  });
});
const AddOrder = asyncHandler(async (req, res, next) => {
  const newOrder = await OrderModel.create(req.body);
  try {
    // Create a new order
    const orderMail = await OrderModel.findById(newOrder._id)
      .populate({ path: 'user', select: '-password -_id' })
      .populate({
        path: 'company',
        select: '-password -_id',
      })
      .populate({ path: 'service', select: ' -_id' })
      .populate({
        path: 'extra_props',
        select: '-_id',
      });

    const user = orderMail.user;
    const company = orderMail.company;
    const service = orderMail.service;
    const extra_props = orderMail.extra_props;
    const total_price = orderMail.total_price;

    const emailTemplate = await ejs.renderFile(path.join(__dirname, '../utils/baseEmail.ejs'), {
      user,
      service,
      company,
      extra_props,
      total_price,
    });

    // console.log('orderMail: ', orderMail);
    // Configure Nodemailer with Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Compose and send the email
    const info = await transporter.sendMail({
      from: process.env.GMAIL_ACCOUNT, // Sender's Gmail address
      to: user.email, // Recipient's email address
      subject: 'طلبك من عروض اسعار',
      text: `طلب جديد تم استلامه`,
      html: emailTemplate,
    });

    // Compose and send the email
    const info2 = await transporter.sendMail({
      from: process.env.GMAIL_ACCOUNT, // Sender's Gmail address
      to: company.email, // Recipient's email address
      subject: 'طلب جديد من عميل',
      text: `طلب جديد تم استلامه`,
      html: emailTemplate,
    });
  } catch (error) {
    // Handle errors appropriately, e.g., log the error and respond with an error status
    console.error('Error creating order and sending email:', error);
    return res.status(500).json({
      status: 'error',
      message: 'email error',
    });
  }

  // Respond with a success status and the newly created order
  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

const getOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id)
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'company',
      select: '-password',
    })
    .populate('service')
    .populate('extra_props');
  if (order) {
    res.json(order);
  } else {
    return next(new ErrorApi(`لا يوجد طلب بهذا الرقم  ${req.params.id}`, 404));
  }
});

const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndRemove(req.params.id);
  if (!order) {
    return next(new ErrorApi(`لا يوجد طلب بهذا الرقم ${req.params.id}`, 404));
  } else {
    res.json({
      message: 'تم حذف الطلب بنجاح',
    });
  }
});

const updateOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!order) {
    return next(new ErrorApi(`لا يوجد طلب بهذا الرقم  ${req.params.id}`, 404));
  } else {
    res.json(order);
  }
});

const getCompanyOrders = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const orders = await OrderModel.find({ company: req.params.id })
    .populate({ path: 'user', select: '-password -_id' })
    .populate({
      path: 'company',
      select: '-password -_id',
    })
    .populate('service')
    .populate('extra_props')
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    status: 'success',
    result: orders.length,
    data: {
      orders,
    },
  });
});

module.exports = { getAllOrders, getOrder, updateOrder, deleteOrder, getCompanyOrders, AddOrder };
