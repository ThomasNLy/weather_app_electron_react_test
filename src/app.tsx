import React, { FC, Fragment, useEffect, useState, useRef, useCallback, RefObject } from "react";
import { createRoot } from "react-dom/client";

import WeatherCard from "./Components/WeatherCard";
import CurrentDayWeatherBanner from "./Components/CurrentDayWeatherBanner";
import PrecipitationCard from "./Components/PrecipitationCard";
import Menu from "./Components/Menu";
import "./app.css";
import { IGeoAPIResponse, IGeoCoordinatesData, IWeatherAPIResponse, IWeatherData } from "./typings";
import { WEATHERCODES, ISOFormatTimeZoneOffset } from "./utilities";
import loadingScreenIcon from "./assets/icons_160/partly_cloudy_day_160.png";
import buttonLeftIcon from "./assets/button_left.svg";
import buttonRightIcon from "./assets/button_right.svg";
import hamburgerMenuButtonIcon from "./assets/hamburger_menu_button.svg";
const root = createRoot(document.body);
root.render(<App />);

function App() {
    console.log("Width: " + window.innerWidth);
    console.log("Height: " + window.innerHeight);

    const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // fake loading screen for UX
    let temp: IGeoCoordinatesData = { latitude: 43.7064, longitude: -79.3986, cityName: "Toronto" };

    const [currentCityGeoData, setCurrentCityGeoData] = useState<IGeoCoordinatesData>(temp);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const weatherCardContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const apiCall: Promise<IWeatherAPIResponse> = window.mainProcess.getWeatherData(
            currentCityGeoData.latitude,
            currentCityGeoData.longitude,
        );

        const delayTimer: Promise<any> = new Promise((resolve) => setTimeout(resolve, 1200));
        const arrayOfPromiseToResolve: Promise<any>[] = [apiCall, delayTimer];
        /*
        used to ensure that the data is loaded in when retrieving data from 
        the weather api and the fake delay is full finished as well for the loading
        screen in case the data loaded in too quickly for better UX 
        takes in an array of values returned form resolved promise and grabspecific promise's resolved result
        from the array passed in, order matches order of items in array of promises
        */
        Promise.all(arrayOfPromiseToResolve)
            .then((values: any[]) => {
                const apiData: IWeatherAPIResponse = values[0];
                if (apiData.status) {
                    setWeatherData(apiData.weatherData);
                }
                setIsLoading(false);
                setConnectionStatus(apiData.status);
            })
            .catch((error) => {
                console.log("Node js Error with IPC main process probably crashed", error);
                setConnectionStatus(false);
                setIsLoading(false);
            });
    }, [currentCityGeoData]);

    const handleSetCurrentCityFunction = useCallback(
        async (geoCoordinatesData: IGeoCoordinatesData) => {
            let cityGeoData: IGeoCoordinatesData = {
                latitude: geoCoordinatesData.latitude,
                longitude: geoCoordinatesData.longitude,
                cityName: geoCoordinatesData.cityName,
            };
            console.log(currentCityGeoData === cityGeoData);
            setCurrentCityGeoData(cityGeoData);
            setIsLoading(true);
            setMenuOpen(false);
        },
        [],
    );

    if (isLoading) {
        return (
            <div className="loading-screen">
                <img src={loadingScreenIcon} alt="Loading Screen Icon of a sun covered by clouds" />
                <p>Loading weather data...</p>
            </div>
        );
    } else if (connectionStatus === false) {
        return <h1>Error retrieving weather data. Try Again later</h1>;
    } else if (connectionStatus) {
        let currentWeatherData = {
            minTemp: Math.round(weatherData!.dailyMinTemp[0]),
            apparentTemp: Math.round(weatherData!.currentApparentTemp),
            currentTemp: Math.round(weatherData!.currentTemp),
            weatherCode: weatherData!.currentWeatherCode,
            isDay: weatherData!.isDay,
        };

        const theme: string = setTheme(currentWeatherData.weatherCode, currentWeatherData.isDay);
        const weatherCards = createWeatherCards(weatherData!, theme);
        const precipitationCards = createPrecipitationCards(weatherData!);

        return (
            <div className={`app-container ${theme}`}>
                {menuOpen ? (
                    <Menu
                        handleCloseMenuFunction={setMenuOpen}
                        handleSearchCityFunction={getLocationData}
                        handleSetCurrentCityFunction={handleSetCurrentCityFunction}
                    />
                ) : (
                    <button className="open-menu-button" onClick={() => setMenuOpen(true)}>
                        <img
                            className="button-svg-icon"
                            src={hamburgerMenuButtonIcon}
                            alt="hamburger menu button"
                        />
                    </button>
                )}
                <div className="app-main-content">
                    <h1 className="current-city-header content-header">
                        {currentCityGeoData.cityName}
                    </h1>
                    <CurrentDayWeatherBanner
                        unit={weatherData!.units.temperature}
                        minTemp={currentWeatherData.minTemp}
                        apparentTemp={currentWeatherData.apparentTemp}
                        currentTemp={currentWeatherData.currentTemp}
                        weatherCode={currentWeatherData.weatherCode}
                        isDay={currentWeatherData.isDay}
                    />
                    <div className="weekly-forecast-content">
                        <button
                            className="weekly-forecast-left-scroll-button"
                            type="button"
                            onClick={() =>
                                handleWeatherCardScroll(
                                    false,
                                    weatherCardContainerRef as RefObject<HTMLDivElement>,
                                )
                            }
                        >
                            <img
                                className="button-svg-icon"
                                src={buttonLeftIcon}
                                alt="left button"
                            />
                        </button>
                        <button
                            className="weekly-forecast-right-scroll-button"
                            type="button"
                            onClick={() =>
                                handleWeatherCardScroll(
                                    true,
                                    weatherCardContainerRef as RefObject<HTMLDivElement>,
                                )
                            }
                        >
                            <img
                                className="button-svg-icon"
                                src={buttonRightIcon}
                                alt="right button"
                            />
                        </button>
                        <div
                            ref={weatherCardContainerRef}
                            className={`weather-card-container weather-card-container-${theme}`}
                        >
                            {weatherCards}
                        </div>
                    </div>
                    <div>
                        <h1 className="content-header">Precipitation</h1>
                        <div
                            className={`precipitation-card-container precipitation-card-container-${theme}`}
                        >
                            {precipitationCards}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function createWeatherCards(_weatherData: IWeatherData, theme: string) {
    const weekday = [];
    let _weatherCards = [];
    const DAYSOFTHEWEEK: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    //use this function to display time zone off set maybe???
    let UTCTimeZoneOffset: string = ISOFormatTimeZoneOffset(
        Math.trunc(_weatherData.utcOffSetSeconds / 3600),
    );

    for (let i = 0; i < _weatherData.forecastDays.length; i++) {
        //ISO format is not used at all as it messes with weather app getting date to
        //match local time zone
        let ISOFormat = `${_weatherData.forecastDays[i]}T00:00:00${UTCTimeZoneOffset}`;
        let day = new Date(_weatherData.forecastDays[i]);

        let weekdayName = i == 0 ? "Today" : DAYSOFTHEWEEK[day.getUTCDay()];

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
            <WeatherCard key={weekday[i]} weatherData={data} weekday={weekday[i]} theme={theme} />,
        );
    }
    return _weatherCards;
}

function createPrecipitationCards(_weatherData: IWeatherData) {
    const weekday = [];
    let _precipitationCards = [];
    const DAYSOFTHEWEEK: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let UTCTimeZoneOffset: string = ISOFormatTimeZoneOffset(
        Math.trunc(_weatherData.utcOffSetSeconds / 3600),
    );

    for (let i = 0; i < _weatherData.forecastDays.length; i++) {
        let ISOFormat = `${_weatherData.forecastDays[i]}T00:00:00${UTCTimeZoneOffset}`;
        let calendarDate = _weatherData.forecastDays[i];

        let day = new Date(calendarDate);
        //let day = new Date(ISOFormat);

        let weekdayName = i == 0 ? "Today" : DAYSOFTHEWEEK[day.getUTCDay()];

        weekday.push(weekdayName);
    }
    for (let i = 0; i < _weatherData.dailyMaxTemp.length; i++) {
        let precipitationChance: number = Math.round(_weatherData.precipitationChance[i]);
        let data = {
            unit: _weatherData.units.precipitation,
            precipitationChance: precipitationChance,
        };
        _precipitationCards.push(
            <PrecipitationCard key={weekday[i]} weekday={weekday[i]} data={data} />,
        );
    }
    return _precipitationCards;
}

function setTheme(_weatherCode: number, _isDay: boolean): string {
    switch (_weatherCode) {
        case WEATHERCODES.CLEAR_SKY:
        case WEATHERCODES.MAINLY_CLEAR:
            return _isDay ? "clear-sky-theme" : "night-theme";

        case WEATHERCODES.PARTLY_CLOUDY:
            return _isDay ? "clear-sky-theme" : "night-theme";

        case WEATHERCODES.OVERCAST:
            return "grey-sky-theme";

        case WEATHERCODES.FOG:
        case WEATHERCODES.DEPOSITING_RIME_FOG:
            return "fog-theme";

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
            return "grey-sky-theme";

        case WEATHERCODES.SNOW_FALL_SLIGHT:
        case WEATHERCODES.SNOW_FALL_MODERATE:
        case WEATHERCODES.SNOW_FALL_HEAVY:
        case WEATHERCODES.SNOW_GRAINS:
            return "snow-theme";

        case WEATHERCODES.THUNDERSTORM:
        case WEATHERCODES.THUNDERSTORM_LIGHT_HAIL:
        case WEATHERCODES.THUNDERSTORM_HEAVY_HAIL:
            return "thunderous-theme";
        default:
            return "clear-sky-theme";
    }
}

function handleWeatherCardScroll(scrollRight: boolean, weatherCardsRef: RefObject<HTMLDivElement>) {
    const scrollLength = weatherCardsRef.current.scrollWidth;
    const currentContainerWidth = weatherCardsRef.current.clientWidth;
    const scrollOffset = (scrollLength - currentContainerWidth) * 0.5;
    if (scrollRight) {
        weatherCardsRef.current.scrollTo({
            left: weatherCardsRef.current.scrollLeft + scrollOffset,
            behavior: "smooth",
        });
    } else {
        weatherCardsRef.current.scrollTo({
            left: weatherCardsRef.current.scrollLeft - scrollOffset,
            behavior: "smooth",
        });
    }
}

//-------------------API FUNCTION CALLS------------------------
async function getLocationData(cityName: string) {
    try {
        const apiCall: IGeoAPIResponse = await window.mainProcess.getLocationData(cityName);
        if (apiCall != null) {
            const data = await apiCall.locations;

            return data;
        } else {
            console.log("city doesn't exist");
            return null;
        }
    } catch (error) {
        console.log("Node js Error with IPC main process probably crashed", error);
        return null;
    }
}
