import React, { FC, Fragment, useEffect, useState, useRef, useCallback, RefObject } from "react";
import { createRoot } from "react-dom/client";

import WeatherCard from "./Components/WeatherCard";
import CurrentDayWeatherBanner from "./Components/CurrentDayWeatherBanner";
import PrecipitationCard from "./Components/PrecipitationCard";

import "./app.css";
import { IGeoAPIResponse, IGeoCoordinatesData, IWeatherAPIResponse, IWeatherData } from "./typings";
import {
    WEATHERCODES,
    ISOFormatTimeZoneOffset,
    getCurrentDateInTimeZone,
    getCurrentTimeInTimeZone,
} from "./utilities";
import loadingScreenIcon from "./assets/icons_160/partly_cloudy_day_160.png";
import buttonLeftIcon from "./assets/button_icons/button_left.svg";
import buttonRightIcon from "./assets/button_icons/button_right.svg";
import refreshButtonIcon from "./assets/button_icons/refresh_button_icon.svg";
import searchMenuButtonIcon from "./assets/button_icons/search_icon_white.svg";
import savedLocationsMenuButtonIcon from "./assets/button_icons/location_icon_white.svg";
import SearchLocationMenu from "./Components/SearchLocationMenu";
import SavedLocationsMenu from "./Components/SavedLocationsMenu";
import SetupMenu from "./Components/SetupMenu";
const root = createRoot(document.body);
root.render(<App />);

function App() {
    // console.log("Width: " + window.innerWidth);
    // console.log("Height: " + window.innerHeight);
    const [isSettingUp, setIsSettingUp] = useState<boolean>(true);
    const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // fake loading screen for UX

    const [defaultLocation, setDefaultLocation] = useState<IGeoCoordinatesData>();
    const [currentLocationGeoData, setCurrentLocationGeoData] =
        useState<IGeoCoordinatesData | null>();
    const [savedLocationsDataList, setSavedLocationsDataList] = useState<IGeoCoordinatesData[]>([]);
    const [searchLocationMenuOpen, setSearchLocationMenuOpen] = useState<boolean>(false);
    const [savedLocationsMenuOpen, setSavedLocationsMenuOpen] = useState<boolean>(false);

    const [currentDate, setCurrentDate] = useState<string>("");
    const weatherCardContainerRef = useRef<HTMLDivElement>(null);

    const savedLocationsDataListCapacity = 5;

    let initApp = async () => {
        const defaultLocation = await window.mainProcess.getDefaultLocation();
        const savedLocations = await window.mainProcess.getListOfSavedLocations();
        setCurrentLocationGeoData(defaultLocation);
        setSavedLocationsDataList(savedLocations);
        setDefaultLocation(defaultLocation);
        setIsSettingUp(false);
    };

    useEffect(() => {
        initApp();
    }, []);

    useEffect(() => {
        if (isSettingUp) return;
        setCurrentDate(getCurrentDateInTimeZone(currentLocationGeoData!.timeZone));
        const apiCall: Promise<IWeatherAPIResponse> = window.mainProcess.getWeatherData(
            currentLocationGeoData!.latitude,
            currentLocationGeoData!.longitude,
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
    }, [currentLocationGeoData, isSettingUp]);

    //------------------midnight refresh to pull new weather data----------
    useEffect(() => {
        if (isSettingUp) return;

        const now = getCurrentTimeInTimeZone(currentLocationGeoData!.timeZone);
        const midnight = new Date(now).setHours(24, 0, 0, 0);
        const diff = midnight - now.getTime();
        const timeOut = setTimeout(() => {
            handleRefreshFunction();
        }, diff);

        return () => clearTimeout(timeOut);
    }, [currentDate, currentLocationGeoData]);

    //------------------------set current location function-----------------------
    const handleSetCurrentLocationFunction = useCallback(
        (geoCoordinatesData: IGeoCoordinatesData) => {
            let locationGeoData: IGeoCoordinatesData = {
                city: geoCoordinatesData.city,
                adminRegion: geoCoordinatesData.adminRegion,
                country: geoCoordinatesData.country,
                latitude: geoCoordinatesData.latitude,
                longitude: geoCoordinatesData.longitude,
                timeZone: geoCoordinatesData.timeZone,
            };

            setCurrentLocationGeoData(locationGeoData);

            setIsLoading(true);
        },
        [],
    );

    const handleRefreshFunction = useCallback(() => {
        setIsLoading(true);

        const apiCall: Promise<IWeatherAPIResponse> = window.mainProcess.getWeatherData(
            currentLocationGeoData!.latitude,
            currentLocationGeoData!.longitude,
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
        setCurrentDate(getCurrentDateInTimeZone(currentLocationGeoData!.timeZone));
    }, [currentLocationGeoData]);
    //---------------------add to list of saved locations function-------------------------
    function addNewLocationToSavedLocationsList(newLocationGeoData: IGeoCoordinatesData) {
        setSavedLocationsDataList((currentList) => {
            let notInList = true;
            currentList.some((locationData) => {
                if (
                    locationData.latitude === newLocationGeoData.latitude &&
                    locationData.longitude === newLocationGeoData.longitude
                ) {
                    notInList = false;
                }
            });
            if (notInList && currentList.length < savedLocationsDataListCapacity) {
                window.mainProcess.setListOfSavedLocations([...currentList, newLocationGeoData]);
                return [...currentList, newLocationGeoData];
            } else {
                return currentList;
            }
        });
    }

    //--------------delete location from list of saved locations----------------
    function deleteSelectLocationFromSavedLocationsList(locationGeoData: IGeoCoordinatesData) {
        const newList = savedLocationsDataList.filter((_locationGeoData: IGeoCoordinatesData) => {
            if (
                _locationGeoData.latitude === locationGeoData.latitude &&
                _locationGeoData.longitude === locationGeoData.longitude
            ) {
                return false; //if false remove from list
            } else {
                return true; //true means keep
            }
        });
        window.mainProcess.setListOfSavedLocations(newList);
        setSavedLocationsDataList(newList);
    }

    //--------------------set default location--------------
    const handleSetDefaultLocationFunction = useCallback(
        (newDefaultLocation: IGeoCoordinatesData) => {
            setDefaultLocation(newDefaultLocation);
            window.mainProcess.setDefaultLocation(newDefaultLocation);
        },
        [],
    );

    //----------------------menu components----------------------------------------------
    function currentMenu() {
        if (searchLocationMenuOpen) {
            return (
                <SearchLocationMenu
                    handleSetMenuOpenCallBackFunction={setSearchLocationMenuOpen}
                    handleSearchLocationCallBackFunction={getLocationData}
                    handleSetCurrentLocationCallBackFunction={handleSetCurrentLocationFunction}
                    handleSaveSelectedLocationToListCallBackFunction={
                        addNewLocationToSavedLocationsList
                    }
                />
            );
        } else if (savedLocationsMenuOpen) {
            return (
                <SavedLocationsMenu
                    handleSetMenuOpenCallBackFunction={setSavedLocationsMenuOpen}
                    handleSetCurrentLocationCallBackFunction={handleSetCurrentLocationFunction}
                    handleDeleteFromSavedLocationsListCallBackFunction={
                        deleteSelectLocationFromSavedLocationsList
                    }
                    handleSetDefaultLocationCallBackFunction={handleSetDefaultLocationFunction}
                    savedLocationsList={savedLocationsDataList}
                    defaultLocation={defaultLocation!}
                />
            );
        } else {
            return (
                <div className="menu-buttons-container">
                    <button className="menu-button" onClick={() => setSearchLocationMenuOpen(true)}>
                        <img
                            className="button-svg-icon"
                            src={searchMenuButtonIcon}
                            alt="search menu button"
                        />
                    </button>
                    <button className="menu-button" onClick={() => setSavedLocationsMenuOpen(true)}>
                        <img
                            className="button-svg-icon"
                            src={savedLocationsMenuButtonIcon}
                            alt="saved locations menu button"
                        />
                    </button>
                </div>
            );
        }
    }
    //----------------------------------------
    if (defaultLocation === undefined || savedLocationsDataList.length < 1) {
        return (
            <SetupMenu
                searchLocationCallBackFunction={getLocationData}
                setCurrentLocationCallBackFunction={handleSetCurrentLocationFunction}
                setDefaultLocationCallBackFunction={handleSetDefaultLocationFunction}
                saveSelectedLocationToListCallBackFunction={addNewLocationToSavedLocationsList}
            />
        );
    }

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
        let menu = currentMenu();
        return (
            <div className={`app-container ${theme}`}>
                {menu}
                <button className="refresh-button" onClick={handleRefreshFunction}>
                    <img className="button-svg-icon" src={refreshButtonIcon} alt="refresh button" />
                </button>
                <div className="app-main-content">
                    <h1 className="current-location-header content-header">
                        {`${currentLocationGeoData!.city}, ${currentLocationGeoData!.country}`}
                    </h1>
                    <CurrentDayWeatherBanner
                        unit={weatherData!.units.temperature}
                        minTemp={currentWeatherData.minTemp}
                        apparentTemp={currentWeatherData.apparentTemp}
                        currentTemp={currentWeatherData.currentTemp}
                        weatherCode={currentWeatherData.weatherCode}
                        isDay={currentWeatherData.isDay}
                        date={weatherData!.forecastDays[0]}
                        timeZone={currentLocationGeoData?.timeZone}
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
    // let UTCTimeZoneOffset: string = ISOFormatTimeZoneOffset(
    //     Math.trunc(_weatherData.utcOffSetSeconds / 3600),
    // );

    for (let i = 0; i < _weatherData.forecastDays.length; i++) {
        //ISO format is not used at all as it messes with weather app getting date to
        // let ISOFormat = `${_weatherData.forecastDays[i]}T00:00:00${UTCTimeZoneOffset}`;
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

    for (let i = 0; i < _weatherData.forecastDays.length; i++) {
        let calendarDate = _weatherData.forecastDays[i];

        let day = new Date(calendarDate);

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
async function getLocationData(locationName: string) {
    try {
        const apiCall: IGeoAPIResponse = await window.mainProcess.getLocationData(locationName);
        if (apiCall != null) {
            const data = await apiCall.locations;

            return data;
        } else {
            console.log("location doesn't exist");
            return null;
        }
    } catch (error) {
        console.log("Node js Error with IPC main process probably crashed", error);
        return null;
    }
}
