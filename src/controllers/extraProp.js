const asyncHandler = require('express-async-handler');
const ExtraPropModel = require('../models/extraProp.js');
const ErrorApi = require('../utils/errorAPI.js');

const getAllExtraProps = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const extraProps = await ExtraPropModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    status: 'success',
    result: extraProps.length,
    data: {
      extraProps,
    },
  });
});

const AddExtraProp = asyncHandler(async (req, res) => {
  //create ExtraProp
  const newExtraProp = await ExtraPropModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      extraProp: newExtraProp,
    },
  });
});
const AddManyExtraProp = asyncHandler(async (req, res) => {
  //create ExtraProp
  const newExtraProps = await ExtraPropModel.insertMany(req.body.data);
  res.status(201).json({
    status: 'success',
    data: {
      extraProps: newExtraProps,
    },
  });
});

const getExtraProp = asyncHandler(async (req, res, next) => {
  const extraProp = await ExtraPropModel.findById(req.params.id);
  if (extraProp) {
    res.json(extraProp);
  } else {
    return next(new ErrorApi(`خدمة اضافية غير موجودة  ${req.params.id}`, 404));
  }
});

const deleteExtraProp = asyncHandler(async (req, res, next) => {
  const extraProp = await ExtraPropModel.findByIdAndRemove(req.params.id);
  if (!extraProp) {
    return next(new ErrorApi(`خدمة اضافية غير موجودة ${req.params.id}`, 404));
  } else {
    res.json({
      message: 'تم حذف الخدمة الاضافية بنجاح',
    });
  }
});

const updateExtraProp = asyncHandler(async (req, res, next) => {
  const extraProp = await ExtraPropModel.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!extraProp) {
    return next(new ErrorApi(`خدمة اضافية غير موجودة ${req.params.id}`, 404));
  } else {
    res.json(extraProp);
  }
});
module.exports = {
  getAllExtraProps,
  getExtraProp,
  AddExtraProp,
  AddManyExtraProp,
  updateExtraProp,
  deleteExtraProp,
};
