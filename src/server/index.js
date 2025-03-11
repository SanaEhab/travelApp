require('dotenv').config(); // Load environment variables from a .env file
const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS to allow cross-origin requests
const bodyParser = require('body-parser'); // Import body-parser to parse incoming request bodies
const axios = require('axios'); // Import axios for making HTTP requests

const app = express(); // Create an Express application instance
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Use JSON parser for incoming request bodies

// Define an API endpoint for handling POST requests
app.post('/api', async (req, res) => {
    const { location, date } = req.body; // Extract location and date from request body

    // Validate that both location and date are provided
    if (!location || !date) {
        return res.status(400).json({ message: "Location and date are required" });
    }

    try {
        // Fetch geographical coordinates from GeoNames API
        const geoResponse = await axios.get(`http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`);
        const locationData = geoResponse.data.geonames[0]; // Extract first matching location

        // If no location is found, return an error response
        if (!locationData) {
            return res.status(404).json({ message: "Location not found." });
        }

        // Extract latitude, longitude, and country name
        const { lat, lng, countryName } = locationData;

        // Fetch weather forecast data from Weatherbit API
        const weatherResponse = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`);
        const weatherData = weatherResponse.data.data[0]; // Get the first day's forecast

        // If no weather data is found, return an error response
        if (!weatherData) {
            return res.status(404).json({ message: "Weather data not found." });
        }

        // Fetch an image of the location from Pixabay API
        const imageResponse = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(location)}&image_type=photo`);
        const imageUrl = imageResponse.data.hits.length > 0 ? imageResponse.data.hits[0].webformatURL : null;

        // Calculate countdown days until the trip
        const tripDate = new Date(date);
        const today = new Date();
        const timeDiff = tripDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        // Send a response with location, weather, image, and countdown
        res.json({
            location: { city: location, country: countryName, lat, lng },
            weather: { temp: weatherData.temp, description: weatherData.weather.description, date: weatherData.valid_date },
            image: imageUrl,
            countdown: daysLeft
        });
    } catch (error) {
        console.error("Error fetching data:", error); // Log error details for debugging
        res.status(500).json({ message: 'Error fetching data from APIs' }); // Return error response
    }
});

// Start the Express server on port 8000
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
