import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetail from './CountryDetail'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setValue(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries <input value={value} onChange={handleSearchChange} />
      </div>

      {selectedCountry ? (
        <CountryDetail country={selectedCountry} />
      ) : value === '' ? (
        <p>Escribe el nombre de un país para buscar.</p>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length > 1 ? (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setSelectedCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      ) : filteredCountries.length === 1 ? (
        <CountryDetail country={filteredCountries[0]} />
      ) : (
        <p>No matches found</p>
      )}
    </div>
  )
}

export default App