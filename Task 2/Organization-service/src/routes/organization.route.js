const Organization = require('../controllers/organization.controller');

module.exports = (app) => {
    app.post('/api/v1/organization/signUp', Organization.signUp);
    app.post('/api/v1/organization/logIn', Organization.logIn);
}