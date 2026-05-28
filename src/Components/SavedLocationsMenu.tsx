import React, { useState } from "react";
import LocationCard from "./LocationCard";
import "./SavedLocationsMenu.css";
import { IGeoCoordinatesData } from "../typings";
import closeMenuButtonIcon from "../assets/button_icons/close_menu_button_icon.svg";
import trashButtonIcon from "../assets/button_icons/trash_can_pixel2.svg";

interface ISavedLocationsMenuProps {
    handleSetMenuOpenCallBackFunction: (newVal: boolean) => void;
    handleSetCurrentLocationCallBackFunction: (geoCoordinatesData: IGeoCoordinatesData) => void;
    handleDeleteFromSavedLocationsListCallBackFunction: (
        locationGeoData: IGeoCoordinatesData,
    ) => void;
    handleSetDefaultLocationCallBackFunction: (newDefaultLocation: IGeoCoordinatesData) => void;
    savedLocationsList: IGeoCoordinatesData[];
    defaultLocation: IGeoCoordinatesData;
}
export default function SavedLocationsMenu({
    handleSetMenuOpenCallBackFunction,
    handleSetCurrentLocationCallBackFunction,
    handleDeleteFromSavedLocationsListCallBackFunction,
    handleSetDefaultLocationCallBackFunction,
    savedLocationsList,
    defaultLocation,
}: ISavedLocationsMenuProps) {
    const handleSetCurrentLocationOnClick = (geoCoordinates: IGeoCoordinatesData) => {
        handleSetCurrentLocationCallBackFunction(geoCoordinates);
        handleSetMenuOpenCallBackFunction(false);
    };

    let locationCardss =
        savedLocationsList.length > 0 ? (
            createLocationCards(
                defaultLocation,
                savedLocationsList,
                handleSetCurrentLocationOnClick,
                handleDeleteFromSavedLocationsListCallBackFunction,
                handleSetDefaultLocationCallBackFunction,
            )
        ) : (
            <p className="no-location-found-text">no locations saved</p>
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
                <h1 className="saved-locations-menu-header">Locations</h1>
                <div className="location-list-container">{locationCardss}</div>
            </div>
        </div>
    );
}

function createLocationCards(
    defaultLocation: IGeoCoordinatesData,
    locations: IGeoCoordinatesData[],
    handleSetCurrentLocationFunction: (geoData: IGeoCoordinatesData) => void,
    handleDeleteFromSavedLocationsListFunction: (locationGeoData: IGeoCoordinatesData) => void,
    handleSetDefaultLocationFunction: (newDefaultLocation: IGeoCoordinatesData) => void,
) {
    let locationCards = [];
    for (let i = 0; i < locations.length; i++) {
        let location = locations[i];
        let isDefaultLocation =
            location.latitude === defaultLocation.latitude &&
            location.longitude === defaultLocation.longitude;

        locationCards.push(
            <div className="saved-location-card" key={`${location.latitude}_${location.longitude}`}>
                <LocationCard
                    cityName={location.city}
                    adminRegion={location.adminRegion}
                    countryName={location.country}
                    latitude={location.latitude}
                    longitude={location.longitude}
                    timeZone={location.timeZone}
                    setCurrentLocationFunctionOnClick={handleSetCurrentLocationFunction}
                />
                <button
                    type="button"
                    className={`button-svg-icon set-default-loc-button saved-loc-button ${isDefaultLocation ? "hide-saved-loc-menu-button" : ""}`}
                    onClick={() => handleSetDefaultLocationFunction(location)}
                >
                    Set as default
                </button>
                <button
                    type="button"
                    className={`button-svg-icon delete-loc-button saved-loc-button ${isDefaultLocation ? "hide-saved-loc-menu-button" : ""}`}
                    onClick={() => handleDeleteFromSavedLocationsListFunction(location)}
                >
                    <img src={trashButtonIcon} alt="trash button" />
                </button>
            </div>,
        );
    }
    return locationCards;
}
