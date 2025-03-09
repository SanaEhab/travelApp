require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api', async (req, res) => {
    const { location, date } = req.body;

    if (!location || !date) {
        return res.status(400).json({ message: "Location and date are required" });
    }

    try {
        const geoResponse = await axios.get(`http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`);
        const locationData = geoResponse.data.geonames[0];

        if (!locationData) {
            return res.status(404).json({ message: "Location not found." });
        }

        const { lat, lng, countryName } = locationData;

        const weatherResponse = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`);
        const weatherData = weatherResponse.data.data[0];

        if (!weatherData) {
            return res.status(404).json({ message: "Weather data not found." });
        }

        const imageResponse = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(location)}&image_type=photo`);
        const imageUrl = imageResponse.data.hits.length > 0 ? imageResponse.data.hits[0].webformatURL : null;

        const tripDate = new Date(date);
        const today = new Date();
        const timeDiff = tripDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        res.json({
            location: { city: location, country: countryName, lat, lng },
            weather: { temp: weatherData.temp, description: weatherData.weather.description, date: weatherData.valid_date },
            image: imageUrl,
            countdown: daysLeft
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: 'Error fetching data from APIs' });
    }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
