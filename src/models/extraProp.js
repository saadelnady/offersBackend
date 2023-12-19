const mongoose = require('mongoose');

const ExtraPropSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: [true, 'السعر مطلوب'],
    },
    description: {
      type: String,
      required: [true, 'الوصف مطلوب'],
    },
  },
  {
    timestamps: true,
  },
);
const ExtraPropModel = mongoose.model('ExtraProp', ExtraPropSchema);
module.exports = ExtraPropModel;
