import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { APIKEY } from "../Utils/api";
import { useState, useEffect } from "react";

const Card = () => {
  const [location, setLocation] = useState({ lat: "", lon: "" });
  const [address, setAddress] = useState({ country: "", state: "", town: "" });
  const [weather, setWeather] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [addressList, setAddressList] = useState([]);

  const getLocationHandler = () => {
    setSearchInput("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude.toString(),
            lon: longitude.toString(),
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

  const searchInputHandler = (event) => {
    const enteredCity = event.target.value;
    setSearchInput(enteredCity);
  
    if (enteredCity.length >= 3) {
      getAddressData.byName();
      console.log(">=3");
    }
  };

  const getWeatherData = async () => {
    const response = await fetch(
      `https:api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&current_weather=true&timezone=auto`
    );
    const data = await response.json();
    setWeather(data);
  };

  const getAddressData = {
    byCoords: async () => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&zoom=10&format=json`
      );
      const data = await response.json();
      setAddress({
        country: data.address.country,
        state: data.address.state,
        town: data.address.town,
      });
    },

    byName: async () => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchInput}&format=json`
      );
      // const response = await fetch(
      //   `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput}&count=1&language=en&format=json`
      // );
      const data = await response.json();
      setAddressList(data.results);
    
      if (data.results[0]) {
        console.log(data.results);
        setAddress({
          country: data.results[0].country,
          state: data.results[0].admin1,
          town: data.results[0].name});
    
        setLocation({
          lat: data.results[0].latitude,
          lon: data.results[0].longitude,
        });
      }
    
      console.log("busca por nombre");
    },
  };

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  useEffect(() => {
    if (location.lat !== "" && location.lon !== "") {
      getWeatherData();
      getAddressData.byCoords();
    }
  }, [location, address]);

  return (
    <>
      <div className="searchBar">
        <form onSubmit={submitHandler}>
          <button type="button" onClick={getLocationHandler}>
            <FaMapMarkerAlt />
          </button>
          <input
            type="text"
            value={searchInput }
            onChange={searchInputHandler}
            placeholder="Enter an address"
            list="addressList"
          />
          <button type="submit">
            <FaSearch />
          </button>

          <datalist id="addressList">
            { addressList && addressList.map((address, index) => (
              <option
                key={address.id}
                value={`${address.name}, ${address.admin1}, ${address.country}`}
              />
            ))}
          </datalist>
        </form>
      </div>
      {!isEmpty(weather) && (
        <div className="resultContainer">
          {/* Renderizar contenido del clima */}
          <p>{address.town}</p>
          <p>
            {weather.current_weather.temperature}{" "}
            {weather.hourly_units.temperature_2m}
          </p>
        </div>
      )}
    </>
  );
};

export default Card;





// const [searchInput, setSearchInput] = useState("");
//   const [location, setLocation] = useState({ lat: "", lon: "" });
//   const [address, setAddress] = useState({});
//   const [addressList, setAddressList] = useState([]);
//   const [weather, setWeather] = useState(null);
//   const [error, setError] = useState(null);

//   const getAddressDataByCoords = async (lat, lon) => {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=json`
//     );
//     const data = await response.json();
//     setAddress(data.address);
//   };

//   const getAddressDataByName = async () => {
//     if (searchInput.length >= 2) {
//       const response = await fetch(
//         `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput}&count=10&language=en&format=json`
//       );
//       const data = await response.json();
//       setAddressList(data.results);

//       if (data.length > 0) {
//         const selectedCity = data[0]; // Obtener la primera ciudad de la lista (puedes ajustar la lógica según tus necesidades)
//         const { latitude, longitude } = selectedCity;
//         console.log(true);
//         setLocation({ lat: latitude.toString(), lon: longitude.toString() });
//       }
//     } else {
//       setAddressList([]);
//     }
//   };



//   const searchHandler = (event) => {
//     const enteredCity = event.target.value;
//     setSearchInput(enteredCity);
//     getAddressDataByName();
//   };

//   const searchSubmitHandler = async (event) => {
//     event.preventDefault();
    
//     if (location.lat && location.lon) {
//       await getWeatherData();
//     } else {
//       // Manejar el caso de ubicación no encontrada
//       console.log("Ubicación no encontrada");
//     }
//   };
  

//   const getWeatherData = async () => {
//     const response = await fetch(
//       `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&current_weather=true&timezone=auto`
//     );
//     const data = await response.json();
//     setWeather(data);
//   };

//   const handleGetLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ lat: latitude.toString(), lon: longitude.toString() });
//           getAddressDataByCoords(latitude, longitude);
//         },
//         (error) => {
//           setError(error.message);
//         }
//       );
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     if (location.lat && location.lon) {
//       getAddressDataByCoords(location.lat, location.lon);
//       getWeatherData();
//     }
//   }, [location]);