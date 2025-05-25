const ItemController = require('../controllers/item.controller');

module.exports = function (app) {
  app.post('/api/v1/items/create', ItemController.createItem);
  app.put('/api/v1/items/update/:id', ItemController.updateItem);
  app.get('/api/v1/items/getAll', ItemController.getAllItems);
  app.get('/api/v1/items/get/:id', ItemController.getItemById);
  app.delete('/api/v1/items/delete/:id', ItemController.deleteItem);
}