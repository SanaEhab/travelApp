const request = require('supertest'); // Import supertest for API testing
const express = require('express'); // Import express
const app = require('../server'); // Import the Express app

// Mock environment variables
process.env.GEONAMES_USERNAME = 'testUser';
process.env.WEATHERBIT_API_KEY = 'testKey';
process.env.PIXABAY_API_KEY = 'testKey';

describe('POST /api', () => {
    it('should return 400 if location or date is missing', async () => {
        const response = await request(app).post('/api').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Location and date are required");
    });

    it('should return 404 if location is not found', async () => {
        jest.spyOn(require('axios'), 'get').mockResolvedValueOnce({ data: { geonames: [] } });
        
        const response = await request(app).post('/api').send({ location: 'Unknown', date: '2025-12-01' });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Location not found.");
    });

    it('should return 500 if an error occurs', async () => {
        jest.spyOn(require('axios'), 'get').mockRejectedValueOnce(new Error('API error'));
        
        const response = await request(app).post('/api').send({ location: 'Paris', date: '2025-12-01' });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Error fetching data from APIs");
    });
});
