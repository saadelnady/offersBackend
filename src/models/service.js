const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'العنوان مطلوب'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'الوصف مطلوب'],
    },
    price: {
      type: Number,
      required: [true, 'السعر مطلوب'],
    },
    images: {
      type: [String],
      validate: [(array) => array.length >= 0 && array.length <= 4],
    },
    props: [String],
    extra_props: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExtraProp',
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'الفئة مطلوبة'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'يجب أن تكون الخدمة مملوكة لمستخدم (شركة)'],
    },
  },
  {
    timestamps: true,
  },
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
