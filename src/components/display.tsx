import  { useContext ,useEffect } from "react";
import Spinner from "./spinner";
import WeatherContext from "../context/weatherContext";


const Display = () => {
  const { error,loading, location,handleSearch,weatherData,setLocation,clearData} = useContext(WeatherContext)


  useEffect(() => {
    
  }, []);

  return (
    <div className=" justify-center ">
      <div className=" flex justify-center items-center mb-10 ">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation!(e.target.value)}
          placeholder="Enter location"
          className=" p-2 mr-5 rounded-md text-[20px] "
        />
        <button
          className="ml-5 bg-white text-blue-500 font-bold p-2 hover:bg-purple-700 hover:text-white  rounded-md "
          onClick={handleSearch}>
          Get Weather
        </button>
        {weatherData && weatherData.length> 0 && <button className="ml-5 bg-white text-yellow-400 font-bold p-2 hover:bg-red-700 hover:text-white  rounded-md" onClick={clearData}>CLEAR</button>}
      </div>

      {loading && <Spinner />}
      {error && (
        <p className="text-center text-white font-bold font-serif text-[25px] ">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2  justify-center ">
        {weatherData?.map((data) => {
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

export default Display;
