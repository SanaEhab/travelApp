const serverURL = 'http://localhost:8000/api'; // API endpoint for sending requests

const bookingForm = document.getElementById('bookingForm'); // Get the booking form element

// Check if the booking form exists before adding an event listener
if (bookingForm) {
    bookingForm.addEventListener('submit', handleSubmit); // Attach submit event listener to the form
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get user input values for location and date
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;

    // Send a POST request to the server with the user input
    fetch(serverURL, {
        method: 'POST', // HTTP method type
        headers: {
            'Content-Type': 'application/json', // Set content type as JSON
        },
        body: JSON.stringify({ location, date }) // Convert input data to JSON format
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        // Check if the response contains an image and weather data
        if (!data.image || !data.weather) {
            alert("No data available"); // Alert the user if no data is found
            return;
        }

        // Display the location image
        document.getElementById('image').innerHTML = `<img src="${data.image}" alt="Location Image" />`;
        // Display the weather information
        document.getElementById('weather').innerHTML = `<p>Weather: ${data.weather.temperature}°C</p>`;
        // Display the selected trip date
        document.getElementById('tripDate').innerHTML = `<p>Trip Date: ${date}</p>`;
    })
    .catch(error => {
        console.error('Error:', error); // Log any errors to the console
        alert("Error while fetching the data"); // Notify the user about the error
    });
}