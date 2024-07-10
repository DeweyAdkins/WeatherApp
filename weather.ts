const apikey = '84b5eb6c44f9e2132da9db8571404753';

interface WeatherData {
    name: string;
    main: {
      temp: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    cod: string;
    message?: string;
  }
  
  interface ForecastData {
    list: {
      dt: number;
      main: {
        temp: number;
      };
      weather: {
        icon: string;
      }[];
    }[];
  }

function getWeather(): void {
    const zipCode: string = (document.getElementById('zip') as HTMLInputElement).value;

    if (!zipCode) {
        alert('Please enter a zip code!');
        return;
    }

    let lat: number;
    let lon: number;
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
        .then((data: WeatherData) => {
          displayWeather(data);
          fetch(forecastUrl)
            .then(response => response.json())
            .then((data: ForecastData) => {
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

function displayWeather(data: WeatherData): void {
    const tempDivInfo: HTMLElement = document.getElementById('temp-div') as HTMLElement;
    const weatherInfoDiv: HTMLElement = document.getElementById('weather-info') as HTMLElement;
    const weatherIcon: HTMLImageElement = document.getElementById('weather-icon') as HTMLImageElement;
    const hourlyForecastDiv: HTMLElement = document.getElementById('hourly-forecast') as HTMLElement;
  
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}<p>`;
      } else {
        const cityName: string = data.name;
        const temperature: number = Math.round(data.main.temp);
        const description: string = data.weather[0].description;
        const iconCode: string = data.weather[0].icon;
        const iconUrl: string = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    
        const temperatureHTML: string = `<p>${temperature}&deg;F</p>`;
        const weatherInfoHTML: string = `<h2>${cityName}</h2><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherInfoHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
    
        showImage();
      }
    }

    function displayHourlyForecast(hourlyData: ForecastData): void {
        const hourlyForecastDiv: HTMLElement = document.getElementById('hourly-forecast') as HTMLElement;
        const next24Hours = hourlyData.list.slice(0, 8);
      
        next24Hours.forEach(item => {
          const dateTime: Date = new Date(item.dt * 1000);
          const hour: number = dateTime.getHours();
          const temperature: number = Math.round(item.main.temp);
          const iconCode: string = item.weather[0].icon;
        const iconUrl: string = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml: string = `
        <div class="hourly-item">
          <span>${hour}:00</span>
          <img src="${iconUrl}" alt="Hourly Weather Icon">
          <span>${temperature}&deg;F</span>
        </div>
      `;
      hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
  }

function showImage() {
    const weatherIcon: HTMLImageElement = document.getElementById('weather-icon') as HTMLImageElement;
    weatherIcon.style.display = 'block';
}

document.getElementById('submit-btn')?.addEventListener('click', getWeather);

