import React, { useState, useCallback } from "react";
import LocationCard from "./LocationCard";
import "./SearchLocationMenu.css";
import { IGeoCoordinatesData } from "../typings";
import closeMenuButtonIcon from "../assets/button_icons/close_menu_button_icon.svg";
import searchButtonIcon from "../assets/button_icons/search_icon_black.svg";
import addButtonIcon from "../assets/button_icons/add_button_icon.svg";

interface ISearchLocationMenuProps {
    handleSetMenuOpenCallBackFunction: (newVal: boolean) => void;
    handleSearchLocationCallBackFunction: (
        cityName: string,
    ) => Promise<IGeoCoordinatesData[] | null>;
    handleSetCurrentLocationCallBackFunction: (geoData: IGeoCoordinatesData) => void;
    handleSaveSelectedCityToListCallBackFunction: (cityGeoData: IGeoCoordinatesData) => void;
}
export default function SearchLocationMenu({
    handleSetMenuOpenCallBackFunction,
    handleSearchLocationCallBackFunction,
    handleSetCurrentLocationCallBackFunction,
    handleSaveSelectedCityToListCallBackFunction,
}: ISearchLocationMenuProps) {
    const [locations, setLocations] = useState<IGeoCoordinatesData[] | null>(null);

    const handleCitySearchFunction = async (cityName: string) => {
        const apiData: IGeoCoordinatesData[] | null =
            await handleSearchLocationCallBackFunction(cityName);
        setLocations(apiData);
    };
    const handleSetCurrentLocationOnClick = (geoData: IGeoCoordinatesData) => {
        handleSetCurrentLocationCallBackFunction(geoData);
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
            handleSetCurrentLocationCallBackFunction(firstResultGeoData);
        }
    };

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleCitySearchFunction(e.target.value);
    }

    let locationCards =
        locations != null ? (
            createLocationCard(
                locations,
                handleSetCurrentLocationOnClick,
                handleSaveSelectedCityToListCallBackFunction,
            )
        ) : (
            <p className="no-city-found-text">no location found</p>
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
                            placeholder="Search for location"
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
                <div className="city-search-results-container">{locationCards}</div>
            </div>
        </div>
    );
}

function createLocationCard(
    locations: IGeoCoordinatesData[],
    handleSetCurrentLocationFunctionOnClick: (geoData: IGeoCoordinatesData) => void,
    handleSaveSelectedCityToListFunctionOnClick: (cityGeoData: IGeoCoordinatesData) => void,
) {
    let locationCards = [];
    for (let i = 0; i < locations.length; i++) {
        let city = locations[i];
        locationCards.push(
            <div className="search-city-card" key={`${city.latitude}_${city.longitude}`}>
                <LocationCard
                    cityName={city.city}
                    adminRegion={city.adminRegion}
                    countryName={city.country}
                    latitude={city.latitude}
                    longitude={city.longitude}
                    setCurrentLocationFunctionOnClick={handleSetCurrentLocationFunctionOnClick}
                />
                <button
                    type="button"
                    className="add-city-button"
                    onClick={() => {
                        handleSaveSelectedCityToListFunctionOnClick(city);
                        handleSetCurrentLocationFunctionOnClick(city);
                    }}
                >
                    <img src={addButtonIcon} alt="add button" />
                </button>
            </div>,
        );
    }
    return locationCards;
}
