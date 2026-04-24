import React, { useState, useCallback } from "react";
import CityCard from "./CityCard";
import "./SearchCityMenu.css";
import { IGeoCoordinatesData } from "../typings";
import closeMenuButtonIcon from "../assets/button_icons/close_menu_button_icon.svg";
import searchButtonIcon from "../assets/button_icons/search_icon_black.svg";
import addButtonIcon from "../assets/button_icons/add_button_icon.svg";

interface ISearchCityMenuProps {
    handleSetMenuOpenCallBackFunction: (newVal: boolean) => void;
    handleSearchCityCallBackFunction: (cityName: string) => Promise<IGeoCoordinatesData[] | null>;
    handleSetCurrentCityCallBackFunction: (geoData: IGeoCoordinatesData) => void;
    handleSaveSelectedCityToListCallBackFunction: (cityGeoData: IGeoCoordinatesData) => void;
}
export default function SearchCityMenu({
    handleSetMenuOpenCallBackFunction,
    handleSearchCityCallBackFunction,
    handleSetCurrentCityCallBackFunction,
    handleSaveSelectedCityToListCallBackFunction,
}: ISearchCityMenuProps) {
    const [locations, setLocations] = useState<IGeoCoordinatesData[] | null>(null);

    const handleCitySearchFunction = async (cityName: string) => {
        const apiData: IGeoCoordinatesData[] | null =
            await handleSearchCityCallBackFunction(cityName);
        setLocations(apiData);
    };
    const handleSetCurrentCityOnClick = (geoData: IGeoCoordinatesData) => {
        handleSetCurrentCityCallBackFunction(geoData);
        handleSetMenuOpenCallBackFunction(false);
    };

    const handleSearchButtonOnClick = () => {
        if (locations !== null) {
            let firstResultGeoData: IGeoCoordinatesData = {
                city: locations[0].city,
                adminRegion: locations[0].adminRegion,
                country: locations[0].country,
                latitude: locations[0].latitude,
                longitude: locations[0].longitude,
            };
            handleSetCurrentCityCallBackFunction(firstResultGeoData);
        }
    };

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleCitySearchFunction(e.target.value);
    }

    let cityCards =
        locations != null ? (
            createCityCards(
                locations,
                handleSetCurrentCityOnClick,
                handleSaveSelectedCityToListCallBackFunction,
            )
        ) : (
            <p className="no-city-found-text">no city found</p>
        );

    return (
        <div className="menu-overlay">
            <div className="menu">
                <button
                    className="close-menu-button"
                    type="button"
                    onClick={() => {
                        handleSetMenuOpenCallBackFunction(false);
                    }}
                >
                    <img src={closeMenuButtonIcon} alt="close menu button" />
                </button>
                <div className="search-bar-container">
                    <label htmlFor="city-search" className="hide-visually"></label>
                    <div className="search-bar">
                        <input
                            type="search"
                            name="q"
                            id="city-search"
                            placeholder="Search for City"
                            onChange={handleOnChange}
                        />
                        <button type="submit" onClick={handleSearchButtonOnClick}>
                            <img
                                className="search-button-svg-icon"
                                src={searchButtonIcon}
                                alt="search button"
                            />
                        </button>
                    </div>
                </div>
                <div className="city-search-results-container">{cityCards}</div>
            </div>
        </div>
    );
}

function createCityCards(
    locations: IGeoCoordinatesData[],
    handleSetCurrentCityFunctionOnClick: (geoData: IGeoCoordinatesData) => void,
    handleSaveSelectedCityToListFunctionOnClick: (cityGeoData: IGeoCoordinatesData) => void,
) {
    let cityCards = [];
    for (let i = 0; i < locations.length; i++) {
        let city = locations[i];
        cityCards.push(
            <div className="search-city-card">
                <CityCard
                    key={`${city.latitude}_${city.longitude}`}
                    cityName={city.city}
                    adminRegion={city.adminRegion}
                    countryName={city.country}
                    latitude={city.latitude}
                    longitude={city.longitude}
                    setCurrentCityFunctionOnClick={handleSetCurrentCityFunctionOnClick}
                />
                <button
                    type="button"
                    className="add-city-button"
                    onClick={() => {
                        handleSaveSelectedCityToListFunctionOnClick(city);
                        handleSetCurrentCityFunctionOnClick(city);
                    }}
                >
                    <img src={addButtonIcon} alt="add button" />
                </button>
            </div>,
        );
    }
    return cityCards;
}
