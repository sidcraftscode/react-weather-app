import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import cities from './cities.json';
import './App.css';

function WeatherApp() {
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({
        loading: false,
        data: [],
        error: false,
        errorMessage: '',
    });
    const [savedCities, setSavedCities] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const cities = JSON.parse(localStorage.getItem('savedCities')) || [];
        setSavedCities(cities);
        if (cities.length > 0) {
            fetchWeatherForSavedCities(cities);
        }
    }, []);

    const fetchWeatherForSavedCities = async (cities) => {
        setWeather({ ...weather, loading: true, error: false, errorMessage: '' });
        const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
        try {
            const weatherData = await Promise.all(
                cities.map(async (city) => {
                    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                        params: {
                            q: `${city.name},${city.country}`,
                            units: 'metric',
                            appid: apiKey,
                        },
                    });
                    return response.data;
                })
            );
            setWeather({ data: weatherData, loading: false, error: false, errorMessage: '' });
        } catch (error) {
            setWeather({ ...weather, data: [], error: true, errorMessage: 'Error fetching weather data.' });
            console.error('Error fetching weather data:', error);
        }
    };

    const saveCity = (city) => {
        const cityExists = savedCities.some(
            savedCity => savedCity.name === city.name && savedCity.country === city.country
        );
        if (cityExists) {
            setWeather({
                ...weather,
                error: true,
                errorMessage: 'You have already added this location',
            });
            return;
        }

        const updatedCities = [city, ...savedCities];
        setSavedCities(updatedCities);
        localStorage.setItem('savedCities', JSON.stringify(updatedCities));
        fetchWeatherForSavedCities(updatedCities);
    };

    const deleteCity = (cityToDelete) => {
        const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
        const updatedCities = savedCities.filter(
            city => 
                normalizeString(city.name) !== normalizeString(cityToDelete.name) || 
                normalizeString(city.country) !== normalizeString(cityToDelete.sys.country)
        );
        setSavedCities(updatedCities);
        localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    
        const updatedWeatherData = weather.data.filter(
            data => 
                normalizeString(data.name) !== normalizeString(cityToDelete.name) || 
                normalizeString(data.sys.country) !== normalizeString(cityToDelete.sys.country)
        );
        setWeather({ ...weather, data: updatedWeatherData });
    };
    

    const capitalizeFirstLetter = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const fetchWeather = async (selectedCity) => {
        setInput('');
        setWeather({ ...weather, loading: true, error: false, errorMessage: '' });
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
        try {
            const response = await axios.get(url, {
                params: {
                    q: `${selectedCity.label}`,
                    units: 'metric',
                    appid: apiKey,
                },
            });
            const cityData = {
                name: selectedCity.label.split(',')[0],
                country: selectedCity.label.split(', ')[1]
            };
            saveCity(cityData);
        } catch (error) {
            setWeather({ ...weather, data: [], error: true, errorMessage: 'Sorry! We could not find that city.' });
            console.error('Error fetching weather data:', error);
        }
    };

    const handleInputChange = (inputValue) => {
        setInput(inputValue);

        const filteredSuggestions = cities
            .filter(city => 
                city.name.toLowerCase().startsWith(inputValue.toLowerCase())
            )
            .slice(0, 10)
            .map(city => ({
                value: city.name,
                label: `${city.name}, ${city.country}`
            }));

        setSuggestions(filteredSuggestions);
    };

    const handleSelectChange = (selectedOption) => {
        fetchWeather(selectedOption);
        setSuggestions([]);
    };

    return (
        <div className="py-24">
            <div className="px-4 flex justify-center items-center">
                <h1 className="text-3xl font-semibold mb-4">Weather</h1>
            </div>
            <div className="remove-input-txt-border px-2 flex justify-center items-center">
                <Select
                    className="max-w-xs w-full"
                    value={input}
                    onInputChange={handleInputChange}
                    onChange={handleSelectChange}
                    options={suggestions}
                    placeholder="Type a city name"
                    noOptionsMessage={() => "No suggestions"}
                />
            </div>
            {weather.loading && (
                <div className="loading-indicator flex justify-center items-center">
                    <p>Loading...</p>
                </div>
            )}
            {weather.error && (
                <div className="error-message text-center text-red-500">
                    <p>{weather.errorMessage}</p>
                </div>
            )}
            <div className="mx-auto grid gap-4 justify-center items-center">
                <div className="mx-auto grid gap-4 justify-center items-center">
                    <div className="grid mt-4 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {weather.data.length > 0 && weather.data.map((city) => (
                            <div key={`${city.name}-${city.sys.country}`} className="relative w-full overflow-hidden rounded-xl bg-white px-5 pt-8 shadow">
                                <button onClick={() => deleteCity(city)} className="absolute right-0 top-0 p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-300 hover:text-gray-400">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <div className="text-center">
                                    <div className="flex flex-col items-start">
                                        <p className="text-ellipsis whitespace-nowrap text-sm uppercase">{city.name}, {city.sys.country}</p>
                                        <div className="pb-4 text-6xl font-black tracking-tight"> {Math.round(city.main.temp)}°C</div>
                                        <div className="items-center flex -translate-x-2 transform">
                                            <img className="h-12" src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`} alt={city.weather[0].description}/>
                                            <p className="">{capitalizeFirstLetter(city.weather[0].description)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherApp;
