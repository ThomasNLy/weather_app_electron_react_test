import React from "react";
import "./WeatherCard.css";
import { WEATHERCODES } from "../utilities";
import partlyCloudyDayIcon from "../assets/icons_96/partly_cloudy_96.png";
import cloudyIcon from "../assets/icons_96/cloudy_96.png";
import rainIcon from "../assets/icons_96/rain_96.png";
import snowIcon from "../assets/icons_96/snowflake5_96.png";
import sunIcon from "../assets/icons_96/sun_daisy1_96.png";
import thunderIcon from "../assets/icons_96/thunder_96.png";
import fogIcon from "../assets/icons_96/fog_96.png";

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
    theme: string;
}
/**
 *
 * @param {IWeatherCardProps} weatherData - Component props
 *
 * @returns TSX.Element
 */
export default function WeatherCard({ weatherData, weekday, theme }: IWeatherCardProps) {
    return (
        <div className={`weather-card weather-card-${theme}`}>
            <div className="weather-card-data-container">
                <img src={weatherStatusIcon(weatherData.weatherCode)} alt="" />
                <div className="weather-card-data-temp-container">
                    <p className="temp-text">{`${weatherData.dailyMaxTemp}°`} </p>
                    <p className="temp-text">{`${weatherData.dailyMinTemp}°`}</p>
                </div>
            </div>
            <h2 className="weekday-text">{weekday}</h2>
        </div>
    );
}

//change to return status as string and an icon later as well
function weatherStatusIcon(_weatherCode: number) {
    switch (_weatherCode) {
        case WEATHERCODES.CLEAR_SKY:
        case WEATHERCODES.MAINLY_CLEAR:
            return sunIcon;

        case WEATHERCODES.PARTLY_CLOUDY:
            return partlyCloudyDayIcon;

        case WEATHERCODES.OVERCAST:
            return cloudyIcon;

        case WEATHERCODES.FOG:
        case WEATHERCODES.DEPOSITING_RIME_FOG:
            return fogIcon;

        case WEATHERCODES.DRIZZLE_LIGHT:
        case WEATHERCODES.DRIZZLE_MODERATE:
        case WEATHERCODES.DRIZZLE_DENSE:
        case WEATHERCODES.FREEZING_DRIZZLE_LIGHT:
        case WEATHERCODES.FREEZING_DRIZZLE_DENSE:
        case WEATHERCODES.RAIN_SLIGHT:
        case WEATHERCODES.RAIN_MODERATE:
        case WEATHERCODES.RAIN_HEAVY:
        case WEATHERCODES.FREEZING_RAIN_LIGHT:
        case WEATHERCODES.FREEZING_RAIN_HEAVY:

        case WEATHERCODES.RAIN_SHOWERS_SLIGHT:
        case WEATHERCODES.RAIN_SHOWERS_MODERATE:
        case WEATHERCODES.RAIN_SHOWERS_VIOLENT:
            return rainIcon;

        case WEATHERCODES.SNOW_FALL_SLIGHT:
        case WEATHERCODES.SNOW_FALL_MODERATE:
        case WEATHERCODES.SNOW_FALL_HEAVY:
        case WEATHERCODES.SNOW_GRAINS:
        case WEATHERCODES.SNOW_SHOWERS_SLIGHT:
        case WEATHERCODES.SNOW_SHOWERS_SLIGHT:
            return snowIcon;

        case WEATHERCODES.THUNDERSTORM:
        case WEATHERCODES.THUNDERSTORM_LIGHT_HAIL:
        case WEATHERCODES.THUNDERSTORM_HEAVY_HAIL:
            return thunderIcon;
    }
}
