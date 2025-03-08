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

    if (!location) {
        return res.status(400).json({ message: "Location is required" });
    }

    try {
    
        const weatherResponse = await axios.get(`http://api.geonames.org/weatherJSON?q=${location}&username=${process.env.GEONAMES_USERNAME}`);
        const weatherData = weatherResponse.data.weatherObservation;

        const imageResponse = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${location}&image_type=photo`);
        const imageUrl = imageResponse.data.hits.length > 0 ? imageResponse.data.hits[0].webformatURL : null;

        if (!weatherData || !imageUrl) {
            return res.status(404).json({ message: "No data found for the given location." });
        }

        res.json({
            weather: weatherData,
            image: imageUrl,
            tripDate: date
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: 'Error fetching data from APIs' });
    }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
