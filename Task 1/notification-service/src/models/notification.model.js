const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  itemId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['stock_update', 'item_created'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
},
  { timestamps: true, versionKey: false }
);

// Index for performance
notificationSchema.index({ itemId: 1, type: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;