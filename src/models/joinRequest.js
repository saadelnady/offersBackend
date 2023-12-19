const mongoose = require('mongoose');

const joinSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, 'الاسم بالكامل مطلوب '],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'البريد الالكتروني مطلوب'],
      unique: [true, 'البريد الالكتروني مسجل بالفعل '],
      trim: true,
    },
    username: {
      type: String,
      unique: [true, 'اسم المستخدم مسجل بالفعل'],
      trim: true,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    image: {
      type: [String],
      validate: [(array) => array.length >= 0 && array.length <= 1],
    },
    social_links: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      youtube: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

const JoinModel = mongoose.model('JoinRequest', joinSchema);

module.exports = JoinModel;
