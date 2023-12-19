const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const ErrorApi = require('../utils/errorAPI.js');
const UserModel = require('../models/user.js');
const { uploadMixOfImages } = require('../middlewares/uploadImage.js');

const uploadUserImage = uploadMixOfImages('image', 1, 'uploads/user', 'user');

const saveImgInDB = (req, res, next) => {
  console.log('req: ', req.body);
  const uploadedFiles = req.files;
  if (uploadedFiles && uploadedFiles.length > 0) {
    req.body.image = uploadedFiles.map((file) => file.filename);
  } else {
    // If no images were uploaded, assign a default image filename to req.body.images
    req.body.image = ['profie.jpg'];
  }
  next();
};

const updateSaveImgInDB = (req, res, next) => {
  const uploadedFiles = req.files;

  if (uploadedFiles && uploadedFiles.length > 0) {
    req.body.image = uploadedFiles.map((file) => file.filename);
  }
  next();
};

const getAllUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const users = await UserModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

const addUser = asyncHandler(async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 8);
  const userObject = {
    ...req.body,
    password: hashedPassword,
    role: 'Company',
  };

  const newUser = await UserModel.create(userObject);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id)
    .populate('received_orders')
    .populate('requested_orders')
    .populate('services');
  if (user) {
    res.json({
      status: 'success',
      data: {
        user: { ...user._doc, password: null },
      },
    });
  } else {
    return next(new ErrorApi(`لا يوجد مستخدم مسجل ${req.params.id}`, 404));
  }
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndRemove(req.params.id);
  if (!user) {
    return next(new ErrorApi(`لا يوجد مستخدم مسجل   ${req.params.id}`, 404));
  } else {
    res.json({
      message: 'تم حذف المستخدم بنجاح',
    });
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  // const hashedPassword = await bcrypt.hash(req.body.password, 8);
  // const userObject = {
  //   ...req.body,
  //   password: hashedPassword,
  // };

  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!user) {
    return next(new ErrorApi(`لا يوجد مستخدم مسجل  ${req.params.id}`, 404));
  } else {
    res.json(user);
  }
});

const getCompany = asyncHandler(async (req, res, next) => {
  const company = await UserModel.find({
    _id: req.params.id,
    role: { $in: ['Admin', 'Company'] },
  }).populate('services');

  if (company) {
    res.json({
      status: 'success',
      data: {
        company: { ...company[0]._doc, password: null },
      },
    });
  } else {
    return next(new ErrorApi(`لا يوجد شركة مسجل ${req.params.id}`, 404));
  }
});

module.exports = {
  addUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  uploadUserImage,
  saveImgInDB,
  updateSaveImgInDB,
  getCompany,
};
