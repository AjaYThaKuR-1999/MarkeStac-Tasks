const notificationController = require('../controllers/notification.controller');

module.exports = function (app) {
  app.post('/api/v1/notifications/create', notificationController.createNotification);
  app.put('/api/v1/notifications/update/:id', notificationController.updateNotification);
  app.get('/api/v1/notifications/getAll', notificationController.getNotifications);
  app.get('/api/v1/notifications/get/:id', notificationController.getNotificationById);
  app.delete('/api/v1/notifications/delete/:id', notificationController.deleteNotification);
}