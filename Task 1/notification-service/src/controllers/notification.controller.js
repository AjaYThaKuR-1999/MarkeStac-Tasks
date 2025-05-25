const Notification = require('../models/notification.model');
const { logger } = require('../utils/logger');

// Api to create notification for stock create or update events 
const createNotification = async (req, res) => {
  try {
    const reqData = req.body;

    const notification = await Notification.create(reqData)

    // Emit to connected clients
    const io = req.app.get('io');
    io.emit('newNotification', notification);

    return res.status(201).json({ status: 201, message: 'Notification created successfully', notification });
  } catch (error) {
    logger.error('Error creating notification:', {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ status: 500, message: error.message });
  }
};


// logger.info('Stock update processed', {
//   notificationId: notification._id,
//   stockUpdateId: stockUpdate._id,
//   itemId,
//   oldQuantity,
//   newQuantity
// });

/* ==================== API's if needed in case =========================*/

// Update a notification
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(id, req.body, { new: true });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.status(200).json({ status: 200, message: 'Notification updated successfully', notification });
  } catch (error) {
    logger.error('Error updating notification:', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
}

// List all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: 200, message: 'Notifications retrieved successfully', notifications });
  } catch (error) {
    logger.error('Error retrieving notifications:', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
}

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ status: 404, message: 'Notification not found' });
    }
    return res.status(200).json({ status: 200, message: 'Notification retrieved successfully', notification });
  }
  catch (error) {
    logger.error('Error retrieving notification:', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
}

// delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ status: 404, message: 'Notification not found' });
    }
    return res.status(200).json({ status: 200, message: 'Notification deleted successfully' });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
}


module.exports = {
  createNotification,
  updateNotification,
  getNotifications,
  getNotificationById,
  deleteNotification  
};