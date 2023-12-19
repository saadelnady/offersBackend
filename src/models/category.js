const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'اسم الفئه موجود بالفعل '],
      required: [true, 'اسم الفئة مطلوب'],
    },
  },
  {
    timestamps: true,
  },
);
const CategoryModel = mongoose.model('Category', CategorySchema);
module.exports = CategoryModel;
