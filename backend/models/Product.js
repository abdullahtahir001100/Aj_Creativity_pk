const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }, // The full URL for the image
  imageId: { type: String }, // The public_id for images hosted on Cloudinary
});

module.exports = mongoose.model('Product', productSchema);