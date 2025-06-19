const apiKey = "571e013737411e82e30baa31f44500ec"; // Replace with your actual OpenWeatherMap API key

const cityInput = document.getElementById("cityInput");
const weatherDisplay = document.getElementById("weatherDisplay");

function showLoading() {
  weatherDisplay.innerHTML = `<p>Loading weather data...</p>`;
}

function showError(message) {
  weatherDisplay.innerHTML = `
    <p style="color: #ffc107; font-weight: bold;">⚠️ ${message}</p>
    <small>https://openweathermap.org/faq#error401</small>
  `;
}

function displayWeather(data) {
  const { name, sys, main, weather, wind } = data;
  const icon = weather[0].icon;
  const html = `
    <h2>${name}, ${sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" />
    <p><strong>🌡️ Temperature:</strong> ${main.temp}°C</p>
    <p><strong>☁️ Condition:</strong> ${weather[0].main}</p>
    <p><strong>💧 Humidity:</strong> ${main.humidity}%</p>
    <p><strong>🌬️ Wind:</strong> ${wind.speed} m/s</p>
  `;
  weatherDisplay.innerHTML = html;
}

async function fetchWeather(url) {
  try {
    showLoading();
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      showError(data.message);
      return;
    }

    displayWeather(data);
  } catch (error) {
    showError("Something went wrong. Please try again.");
  }
}

function getWeatherByCity() {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetchWeather(url);
    },
    () => {
      showError("Unable to access your location.");
    }
  );
}
