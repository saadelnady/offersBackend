const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, 'الاسم بالكامل مطلوب '],
      trim: true,
    },
    username: {
      type: String,
      unique: [true, 'اسم المستخدم مسجل بالفعل'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'البريد الالكتروني مطلوب'],
      unique: [true, 'البريد الالكتروني مسجل بالفعل '],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة '],
    },
    phone_number: {
      type: String,
      trim: true,
    },
    image: {
      type: [String],
      validate: [(array) => array.length >= 0 && array.length <= 1],
    },
    role: {
      type: String,
      enum: ['Admin', 'User', 'Company'],
      default: 'User',
    },
    received_orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    requested_orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    footer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Footer',
    },
    social_links: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      youtube: { type: String },
    },

    join_requests: [],
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
