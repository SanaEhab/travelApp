const serverURL = 'http://localhost:8000/api';


const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();

    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;

    fetch(serverURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, date })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.image || !data.weather) {
            alert("no data");
            return;
        }

        document.getElementById('image').innerHTML = `<img src="${data.image}" alt="Location Image" />`;
        document.getElementById('weather').innerHTML = `<p>Weather: ${data.weather.temperature}°C</p>`;
        document.getElementById('tripDate').innerHTML = `<p>Trip Date: ${date}</p>`;
    })
    .catch(error => {
        console.error('Error:', error);
        alert("error while fetching the data");
    });
}
