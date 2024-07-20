import React, { useState } from "react";
import axios from "axios";


interface WeatherData {
  date: number;
  weather: string;
  temp2m: {
    max: number;
    min: number;
  };
}

const LandingPage: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;

  const fetchCoordinates = async (location: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
      );
      const { latitude, longitude } = response.data;
      return { lat: latitude, lon: longitude };
    } catch (error) {
      setError("Unable to fetch coordinates");
      console.error(error);
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`
      );
      setWeatherData(response.data.dataseries);
    } catch (error) {
      setError("Error fetching the weather data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!location) {
      setError("Please enter a location");
      return;
    }

    const coordinates = await fetchCoordinates(location);
    if (coordinates) {
      await fetchWeather(coordinates.lat, coordinates.lon);
    }
  };


  return (
    <div className="">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
      />
      <button onClick={handleSearch}>Get Weather</button>

      {loading && <p className="loading">Getting Forecast...</p>}
      {error && <p className="error">{error}</p>}
      <div className="result">
        {weatherData.map((data) => {
          const dateString = data.date.toString();
          const date = new Date(
            parseInt(dateString.slice(0, 4), 10),
            parseInt(dateString.slice(4, 6), 10) - 1,
            parseInt(dateString.slice(6, 8), 10)
          );
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
const weatherIconSrc = new URL(
            `/src/assets/images/${data.weather}.png`,
            import.meta.url
          ).href;
          return (
            <div className="flex flex-wrap justify-between " key={data.date}>
              <div className="card-top">
                <p className="weather-date">{dayName}</p>
                <div className="weather-icon-div">
                  <img
                    className="weather-icon"
                    src={weatherIconSrc}
                    
                    alt={data.weather}
                  />
                </div>
              </div>
              <div className="card-body">
                <p className="weather-description">{data.weather.toUpperCase()}</p>
                <p className="weather-temperatures">H: {data.temp2m.max} ºC</p>
                <p className="weather-temperatures">L: {data.temp2m.min} ºC</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPage;
