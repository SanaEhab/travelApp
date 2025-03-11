const request = require('supertest');
const axios = require('axios');
const app = require('../server'); // Ensure server.js exports 'app'

// Mock environment variables
process.env.GEONAMES_USERNAME = 'testUser';
process.env.WEATHERBIT_API_KEY = 'testKey';
process.env.PIXABAY_API_KEY = 'testKey';

jest.mock('axios'); // Mock axios to prevent actual API calls

describe('POST /api', () => {
    afterEach(() => {
        jest.restoreAllMocks(); // Reset mocks after each test
    });

    it('should return 400 if location or date is missing', async () => {
        const response = await request(app).post('/api').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Location and date are required");
    });

    it('should return 404 if location is not found', async () => {
        axios.get.mockResolvedValueOnce({ data: { geonames: [] } });

        const response = await request(app).post('/api').send({ location: 'Unknown', date: '2025-12-01' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Location not found.");
    });

    it('should return 500 if an API error occurs', async () => {
        axios.get.mockRejectedValueOnce(new Error('API error'));

        const response = await request(app).post('/api').send({ location: 'Paris', date: '2025-12-01' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Error fetching data from APIs");
    });

    it('should return valid weather and image data for a known location', async () => {
        axios.get
            .mockResolvedValueOnce({ 
                data: { geonames: [{ lat: '48.8566', lng: '2.3522', countryName: 'France' }] } 
            }) // Mock GeoNames API
            .mockResolvedValueOnce({ 
                data: { data: [{ temp: 20, weather: { description: 'Sunny' }, valid_date: '2025-12-01' }] } 
            }) // Mock Weatherbit API
            .mockResolvedValueOnce({ 
                data: { hits: [{ webformatURL: 'https://example.com/image.jpg' }] } 
            }); // Mock Pixabay API

        const response = await request(app).post('/api').send({ location: 'Paris', date: '2025-12-01' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('location');
        expect(response.body).toHaveProperty('weather');
        expect(response.body.weather.temp).toBe(20);
        expect(response.body.weather.description).toBe('Sunny');
        expect(response.body.image).toBe('https://example.com/image.jpg');
        expect(response.body.countdown).toBeGreaterThanOrEqual(0);
    });
});
