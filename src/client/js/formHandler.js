
const serverURL = 'http://localhost:8000/api';

const form = document.getElementById('urlForm'); 

form.addEventListener('submit', handleSubmit); 


function handleSubmit(event) {
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

function isValidURL(url) {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(url);
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

// Export the handleSubmit function
export { handleSubmit };
export {isValidURL}