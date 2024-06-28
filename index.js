const apikey = '84b5eb6c44f9e2132da9db8571404753';

function getWeather() {
    const zipCode = document.getElementById('zip').value;

    if (!zipCode) {
        alert('Please enter a zip code!');
        return;
    }
    let lat;
    let lon;
    const geoUrl =`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apikey}`;

fetch(geoUrl)
    .then(response => response.json())
    .then(data => {
        lat=data.lat;
        lon=data.lon;
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`;
        fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                displayHourlyForecast(data);
            })
            .catch(error => {
                console.error('Error fetching hourly forecast data: ', error);
                alert('Error fetching hourly forecast data. Please try again.');
            });
        })
        .catch(error => {
            console.error('Error fetching current weather data: ', error);
            alert('Error fetching current weather data. Please try again.');
        });
    }).catch(error => {
        console.error('Error fetching current weather data: ', error);
        alert('Error fetching current weather data. Please try again.');
    });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}<p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    
        const temperatureHTML = `
        <p>${temperature}&deg;F</p>
        `;

        const weatherInfoHTML = `
        <h2>${cityName}</h2>
        <p>${description}</p>
        `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherInfoHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.list.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
        <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}&deg;C</span>
        </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}

document.getElementById('submit-btn').addEventListener('click', getWeather);

