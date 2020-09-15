import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import './App.css';
import { sortData } from './util';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(async () => {
    const response = await fetch('https://disease.sh/v3/covid-19/all');
    const data = await response.json();
    setCountryInfo(data);
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      const response = await fetch('http://disease.sh/v3/covid-19/countries');
      const data = await response.json();
      const fetchedcountries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      const sortedData = await sortData(data);
      setTableData(sortedData);
      setCountries(fetchedcountries);
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    const response = await fetch(url);
    const data = await response.json();
    setCountry(countryCode);
    setCountryInfo(data);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />

          <h3>Worldwide New Cases</h3>

          {/* Graph! */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
