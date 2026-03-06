import React from "react";
import "./WeatherCard.css";
interface IWeatherCardProps {
    weatherData: {
        unit: string;
        dailyMaxTemp: number;
        dailyMinTemp: number;
    };
    weekday: string;
}
/**
 *
 * @param {IWeatherCardProps} weatherData - Component props
 *
 * @returns TSX.Element
 */
export default function WeatherCard({
    weatherData,
    weekday,
}: IWeatherCardProps) {
    console.log(weatherData);
    return (
        <div className="weather-card">
            <h2>{weekday}</h2>
            <p>{`${weatherData.dailyMaxTemp}${weatherData.unit}`} </p>
            <p>{`${weatherData.dailyMinTemp}${weatherData.unit}`}</p>
        </div>
    );
}
