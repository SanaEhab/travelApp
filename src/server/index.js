// Import required modules
var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
var aylien = require("aylien_textapi");
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

// Initialize dotenv for environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Use middleware
app.use(cors());
app.use(bodyParser.json());

// Set up aylien API (if needed)
var textapi = new aylien({
    application_id: process.env.API_ID,
    application_key: process.env.API_KEY
});

console.log(__dirname);

// Root route
app.get('/', function (req, res) {
    res.send("This is the server API page. You may access its services via the client app.");
});

// POST route to handle the trip details request
app.post('/api', async (req, res) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ message: "Location is required" });
    }

    try {
        // Get weather information from Geonames API
        const weatherResponse = await axios.get(`http://api.geonames.org/weatherJSON?q=${location}&username=${process.env.GEONAMES_USERNAME}`);
        
        // Get image information from Pixabay API
        const imageResponse = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${location}&image_type=photo`);

        const weatherData = weatherResponse.data;
        const imageData = imageResponse.data;

        // Send back both weather and image data to the client
        res.json({
            weather: weatherData.weatherObservation, // Assumes data from Geonames is structured like this
            image: imageData.hits[0]?.webformatURL || null, // Default to null if no image is found
            tripDate: new Date().toLocaleDateString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from APIs' });
    }
});

// Designates what port the app will listen to for incoming requests
app.listen(8000, function () {
    console.log('Server app listening on port 8000!');
});
