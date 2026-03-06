import React, { Fragment, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import WeatherCard from "./Components/WeatherCard";
import "./app.css";
const root = createRoot(document.body);
root.render(<App />);

function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        window.mainProcess.getWeatherData().then((data) => {
            setWeatherData(data);
            console.log(data);
            setDataLoaded(true);
        });
    }, []);

    if (!dataLoaded) {
        return <p>Loading weather data...</p>;
    } else {
        const weatherCards = [];
        const weekday = [];
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            let nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            let weekdayName =
                nextDay.getDate() == today.getDate()
                    ? "Today"
                    : nextDay.toLocaleDateString("en-CA", { weekday: "short" });

            weekday.push(weekdayName);
            console.log(nextDay.getDate());
        }
        for (let i = 0; i < weatherData.dailyMaxTemp.length; i++) {
            let maxTemp: number = Math.round(weatherData.dailyMaxTemp[i]);
            let minTemp: number = Math.round(weatherData.dailyMinTemp[i]);
            let data = {
                unit: weatherData.unit,
                dailyMaxTemp: maxTemp,
                dailyMinTemp: minTemp,
            };
            weatherCards.push(
                <WeatherCard
                    key={weekday[i]}
                    weatherData={data}
                    weekday={weekday[i]}
                />,
            );
        }
        return (
            <Fragment>
                <h2>Weather App</h2>
                <div className="weather-card-container">{weatherCards}</div>
            </Fragment>
        );
    }
}
