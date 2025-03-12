const serverURL = 'http://localhost:8080/api'; // API endpoint for sending requests

const bookingForm = document.getElementById('bookingForm'); // Get the booking form element

// Check if the booking form exists before adding an event listener
if (bookingForm) {
    bookingForm.addEventListener('submit', handleFormSubmit); // Attach submit event listener to the form
}

// Function to handle form submission
export const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    
    // Validate if both fields are filled
    if (!location || !date) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      // Update the fetch URL to the full server URL
      const response = await fetch(`${serverURL}/weather?location=${location}&date=${date}`);
      const data = await response.json();
  
      // Check if the response contains the necessary data
      if (!data || !data.weather || !data.image) {
        alert('No data available');
        return;
      }
  
      // Display the weather and trip details
      document.getElementById('weather').innerHTML = `<p>Weather: ${data.weather.temp}°C</p>`;
      document.getElementById('tripDate').innerHTML = `<p>Trip Date: ${date}</p>`;
      document.getElementById('image').innerHTML = `<img src="${data.image}" alt="Location Image" />`;
  
    } catch (error) {
      // Handle errors like network failure
      alert('Error while fetching the data');
    }
};
