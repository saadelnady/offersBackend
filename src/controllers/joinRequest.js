const asyncHandler = require('express-async-handler');
const ErrorApi = require('../utils/errorAPI.js');
const JoinModel = require('../models/joinRequest.js');
const { uploadMixOfImages } = require('../middlewares/uploadImage.js');
const UserModel = require('../models/user.js');
const bcrypt = require('bcryptjs');

const uploadUserImage = uploadMixOfImages('image', 1, 'uploads/user', 'user');

const saveImgInDB = (req, res, next) => {
  const uploadedFiles = req.files;
  if (uploadedFiles && uploadedFiles.length > 0) {
    req.body.image = uploadedFiles.map((file) => file.filename);
  } else {
    // If no images were uploaded, assign a default image filename to req.body.images
    req.body.image = ['profie.jpg'];
  }
  next();
};

const getAllRequests = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const joinRequests = await JoinModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    status: 'success',
    result: joinRequests.length,
    data: {
      joinRequests,
    },
  });
});

const addRequest = asyncHandler(async (req, res, next) => {
  const RequestObject = {
    ...req.body,
  };
  const { email, username } = RequestObject;
  const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(new Error('اسم المستخدم او البريد الإلكتروني مسجل بالفعل', 404));
  } else {
    const newRequest = await JoinModel.create(RequestObject);
    res.status(201).json({
      status: 'success',
      data: {
        joinRequest: newRequest,
      },
    });
  }
});

const getRequest = asyncHandler(async (req, res, next) => {
  const joinRequest = await JoinModel.findById(req.params.id);
  if (joinRequest) {
    res.json(joinRequest);
  } else {
    return next(new ErrorApi(`لا يوجد طلب انضمام مسجل${req.params.id}`, 404));
  }
});

const deleteRequest = asyncHandler(async (req, res, next) => {
  const joinRequest = await JoinModel.findByIdAndRemove(req.params.id);
  if (!joinRequest) {
    return next(new ErrorApi(`لا يوجد طلب انضمام مسجل  ${req.params.id}`, 404));
  } else {
    res.json({
      message: 'تم رفض الطلب بنجاح',
    });
  }
});

const updateRequest = asyncHandler(async (req, res, next) => {
  const joinRequest = await JoinModel.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!joinRequest) {
    return next(new ErrorApi(`لا يوجد طلب انضمام مسجل  ${req.params.id}`, 404));
  } else {
    res.json(joinRequest);
  }
});

const addUserToDb = asyncHandler(async (req, res) => {
  const userData = await JoinModel.findByIdAndRemove(req.params['id']);
  const hashedPass = await bcrypt.hash('12345678Uu', 8);

  let newUser = await UserModel.create({ ...userData._doc, password: hashedPass, role: 'Company' });
  res.json({
    message: 'success',
  });
});

module.exports = {
  addRequest,
  getRequest,
  getAllRequests,
  updateRequest,
  deleteRequest,
  uploadUserImage,
  saveImgInDB,
  addUserToDb,
};
