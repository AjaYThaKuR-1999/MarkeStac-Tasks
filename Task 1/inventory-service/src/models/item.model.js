const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
},
  { timestamps: true, versionKey: false }
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
