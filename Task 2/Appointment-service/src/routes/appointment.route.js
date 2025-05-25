const Appointment = require('../controllers/appointment.controller');
const { verifyToken } = require('../middleware/jwt.auth');

module.exports = function (app) {
    app.post('/api/v1/appointments/create', verifyToken, Appointment.createAppointment);
    app.get('/api/v1/appointments/getAll', verifyToken, Appointment.getAppointments);
    app.get('/api/v1/appointments/get/:id', verifyToken, Appointment.getAppointmentById);
    app.delete('/api/v1/appointments/delete/:id', verifyToken, Appointment.deleteAppointment);
    app.get('/api/v1/appointments/patient/:patientId', verifyToken, Appointment.getAppointmentsByPatient);

}