// Import necessary modules
const axios = require('axios');

// Function to get air quality data from external API
async function getAirQualityData(city) {
  try {
    // Replace 'YOUR_API_KEY' with your OpenWeatherMap API key
    const apiKey = 'fc78157dbfb9a2dce1aaf70d03a9b4eb';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Make a GET request to the API
    const response = await axios.get(apiUrl);

    // Log the entire API response
    console.log('API Response:', response.data);

    // Extract air quality information from the API response
    const airQuality = response.data?.main?.aqi;

    // Return the air quality data
    return airQuality;
  } catch (error) {
    // Handle errors
    console.error('Error fetching data from OpenWeatherMap:', error.message);
    throw error; // You can choose to handle or propagate the error based on your requirements
  }
}

// Example usage
const city = 'Nablus';
getAirQualityData(city)
  .then(airQuality => {
    // Process the air quality data as needed
    console.log('Air Quality:', airQuality);
  })
  .catch(error => {
    // Handle errors
    console.error('Error getting air quality data:', error.message);
  });
