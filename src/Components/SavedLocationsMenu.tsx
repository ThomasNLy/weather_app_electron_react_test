import React, { useState } from "react";
import LocationCard from "./LocationCard";
import "./SavedLocationsMenu.css";
import { IGeoCoordinatesData } from "../typings";
import closeMenuButtonIcon from "../assets/button_icons/close_menu_button_icon.svg";
import trashButtonIcon from "../assets/button_icons/trash_can_pixel2.svg";

interface ISavedLocationsMenuProps {
    handleSetMenuOpenCallBackFunction: (newVal: boolean) => void;
    handleSetCurrentLocationCallBackFunction: (geoCoordinatesData: IGeoCoordinatesData) => void;
    handleDeleteFromSavedCitiesListCallBackFunction: (cityGeoData: IGeoCoordinatesData) => void;
    handleSetDefaultLocationCallBackFunction: (newDefaultLocation: IGeoCoordinatesData) => void;
    savedCitiesList: IGeoCoordinatesData[];
    defaultLocation: IGeoCoordinatesData;
}
export default function SavedLocationsMenu({
    handleSetMenuOpenCallBackFunction,
    handleSetCurrentLocationCallBackFunction,
    handleDeleteFromSavedCitiesListCallBackFunction,
    handleSetDefaultLocationCallBackFunction,
    savedCitiesList,
    defaultLocation,
}: ISavedLocationsMenuProps) {
    const handleSetCurrentLocationOnClick = (geoCoordinates: IGeoCoordinatesData) => {
        handleSetCurrentLocationCallBackFunction(geoCoordinates);
        handleSetMenuOpenCallBackFunction(false);
    };

    let locationCardss =
        savedCitiesList.length > 0 ? (
            createLocationCards(
                defaultLocation,
                savedCitiesList,
                handleSetCurrentLocationOnClick,
                handleDeleteFromSavedCitiesListCallBackFunction,
                handleSetDefaultLocationCallBackFunction,
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
                <div className="city-list-container">{locationCardss}</div>
            </div>
        </div>
    );
}

function createLocationCards(
    defaultLocation: IGeoCoordinatesData,
    locations: IGeoCoordinatesData[],
    handleSetCurrentLocationFunction: (geoData: IGeoCoordinatesData) => void,
    handleDeleteFromSavedCitiesListFunction: (cityGeoData: IGeoCoordinatesData) => void,
    handleSetDefaultLocationFunction: (newDefaultLocation: IGeoCoordinatesData) => void,
) {
    let locationCards = [];
    for (let i = 0; i < locations.length; i++) {
        let city = locations[i];
        let isDefaultLocation =
            city.latitude === defaultLocation.latitude &&
            city.longitude === defaultLocation.longitude;
        console.log(isDefaultLocation);
        locationCards.push(
            <div className="saved-city-card" key={`${city.latitude}_${city.longitude}`}>
                <LocationCard
                    cityName={city.city}
                    adminRegion={city.adminRegion}
                    countryName={city.country}
                    latitude={city.latitude}
                    longitude={city.longitude}
                    setCurrentLocationFunctionOnClick={handleSetCurrentLocationFunction}
                />
                <button
                    type="button"
                    className={`button-svg-icon set-default-loc-button saved-loc-button ${isDefaultLocation ? "hide-saved-loc-menu-button" : ""}`}
                    onClick={() => handleSetDefaultLocationFunction(city)}
                >
                    Set Default Location
                </button>
                <button
                    type="button"
                    className={`button-svg-icon delete-loc-button saved-loc-button ${isDefaultLocation ? "hide-saved-loc-menu-button" : ""}`}
                    onClick={() => handleDeleteFromSavedCitiesListFunction(city)}
                >
                    <img src={trashButtonIcon} alt="trash button" />
                </button>
            </div>,
        );
    }
    return locationCards;
}
