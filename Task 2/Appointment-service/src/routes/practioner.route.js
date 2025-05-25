const Practitioner = require('../controllers/practioner.controller');
const { verifyToken } = require('../middleware/jwt.auth');

module.exports = function (app) {
    app.post('/api/v1/practitioners/login', Practitioner.logIn);
    app.post('/api/v1/practitioners/signup', Practitioner.signUpPractitioner);
    app.get('/api/v1/practitioners/getAll', verifyToken, Practitioner.getAllPractitioners);
    app.get('/api/v1/practitioners/get/:id', verifyToken, Practitioner.getPractitionerById);
    app.delete('/api/v1/practitioners/delete/:id', verifyToken, Practitioner.deletePractitioner);

};