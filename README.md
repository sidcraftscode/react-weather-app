# React Weather app

A neat little weather app built with React and Tailwind CSS, allowing users to search for and select cities to see the weather in those cities. It uses the [OpenWeatherMap API](https://openweathermap.org/api). You can preview it [here](https://react-weather-sid.vercel.app)

## Getting Started
### Prerequisites
node, npm

### Installation
1. Clone the repo 
```
git clone https://github.com/sidcraftscode/react-weather-app
cd react-weather-app
```

2. Install NPM packages
```
npm install
```

3. Add your API key to the .env file like below. You can get one [here](https://openweathermap.org/api) for free.
```
REACT_APP_OPENWEATHER_API_KEY=INSERT_YOUR_API_KEY_HERE
```

3. Start the app in dev mode
```
npm start
```

### Other scripts
Generating a production build of the app
```
npm run build
```

## Built With

* [React](https://react.dev)
* [TailwindCSS](https://tailwindcss.com)
* [OpenWeatherMap API](https://openweathermap.org/api)

## Features
- [x] Allow user to search and add cities to see temperature/weather conditions of.
- [x] City suggestions.
- [ ] Fahrenheit/Celsius switch
- [ ] Dark mode
- [ ] Allow user to click on card to see more information (e.g. humidity, wind speed, forecast)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
