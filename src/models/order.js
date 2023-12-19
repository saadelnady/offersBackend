const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'يجب أن ينتمي الطلب إلى مستخدم (مستخدم)'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'يجب أن ينتمي الطلب إلى مستخدم (شركة)'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'يجب أن يحتوي الطلب على خدمة واحدة'],
    },
    extra_props: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExtraProp',
      },
    ],
    total_price: {
      type: Number,
      required: [true, 'السعر النهائي مطلوب'],
    },
  },
  {
    timestamps: true,
  },
);

OrderSchema.index(
  {
    user: 1,
    service: 1,
  },
  {
    unique: true,
  },
);

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
