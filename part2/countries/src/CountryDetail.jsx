import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  const capital = country.capital ? country.capital[0] : null

  useEffect(() => {
    if (capital && api_key) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
        )
        .then((response) => {
          setWeather(response.data)
        })
        .catch((error) => {
          console.error('Error al obtener el clima:', error)
        })
    }
  }, [capital, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital || 'No tiene capital'}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {country.languages &&
          Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      {capital && weather ? (
        <div>
          <h3>Weather in {capital}</h3>
          <p>temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      ) : capital ? (
        <p>Cargando información del clima...</p>
      ) : null}
    </div>
  )
}

export default CountryDetail