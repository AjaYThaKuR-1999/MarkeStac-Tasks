require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { logger } = require('./src/utils/logger');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
require('./src/routes/item.routes')(app);

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    ip: req.ip
  });

  return res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection failed', { message: err.message }));


app.listen(process.env.PORT || 5100, () => {
  logger.info(`Inventory service running on port ${process.env.PORT || 3000}`);
}
);


// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down...');
  mongoose.connection.close()
    .then(() => {
      logger.info('MongoDB connection closed');
      io.close();
      process.exit(0);
    })
    .catch(err => {
      logger.error('Error closing MongoDB connection', { error: err.message });
      process.exit(1);
    });
});
