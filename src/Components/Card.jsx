import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { APIKEY } from "../Utils/api";
import { useState, useEffect } from "react";

const Card = () => {
    const APIKey = APIKEY;
    const [language, setLanguage] = useState(["en", "es", "it"])
    const [location, setLocation] = useState({ lat: "", lon: "" });
    const [address, setAddress] = useState({
      address: {
        town: "",
        state: "",
        country: "",
        postcode: "",
      },
    });
    const [weather, setWeather] = useState()
    const [error, setError] = useState(null);


    const getWeatherData = async () => {
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&current_weather=true&timezone=auto`
        );      
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);

      };

      const getAddressData = async () => {
        const addressResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&zoom=10&format=json`
          );
          const addressData = await addressResponse.json();
          setAddress({
            address: {
              town: addressData.address.town,
              state: addressData.address.state,
              country: addressData.address.country,
              postcode: addressData.address.postcode,
            },
          });
      }
      
      const handleGetLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude.toString();
              const longitude = position.coords.longitude.toString();
              setLocation({ lat: latitude, lon: longitude });
            },
            (error) => {
              setError(error.message);
            }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
        }
      };
      
      useEffect(() => {
        if (location.lat && location.lon) {
          getWeatherData();
          getAddressData();
        }
      }, [location]);
      

    const searchHandler = (event) => {
        const enteredCity = event.target.value;
        setAddress(enteredCity);
    }

    const submitHandler = async (event) => {
        event.preventDefault();
      
        const weatherData = await getWeather();
        setWeather(weatherData);
      };    



  return (
    <>
      <div className="searchBar">
        <form onSubmit={submitHandler}>
          <button type="button" onClick={handleGetLocation}>
            <FaMapMarkerAlt />
          </button>
          <input
            type="text"
            onChange={searchHandler}
            placeholder="Enter a address"
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </div>
      <div className="todayWeatherContainer">
        <img
          src="../../public/images/weatherImages/sunny.png"
          alt="cloudylogo"
        />
        <div>
          <p>today</p>
          <p>
            {address ? address.address.town : "Find a City"}
            <span>°C</span>
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
    </>
  );
}

export default Card








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