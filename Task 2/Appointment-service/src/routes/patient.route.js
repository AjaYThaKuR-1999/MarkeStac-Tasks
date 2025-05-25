const Patient = require('../controllers/patient.controller');
const { verifyToken } = require('../middleware/jwt.auth');

module.exports = function (app) {
    app.post('/api/v1/patients/create', verifyToken, Patient.addPatient);
    app.get('/api/v1/patients/getAll', verifyToken, Patient.getAllPatients);

}