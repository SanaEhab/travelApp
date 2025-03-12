import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { handleFormSubmit } from '../client/js/formHandler';

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  // Set up HTML structure for testing
  document.body.innerHTML = `
    <form data-testid="bookingForm" id="bookingForm">
      <input id="location" type="text" value="Paris" />
      <input id="date" type="date" value="2025-06-15" />
      <button type="submit">Submit</button>
    </form>
    <div id="image"></div>
    <div id="weather"></div>
    <div id="tripDate"></div>
  `;

  // Add event listener to form
  document.getElementById('bookingForm').addEventListener('submit', handleFormSubmit);
});

it('should submit the form and display the correct data', async () => {
  // Mock the fetch call to return weather and image data
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        weather: { temp: 25 },
        image: 'https://example.com/image.jpg'
      })
    })
  );

  // Simulate form submission
  fireEvent.submit(screen.getByTestId('bookingForm'));

  // Wait for the DOM to update and check if weather data is displayed
  await waitFor(() => screen.getByText('Weather: 25°C'));

  // Verify if the data is correctly displayed
  expect(screen.getByText('Weather: 25°C')).toBeInTheDocument();
  expect(screen.getByText('Trip Date: 2025-06-15')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
});

it('should show an alert if no data is available', async () => {
  // Mock fetch to return empty data
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve({})
    })
  );

  // Mock window.alert
  window.alert = jest.fn();

  // Simulate form submission
  fireEvent.submit(screen.getByTestId('bookingForm'));

  // Wait for alert to be called
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith('No data available'));
});

it('should show an error alert if fetch fails', async () => {
  // Mock fetch to simulate an error
  global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));

  // Mock window.alert
  window.alert = jest.fn();

  // Simulate form submission
  fireEvent.submit(screen.getByTestId('bookingForm'));

  // Wait for alert to be called
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Error while fetching the data'));
});
