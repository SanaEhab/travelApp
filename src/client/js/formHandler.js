const serverURL = 'http://localhost:8000/api';

// Form for the booking
const bookingForm = document.getElementById('bookingForm'); // Assuming you have an id 'bookingForm'

bookingForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault();
    
    // Get the location and date from the form
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;

    // Send the location to the server
    fetch(serverURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location })
    })
    .then(response => response.json())
    .then(data => {
        // Display the trip details
        document.getElementById('image').innerHTML = `<img src="${data.image}" alt="Location Image" />`;
        document.getElementById('weather').innerHTML = `<p>Weather: ${data.weather.temperature}°C</p>`;
        document.getElementById('tripDate').innerHTML = `<p>Trip Date: ${date}</p>`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to validate URL (if you need it for another form)
function isValidURL(url) {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(url);
}

// Optional: If you have another form for URL validation, it would be handled here
const urlForm = document.getElementById('urlForm'); 

urlForm.addEventListener('submit', handleUrlSubmit);

function handleUrlSubmit(event) {
    event.preventDefault();

    // Get the URL from the input field
    const formText = document.getElementById('name').value;

    // Check if the URL is valid
    if (isValidURL(formText)) {
        // If the URL is valid, send it to the server
        sendDataToServer(formText);
    } else {
        alert("Please enter a valid URL");
    }
}

// Function to send valid URL to the server
function sendDataToServer(url) {
    fetch(serverURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  
        const resultDiv = document.getElementById('results');
        resultDiv.innerHTML = `<p>Data received from server: ${JSON.stringify(data)}</p>`;
    })
    .catch(error => {
        console.error("Error sending data:", error);
    });
}
