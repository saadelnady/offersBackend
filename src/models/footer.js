const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  social_links: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    youtube: { type: String },
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
const FooterModel = mongoose.model('Footer', footerSchema);

module.exports = FooterModel;
