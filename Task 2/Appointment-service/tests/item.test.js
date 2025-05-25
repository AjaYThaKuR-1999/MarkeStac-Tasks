const mongoose = require('mongoose');
const Practitioner = require('../src/models/practitioner.model');
const { getAllPractitioners, getPractitionerById } = require('../src/controllers/practioner.controller');

// Mock the response object
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Practitioner Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPractitioners', () => {
        it('should return all practitioners with status 200', async () => {
            const mockPractitioners = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    resourceType: 'Practitioner',
                    name: [{ family: 'Smith', given: ['John'] }],
                    active: true,
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    resourceType: 'Practitioner',
                    name: [{ family: 'Doe', given: ['Jane'] }],
                    active: true,
                },
            ];

            jest.spyOn(Practitioner, 'find').mockResolvedValue(mockPractitioners);

            const req = {};
            const res = mockResponse();

            await getAllPractitioners(req, res);

            expect(Practitioner.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                practitioners: mockPractitioners,
            });
        });

        it('should return 404 when no practitioners are found', async () => {
            jest.spyOn(Practitioner, 'find').mockResolvedValue([]);

            const req = {};
            const res = mockResponse();

            await getAllPractitioners(req, res);

            expect(Practitioner.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'No practitioners found',
            });
        });

        it('should handle errors and return 500', async () => {
            const errorMessage = 'Database error';
            jest.spyOn(Practitioner, 'find').mockRejectedValue(new Error(errorMessage));

            const req = {};
            const res = mockResponse();

            await getAllPractitioners(req, res);

            expect(Practitioner.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: errorMessage,
            });
        });
    });

    describe('getPractitionerById', () => {
        it('should return a practitioner by ID with status 200', async () => {
            const practitionerId = new mongoose.Types.ObjectId();
            const mockPractitioner = {
                _id: practitionerId,
                resourceType: 'Practitioner',
                name: [{ family: 'Smith', given: ['John'] }],
                active: true,
            };

            jest.spyOn(Practitioner, 'findById').mockResolvedValue(mockPractitioner);

            const req = { params: { id: practitionerId } };
            const res = mockResponse();

            await getPractitionerById(req, res);

            expect(Practitioner.findById).toHaveBeenCalledWith(practitionerId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                practitioner: mockPractitioner,
            });
        });

        it('should return 404 when practitioner is not found', async () => {
            const practitionerId = new mongoose.Types.ObjectId();
            jest.spyOn(Practitioner, 'findById').mockResolvedValue(null);

            const req = { params: { id: practitionerId } };
            const res = mockResponse();

            await getPractitionerById(req, res);

            expect(Practitioner.findById).toHaveBeenCalledWith(practitionerId);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Practitioner not found',
            });
        });

        it('should handle errors and return 500', async () => {
            const practitionerId = new mongoose.Types.ObjectId();
            const errorMessage = 'Invalid ID format';
            jest.spyOn(Practitioner, 'findById').mockRejectedValue(new Error(errorMessage));

            const req = { params: { id: practitionerId } };
            const res = mockResponse();

            await getPractitionerById(req, res);

            expect(Practitioner.findById).toHaveBeenCalledWith(practitionerId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: errorMessage,
            });
        });
    });
});