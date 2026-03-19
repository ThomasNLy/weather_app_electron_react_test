import React from "react";
import "./CurrentDayWeatherBanner.css";
import { WEATHERCODES } from "../utilities";
import cloudyIcon from "../assets/cloudy_160.png";
import nightIcon from "../assets/night_160.png";
import overcastIcon from "../assets/overcast_160.png";
import partlyCloudyDayIcon from "../assets/partly_cloudy_day_160.png";
import partlyCloudyNightIcon from "../assets/partly_cloudy_night_160.png";
import rainIcon from "../assets/rain_160.png";
import snowIcon from "../assets/snowflake5_160.png";
import sunIcon from "../assets/sun_daisy1_160.png";
import thunderIcon from "../assets/thunder_160.png";

interface IWeatherBannerProps {
    unit: string;
    minTemp: number;
    apparentTemp: number;
    currentTemp: number;
    weatherCode: number;
}
export function CurrentDayWeatherBanner({
    unit,
    minTemp,
    apparentTemp,
    currentTemp,
    weatherCode,
}: IWeatherBannerProps) {
    let weatherStatus = weatherStatusIcon(weatherCode);
    return (
        <div className="weather-banner">
            <h1>Today</h1>
            <h2>{weatherStatus.status}</h2>
            <img src={weatherStatus.icon} alt={weatherStatus.status} />
            <h2>{`${currentTemp}${unit}`}</h2>
            <div className="additional-stats">
                <p>low {minTemp}°</p>
                <p>{`feels like ${apparentTemp}${unit}`}</p>
            </div>
        </div>
    );
}
//fix up later to have it work properly with night/day to have correct icon
// for clear sky and such
function weatherStatusIcon(_weatherCode: number) {
    switch (_weatherCode) {
        case WEATHERCODES.CLEAR_SKY:
            return {
                icon: sunIcon,
                status: "sunny",
            };

        case WEATHERCODES.MAINLY_CLEAR:
            return {
                icon: sunIcon,
                status: "sunny",
            };

        case WEATHERCODES.PARTLY_CLOUDY:
            return {
                icon: partlyCloudyDayIcon,
                status: "cloudy",
            };

        case WEATHERCODES.OVERCAST:
            return {
                icon: cloudyIcon,
                status: "cloudy",
            };

        case WEATHERCODES.FOG:
        case WEATHERCODES.DEPOSITING_RIME_FOG:
            return {
                icon: cloudyIcon,
                status: "fog",
            };

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
            return {
                icon: rainIcon,
                status: "rain",
            };

        case WEATHERCODES.SNOW_FALL_SLIGHT:
        case WEATHERCODES.SNOW_FALL_MODERATE:
        case WEATHERCODES.SNOW_FALL_HEAVY:
        case WEATHERCODES.SNOW_GRAINS:
            return {
                icon: snowIcon,
                status: "snow",
            };

        case WEATHERCODES.THUNDERSTORM:
        case WEATHERCODES.THUNDERSTORM_LIGHT_HAIL:
        case WEATHERCODES.THUNDERSTORM_HEAVY_HAIL:
            return {
                icon: thunderIcon,
                status: "thunderous",
            };
    }
}
