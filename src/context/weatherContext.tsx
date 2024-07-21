import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

interface WeatherData {
  date: number;
  weather: string;
  temp2m: {
    max: number;
    min: number;
  };
}

export interface WeatherContextProps {
  location?: string;
  setLocation: Dispatch<SetStateAction<string>>;
  weatherData: WeatherData[];
  loading: boolean;
  error: string | null;
  handleSearch: () => void;
  clearData: () => void;
}
interface props {
  children: ReactNode;
}

const WeatherContext = createContext<Partial<WeatherContextProps>>({});

export const WeatherProvider = ({ children }: props) => {
  const [location, setLocation] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData[]>(() => {
    const savedData = localStorage.getItem("weatherData");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_APP_GEOCODE_API_KEY;

  const fetchCoordinates = async (location: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
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

  const clearData = () => {
    setWeatherData([]);
    setLocation("");
    localStorage.removeItem("weatherData");
  };

  useEffect(() => {
    const savedData = localStorage.getItem("weatherData");
    if (savedData) {
      setWeatherData(JSON.parse(savedData));
      setLoading(false);
    }
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        location,
        setLocation,
        weatherData,
        loading,
        error,
        handleSearch,
        clearData,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
