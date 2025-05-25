const { verifyToken } = require('../middleware/jwt.auth');
const Aggrement = require('../controllers/aggrement.controller');

module.exports = (app) => {
    app.post('/api/v1/aggrement/create', Aggrement.generateContract);
    app.post('/api/v1/aggrement/details', Aggrement.getContractDetails);
}