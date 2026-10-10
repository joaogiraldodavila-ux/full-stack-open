import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  // Cargar todos los países al iniciar la aplicación
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setValue(event.target.value)
  }

  // Filtrar los países según lo que escriba el usuario (case-insensitive)
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries <input value={value} onChange={handleSearchChange} />
      </div>

      {/* Validaciones exactas del Ejercicio 2.18 */}
      {value === '' ? (
        <p>Escribe el nombre de un país para buscar.</p>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length > 1 ? (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}
            </li>
          ))}
        </ul>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>capital {filteredCountries[0].capital ? filteredCountries[0].capital[0] : 'No tiene capital'}</p>
          <p>area {filteredCountries[0].area}</p>
          
          <h3>languages:</h3>
          <ul>
            {filteredCountries[0].languages &&
              Object.values(filteredCountries[0].languages).map(lang => (
                <li key={lang}>{lang}</li>
              ))}
          </ul>

          <img
            src={filteredCountries[0].flags.png}
            alt={`Flag of ${filteredCountries[0].name.common}`}
            width="150"
          />
        </div>
      ) : (
        <p>No matches found</p>
      )}
    </div>
  )
}

export default App