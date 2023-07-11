import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { APIKEY } from "../Utils/api";
import { useState, useEffect } from "react";

const Card = () => {
  const APIKey = APIKEY;
  const [searchInput, setSearchInput] = useState("");
  const [location, setLocation] = useState({ lat: "", lon: "" });
  const [address, setAddress] = useState({});
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const getWeatherData = async () => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&current_weather=true&timezone=auto`
    );
    const data = await response.json();
    setWeather(data);
  };

  const getAddressData = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&zoom=10&format=json`
    );
    const data = await response.json();
    setAddress(data.address);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude.toString(), lon: longitude.toString() });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }

  };

  const searchHandler = (event) => {
    const enteredCity = event.target.value;
    setSearchInput(enteredCity);
  };

  const searchSubmitHandler = async (event) => {
    event.preventDefault();
    await getWeatherData();
    
  };

  useEffect(() => {
    if (location.lat && location.lon) {
      getAddressData();
    //   getWeatherData();
    }
  }, [location]);

  useEffect(() => {
    if (Object.keys(address).length > 0) {
      setSearchInput(`${address.town}, ${address.state}, ${address.country}`);
    }
  }, [address]);

  return (
    <>
      <div className="searchBar">
        <form onSubmit={searchSubmitHandler}>
          <button type="button" onClick={handleGetLocation}>
            <FaMapMarkerAlt />
          </button>
          <input
            type="text"
            value={searchInput}
            onChange={searchHandler}
            placeholder="Enter an address"
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </div>
      {Object.keys(address).length > 0 && (
        <div className="resultContainer">
          <div className="todayWeatherContainer">
            <img
              src="../../public/images/weatherImages/sunny.png"
              alt="cloudylogo"
            />
            <div>
              <p>today</p>
              <p>
                {address.town}
                <span> °C</span>
              </p>
            </div>
            <p>Over Clouds</p>

            <div>
              <p>Wind</p>
              <p>14 km/h</p>
              <p>Humidity</p>
              <p>80%</p>
            </div>
          </div>

          <div className="nextDaysContainer"></div>
        </div>
      )}
    </>
  );
};
  
  export default Card;
  
  
  








// if (addressToSearch) {
//     addressResponse = await fetch(
//       `https://nominatim.openstreetmap.org/search?q=${addressToSearch}`
//     );
//     const addressData = await addressResponse.json();
//     setAddress(addressData);











    //const apikeyGeoCodingOpenMeteo = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=${language}&format=json`;
    //const apikeyOpenWeatherMap = "https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKey}";


    // const getWeather = async () => {
    //     const response = await fetch(
    //       `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKey}`
    //     );
    //     const data = await response.json();
    //     return data;
    //   };