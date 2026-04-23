import React, { useState } from "react";
import CityCard from "./CityCard";
import "./SavedCitiesMenu.css";
import { IGeoCoordinatesData } from "../typings";
import closeMenuButtonIcon from "../assets/button_icons/close_menu_button.svg";

interface ISavedCitiesMenuProps {
    handleSetMenuOpenCallBackFunction: (newVal: boolean) => void;
    handleSetCurrentCityCallBackFunction: (geoData: IGeoCoordinatesData) => void;
    savedCitiesList: IGeoCoordinatesData[];
}
export default function SavedCitiesMenu({
    handleSetMenuOpenCallBackFunction,
    handleSetCurrentCityCallBackFunction,
    savedCitiesList,
}: ISavedCitiesMenuProps) {
    const handleSetCurrentCityOnClick = (geoData: IGeoCoordinatesData) => {
        handleSetCurrentCityCallBackFunction(geoData);
        handleSetMenuOpenCallBackFunction(false);
    };
    let cityCards =
        savedCitiesList.length > 0 ? (
            createCityCards(savedCitiesList, handleSetCurrentCityOnClick)
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
                <h1>Locations</h1>
                <div className="city-list-container">{cityCards}</div>
            </div>
        </div>
    );
}

function createCityCards(
    locations: IGeoCoordinatesData[],
    handleSetCurrentCityFunction: (geoData: IGeoCoordinatesData) => void,
) {
    let cityCards = [];
    for (let i = 0; i < locations.length; i++) {
        let city = locations[i];
        cityCards.push(
            <CityCard
                cityName={city.city}
                adminRegion={city.adminRegion}
                countryName={city.country}
                latitude={city.latitude}
                longitude={city.longitude}
                setCurrentCityFunctionOnClick={handleSetCurrentCityFunction}
            />,
        );
    }
    return cityCards;
}
