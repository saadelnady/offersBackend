const asyncHandler = require('express-async-handler');
const CategoryModel = require('../models/category.js');
const ErrorApi = require('../utils/errorAPI.js');

const getAllCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    status: 'success',
    result: categories.length,
    data: {
      categories,
    },
  });
});

const AddCategory = asyncHandler(async (req, res) => {
  //create category
  const newCategory = await CategoryModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

const getCategory = asyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    return next(new ErrorApi(` فئة غير موجودة ${req.params.id}`, 404));
  }
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findByIdAndRemove(req.params.id);
  if (!category) {
    return next(new ErrorApi(`فئة غير موجودة ${req.params.id}`, 404));
  } else {
    res.json({
      message: 'تم حذف الفئة بنجاح',
    });
  }
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!category) {
    return next(new ErrorApi(`فئة غير موجودة ${req.params.id}`, 404));
  } else {
    res.json(category);
  }
});
module.exports = { getAllCategories, getCategory, AddCategory, deleteCategory, updateCategory };
