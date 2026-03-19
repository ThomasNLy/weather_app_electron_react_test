import React from "react";
import "./WeatherCard.css";
import { WEATHERCODES } from ".././utilities";

interface IWeatherCardProps {
    /** object containing weather data */
    weatherData: {
        /** unit of measuerment*/
        unit: string;
        dailyMaxTemp: number;
        dailyMinTemp: number;
        weatherCode: number;
    };
    weekday: string;
}
/**
 *
 * @param {IWeatherCardProps} weatherData - Component props
 *
 * @returns TSX.Element
 */
export default function WeatherCard({ weatherData, weekday }: IWeatherCardProps) {
    console.log(weatherData);
    return (
        <div className="weather-card">
            <h2>{weekday}</h2>
            <p>{weatherStatusIcon(weatherData.weatherCode)}</p>
            <p>{`${weatherData.dailyMaxTemp}${weatherData.unit}`} </p>
            <p>{`${weatherData.dailyMinTemp}${weatherData.unit}`}</p>
        </div>
    );
}

//change to return status as string and an icon later as well
function weatherStatusIcon(_weatherCode: number) {
    switch (_weatherCode) {
        case WEATHERCODES.CLEAR_SKY:
            return "thunderous";

        case WEATHERCODES.MAINLY_CLEAR:
            return "clear";

        case WEATHERCODES.PARTLY_CLOUDY:
            return "partly cloudy";

        case WEATHERCODES.OVERCAST:
            return "cloudy";

        case WEATHERCODES.FOG:
        case WEATHERCODES.DEPOSITING_RIME_FOG:
            return "fog";

        case WEATHERCODES.DRIZZLE_LIGHT:
        case WEATHERCODES.DRIZZLE_MODERATE:
        case WEATHERCODES.DRIZZLE_DENSE:
        case WEATHERCODES.RAIN_SLIGHT:
        case WEATHERCODES.RAIN_MODERATE:
        case WEATHERCODES.RAIN_HEAVY:
        case WEATHERCODES.FREEZING_DRIZZLE_LIGHT:
        case WEATHERCODES.FREEZING_DRIZZLE_DENSE:
        case WEATHERCODES.FREEZING_RAIN_LIGHT:
        case WEATHERCODES.FREEZING_RAIN_HEAVY:
        case WEATHERCODES.RAIN_SHOWERS_MODERATE:
        case WEATHERCODES.RAIN_SHOWERS_VIOLENT:
            return "rain";

        case WEATHERCODES.SNOW_FALL_SLIGHT:
        case WEATHERCODES.SNOW_FALL_MODERATE:
        case WEATHERCODES.SNOW_FALL_HEAVY:
        case WEATHERCODES.SNOW_GRAINS:
            return "snow";

        case WEATHERCODES.THUNDERSTORM:
        case WEATHERCODES.THUNDERSTORM_LIGHT_HAIL:
        case WEATHERCODES.THUNDERSTORM_HEAVY_HAIL:
            return "thunderous";
    }
}
