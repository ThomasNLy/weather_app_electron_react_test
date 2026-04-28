import React, { useState } from "react";
import CityCard from "./CityCard";
import "./SavedCitiesMenu.css";
import { IGeoCoordinatesData } from "../typings";
import closeMenuButtonIcon from "../assets/button_icons/close_menu_button_icon.svg";
import trashButtonIcon from "../assets/button_icons/trash_can_pixel2.svg";

interface ISavedCitiesMenuProps {
    handleSetMenuOpenCallBackFunction: (newVal: boolean) => void;
    handleSetCurrentCityCallBackFunction: (geoCoordinatesData: IGeoCoordinatesData) => void;
    handleDeleteFromSavedCitiesListCallBackFunction: (cityGeoData: IGeoCoordinatesData) => void;
    handleSetDefaultCityCallBackFunction: (newDefaultCity: IGeoCoordinatesData) => void;
    savedCitiesList: IGeoCoordinatesData[];
    defaultCity: IGeoCoordinatesData;
}
export default function SavedCitiesMenu({
    handleSetMenuOpenCallBackFunction,
    handleSetCurrentCityCallBackFunction,
    handleDeleteFromSavedCitiesListCallBackFunction,
    handleSetDefaultCityCallBackFunction,
    savedCitiesList,
    defaultCity,
}: ISavedCitiesMenuProps) {
    const handleSetCurrentCityOnClick = (geoCoordinates: IGeoCoordinatesData) => {
        handleSetCurrentCityCallBackFunction(geoCoordinates);
        handleSetMenuOpenCallBackFunction(false);
    };

    let cityCards =
        savedCitiesList.length > 0 ? (
            createCityCards(
                defaultCity,
                savedCitiesList,
                handleSetCurrentCityOnClick,
                handleDeleteFromSavedCitiesListCallBackFunction,
                handleSetDefaultCityCallBackFunction,
            )
        ) : (
            <p className="no-city-found-text">no cities saved</p>
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
                <h1 className="saved-cities-menu-header">Locations</h1>
                <div className="city-list-container">{cityCards}</div>
            </div>
        </div>
    );
}

function createCityCards(
    defaultCity: IGeoCoordinatesData,
    locations: IGeoCoordinatesData[],
    handleSetCurrentCityFunction: (geoData: IGeoCoordinatesData) => void,
    handleDeleteFromSavedCitiesListFunction: (cityGeoData: IGeoCoordinatesData) => void,
    handleSetDefaultCityFunction: (newDefaultCity: IGeoCoordinatesData) => void,
) {
    let cityCards = [];
    for (let i = 0; i < locations.length; i++) {
        let city = locations[i];
        let isDefaultCity =
            city.latitude === defaultCity.latitude && city.longitude === defaultCity.longitude;
        console.log(isDefaultCity);
        cityCards.push(
            <div className="saved-city-card" key={`${city.latitude}_${city.longitude}`}>
                <CityCard
                    cityName={city.city}
                    adminRegion={city.adminRegion}
                    countryName={city.country}
                    latitude={city.latitude}
                    longitude={city.longitude}
                    setCurrentCityFunctionOnClick={handleSetCurrentCityFunction}
                />
                <button
                    type="button"
                    className={`button-svg-icon delete-city-button ${isDefaultCity ? "hide-delete-city-button" : ""}`}
                    onClick={() => handleSetDefaultCityFunction(city)}
                >
                    Set Default Location
                </button>
                <button
                    type="button"
                    className={`button-svg-icon delete-city-button ${isDefaultCity ? "hide-delete-city-button" : ""}`}
                    onClick={() => handleDeleteFromSavedCitiesListFunction(city)}
                >
                    <img src={trashButtonIcon} alt="trash button" />
                </button>
            </div>,
        );
    }
    return cityCards;
}
