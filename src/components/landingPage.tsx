import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./spinner";

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
  const [weatherData, setWeatherData] = useState<WeatherData[]>(() => {
    const savedData = localStorage.getItem("weatherData");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;

  const fetchCoordinates = async (location: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyAkspZjsbKwn9F7AvTKj-SEH_F8e-84GbA`
      );
      const { results } = response.data;
      if (results.length > 0) {
        const { location } = results[0].geometry;
        return { lat: location.lat, lon: location.lng };
      } else {
        setError("No results found");
        setWeatherData([]);
      }
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
      const data = response.data.dataseries;
      if (data.length === 0) {
        setError("No weather data found for this location");
      } else {
        setWeatherData(data);
        localStorage.setItem("weatherData", JSON.stringify(data));
      }
    } catch (error) {
      setError("Error fetching the weather data");
      console.error(error);
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

  useEffect(() => {
    const savedData = localStorage.getItem("weatherData");
    if (savedData) {
      setWeatherData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className=" justify-center ">
      <div className=" flex justify-center items-center mb-10 ">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className=" p-2 mr-10 rounded-md text-[20px] "
        />
        <button
          className="ml-5 bg-white text-blue-500 font-bold p-2 hover:bg-purple-700 hover:text-white  rounded-md "
          onClick={handleSearch}>
          Get Weather
        </button>
      </div>

      {loading && <Spinner />}
      {error && (
        <p className="text-center text-white font-bold font-serif text-[25px] ">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2  justify-center ">
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
            <div
              className="flex flex-col items-center justify-between w-50 mb-2 "
              key={data.date}>
              <div className="bg-[#439aeb] rounded-t-2xl p-5 text-center">
                <p className="text-[#ff0] font-[20px]  ">{dayName}</p>
                <div className="">
                  <img src={weatherIconSrc} alt={data.weather} />
                </div>
              </div>
              <div className="bg-[#001964] text-[#ffe8c6] text-center w-full pb-5 text-[20px] font-bold font-sans ">
                <p className="weather-description">
                  {data.weather.toUpperCase()}
                </p>
                <p className="">H: {data.temp2m.max} ºC</p>
                <p className="">L: {data.temp2m.min} ºC</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPage;
