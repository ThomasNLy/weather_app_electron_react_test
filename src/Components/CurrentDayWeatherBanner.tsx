import React from "react";
import "./CurrentDayWeatherBanner.css";
import { WEATHERCODES } from "../utilities";
import cloudyIcon from "../assets/icons_160/cloudy_160.png";
import nightIcon from "../assets/icons_160/night_160.png";
import partlyCloudyDayIcon from "../assets/icons_160/partly_cloudy_day_160.png";
import partlyCloudyNightIcon from "../assets/icons_160/partly_cloudy_night_160.png";
import rainIcon from "../assets/icons_160/rain_160.png";
import snowIcon from "../assets/icons_160/snowflake5_160.png";
import sunIcon from "../assets/icons_160/sun_daisy1_160.png";
import thunderIcon from "../assets/icons_160/thunder_160.png";
import fogIcon from "../assets/icons_160/fog_160.png";

interface IWeatherBannerProps {
    unit: string;
    minTemp: number;
    apparentTemp: number;
    currentTemp: number;
    weatherCode: number;
    isDay: boolean;
}
export default function CurrentDayWeatherBanner({
    unit,
    minTemp,
    apparentTemp,
    currentTemp,
    weatherCode,
    isDay,
}: IWeatherBannerProps) {
    let weatherStatus = weatherStatusIcon(weatherCode, isDay);
    return (
        <div className="weather-banner">
            <h1>Current Weather</h1>
            <div className="current-weather-container">
                <img src={weatherStatus.icon} alt={weatherStatus.status} />
                <div className="current-weather-data-container">
                    <h2>{weatherStatus.status}</h2>
                    <p className="current-weather-current-temp">{`${currentTemp}${unit}`}</p>
                    <div className="weather-banner-additional-weather-data">
                        <p>Low {minTemp}°</p>
                        <p>{`Feels Like ${apparentTemp}°`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
//fix up later to have it work properly with night/day to have correct icon
// for clear sky and such
function weatherStatusIcon(_weatherCode: number, _isDay: boolean) {
    switch (_weatherCode) {
        case WEATHERCODES.CLEAR_SKY:
            return _isDay === true
                ? {
                      icon: sunIcon,
                      status: "Sunny",
                  }
                : {
                      icon: nightIcon,
                      status: "Clear Skies",
                  };

        case WEATHERCODES.MAINLY_CLEAR:
            return _isDay === true
                ? {
                      icon: sunIcon,
                      status: "Sunny",
                  }
                : { icon: nightIcon, status: "Clear Skies" };

        case WEATHERCODES.PARTLY_CLOUDY:
            return _isDay === true
                ? {
                      icon: partlyCloudyDayIcon,
                      status: "Partly Cloudy",
                  }
                : {
                      icon: partlyCloudyNightIcon,
                      status: "Partly Cloudy",
                  };

        case WEATHERCODES.OVERCAST:
            return {
                icon: cloudyIcon,
                status: "Cloudy",
            };

        case WEATHERCODES.FOG:
        case WEATHERCODES.DEPOSITING_RIME_FOG:
            return {
                icon: fogIcon,
                status: "Fog",
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
        case WEATHERCODES.RAIN_SHOWERS_SLIGHT:
        case WEATHERCODES.RAIN_SHOWERS_MODERATE:
        case WEATHERCODES.RAIN_SHOWERS_VIOLENT:
            return {
                icon: rainIcon,
                status: "Rain",
            };

        case WEATHERCODES.SNOW_FALL_SLIGHT:
        case WEATHERCODES.SNOW_FALL_MODERATE:
        case WEATHERCODES.SNOW_FALL_HEAVY:
        case WEATHERCODES.SNOW_GRAINS:
            return {
                icon: snowIcon,
                status: "Snow",
            };

        case WEATHERCODES.THUNDERSTORM:
        case WEATHERCODES.THUNDERSTORM_LIGHT_HAIL:
        case WEATHERCODES.THUNDERSTORM_HEAVY_HAIL:
            return {
                icon: thunderIcon,
                status: "Thunderous",
            };
    }
}
