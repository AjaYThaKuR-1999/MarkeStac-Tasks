const Item = require('../models/item.model');
const { logger } = require('../utils/logger');
const validateItem = require('../utils/validation');
const axios = require('axios');

// Create a new inventory item
const createItem = async (req, res) => {
  try {
    const reqData = req.body;

    const validation = validateItem('create', reqData);
    if (!validation.isValid) {
      logger.error(`Validation failed on createItem: ${validation.error.message}`);
      return res.status(400).json(validation.error);
    }

    const result = await Item.create(reqData);

    try {
      await axios.post('http://localhost:5101/api/v1/notifications/create', {
        itemId: result._id,
        type: 'item_created',
        message: `New item created: ${result.name}`,
        metadata: {
          name: result.name,
          quantity: result.quantity,
          price: result.price
        }
      });

      logger.info(`Notification sent for item creation: ${result._id}`);
    } catch (notifyErr) {
      logger.error(`Failed to notify for item creation: ${notifyErr.message}`, {
        itemId: result._id
      });
    }

    logger.info(`Item created: ${result.name}`, {
      itemId: result._id,
      quantity: result.quantity,
      price: result.price
    });

    return res.status(201).json({ status: 201, message: "Item created successfully", result });

  } catch (error) {
    logger.error(`createItem error → ${error.message}`);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

// Update an inventory item by ID
const updateItem = async (req, res) => {
  try {
    const reqData = req.body;

    const validation = validateItem('update', reqData);
    if (!validation.isValid) {
      logger.error(`Validation failed on updateItem: ${validation.error.message}`);
      return res.status(400).json(validation.error);
    }

    const oldItem = await Item.findById(req.params.id);
    if (!oldItem) {
      logger.warn(`Item not found for update: ${req.params.id}`);
      return res.status(404).json({ status: 404, error: 'Item not found' });
    }

    delete reqData.name // Prevent name change

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, reqData, { new: true });

    logger.info(`Item updated: ${updatedItem.name}`, {
      itemId: updatedItem._id,
      changes: req.body
    });

    const changes = [];
    if (oldItem.quantity !== updatedItem.quantity) {
      changes.push(`quantity: ${oldItem.quantity} → ${updatedItem.quantity}`);
    }
    if (oldItem.price !== updatedItem.price) {
      changes.push(`price: ${oldItem.price} → ${updatedItem.price}`);
    }

    // Send notification only if there are actual changes
    if (changes.length > 0) {
      const message = `Item ${updatedItem.name} updated (${changes.join(', ')})`;

      await axios.post('http://localhost:5101/api/v1/notifications/create', {
        itemId: updatedItem._id,
        type: 'stock_update',
        message,
        metadata: {
          item: updatedItem.name,
          oldQuantity: oldItem.quantity,
          newQuantity: updatedItem.quantity,
          oldPrice: oldItem.price,
          newPrice: updatedItem.price
        }
      });
    }

    return res.status(200).json({ status: 200, message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    logger.error(`updateItem error → ${error.message}`);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

// Get all inventory items with pagination and search
const getAllItems = async (req, res) => {
  try {
    let { page = 1, limit = 2, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const items = await Item.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

    const total = await Item.countDocuments(query);

    logger.info(`Items fetched`, {
      totalItems: total,
      count: items.length,
      page,
      limit
    });

    return res.status(200).json({
      status: 200,
      message: "Items list fetched successfully",
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total
    });
  } catch (error) {
    logger.error(`getAllItems error → ${error.message}`);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

// Get a single inventory item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      logger.warn(`Item not found by ID: ${req.params.id}`);
      return res.status(404).json({ status: 404, error: 'Item not found' });
    }

    logger.info(`Item fetched: ${item.name}`, {
      itemId: item._id
    });

    return res.status(200).json({ status: 200, message: "Item details fetched successfully", item });
  } catch (error) {
    logger.error(`getItemById error → ${error.message}`);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

// Delete an inventory item by ID
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      logger.warn(`Item not found for deletion: ${req.params.id}`);
      return res.status(404).json({ status: 404, error: 'Item not found' });
    }

    logger.info(`Item deleted: ${item.name}`, {
      itemId: req.params.id
    });

    return res.status(200).json({ status: 200, message: "Item deleted successfully" });
  } catch (error) {
    logger.error(`deleteItem error → ${error.message}`);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  updateItem,
  getItemById,
  deleteItem
};
