import React, { Fragment, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import WeatherCard from "./Components/WeatherCard";
import { CurrentDayWeatherBanner } from "./Components/CurrentDayWeatherBanner";
import "./app.css";
import { IWeatherData } from "./typings";
const root = createRoot(document.body);
root.render(<App />);

function App() {
    const [weatherData, setWeatherData] = useState<IWeatherData>(null);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
    useEffect(() => {
        window.mainProcess.getWeatherData().then((data) => {
            if (data.status) {
                setWeatherData(data.weatherData);

                setConnectionStatus(data.status);
            } else {
                setConnectionStatus(data.status);
            }
            setDataLoaded(true);
        });
    }, []);
    if (!dataLoaded) {
        return <p>Loading weather data...</p>;
    } else if (connectionStatus === false) {
        return <h1>Error retrieving weather data. Try Again later</h1>;
    } else if (connectionStatus && dataLoaded) {
        const weatherCards = createWeatherCards(weatherData);
        let currentWeatherData = {
            minTemp: Math.round(weatherData.dailyMinTemp[0]),
            apparentTemp: Math.round(weatherData.currentApparentTemp),
            currentTemp: Math.round(weatherData.currentTemp),
            weatherCode: weatherData.weatherCode[0],
            isDayCode: weatherData.isDay,
        };
        return (
            <div className="app-main-content">
                <h2>Weather App</h2>
                <CurrentDayWeatherBanner
                    unit={weatherData.units.temperature}
                    minTemp={currentWeatherData.minTemp}
                    apparentTemp={currentWeatherData.apparentTemp}
                    currentTemp={currentWeatherData.currentTemp}
                    weatherCode={currentWeatherData.weatherCode}
                    isDay={currentWeatherData.isDayCode}
                />
                <div className="weather-card-container">{weatherCards}</div>
            </div>
        );
    }
}
function createWeatherCards(_weatherData: IWeatherData) {
    const weekday = [];
    let _weatherCards = [];
    const DAYSOFTHEWEEK: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let UTCTimeZoneOffset: number = Math.trunc(_weatherData.utcOffSetSeconds / 3600);

    let integerSign: string = UTCTimeZoneOffset < 0 ? "-" : "+";
    let formattedHour: string =
        UTCTimeZoneOffset < 10
            ? `0${Math.abs(UTCTimeZoneOffset)}`
            : `${Math.abs(UTCTimeZoneOffset)}`;

    for (let i = 0; i < _weatherData.forecastDays.length; i++) {
        let ISOFormat = `${_weatherData.forecastDays[i]}T00:00:00${integerSign}${formattedHour}:00`;
        let day = new Date(ISOFormat);

        let weekdayName = i == 0 ? "Today" : DAYSOFTHEWEEK[day.getDay()];

        weekday.push(weekdayName);
    }
    for (let i = 0; i < _weatherData.dailyMaxTemp.length; i++) {
        let maxTemp: number = Math.round(_weatherData.dailyMaxTemp[i]);
        let minTemp: number = Math.round(_weatherData.dailyMinTemp[i]);
        let data = {
            unit: _weatherData.units.temperature,
            dailyMaxTemp: maxTemp,
            dailyMinTemp: minTemp,
            weatherCode: _weatherData.weatherCode[i],
        };
        _weatherCards.push(
            <WeatherCard key={weekday[i]} weatherData={data} weekday={weekday[i]} />,
        );
    }
    return _weatherCards;
}
