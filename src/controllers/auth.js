const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/user.js');
const ErrorApi = require('../utils/errorAPI.js');
const { uploadMixOfImages } = require('../middlewares/uploadImage.js');

const oneDay = 1000 * 60 * 60 * 24;
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
const registerUser = asyncHandler(async (req, res, next) => {
  const { full_name, email, password, username, phone_number, image } = req.body;

  const hashedPassword = await bcrypt.hash(password, 8);

  const user = await UserModel.create({
    full_name,
    email: email.toLowerCase(),
    password: hashedPassword,
    username,
    phone_number,
    image,
  });
  const token = jwt.sign(
    {
      id: user._id,
      full_name: user.full_name,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    process.env.TOKEN_KEY,
  );

  res
    .cookie('jwt', token, {
      httpOnly: true,
      maxAge: oneDay,
    })
    .status(201)
    .json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          username: user.username,
          role: user.role,
          image: user.image,
        },
        token,
      },
    });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!email && !username) {
    return next(new ErrorApi(` البريد الإلكتروني و اسم المستخدم مطلوب`, 400));
  }

  const match = email ? { email: email.toLowerCase() } : { username };

  const user = await UserModel.findOne(match);
  if (user.role === 'Admin' && user.password === password) {
    const token = jwt.sign(
      {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '3h',
      },
    );
    res
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: oneDay,
      })
      .status(201)
      .json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            username: user.username,
            role: user.role,
            image: user.image,
          },
          token,
        },
      });
  } else if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.TOKEN_KEY,
    );

    res
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: oneDay,
      })
      .status(201)
      .json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            username: user.username,
            role: user.role,
            image: user.image,
          },
          token,
        },
      });
  } else {
    return next(new ErrorApi(`اسم المستخدم او كلمة المرور غير صحيح`, 400));
  }
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', { maxAge: '1' });
});

module.exports = { registerUser, loginUser, logoutUser, uploadUserImage, saveImgInDB };
