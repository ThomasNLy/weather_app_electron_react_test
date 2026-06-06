import React, { Dispatch, SetStateAction, useState } from "react";
import "./SearchLocationMenu.css";
import { IGeoCoordinatesData } from "../typings";
import closeMenuButtonIcon from "../assets/button_icons/close_menu_button_icon.svg";
import addButtonIcon from "../assets/button_icons/add_button_icon.svg";
import LocationCard from "./LocationCard";
import SearchBar from "./SearchBar";
import PopUpMessageBox from "./PopUpMessageBox";
interface ISearchLocationMenuProps {
    handleSetMenuOpenCallBackFunction: (newVal: boolean) => void;
    handleSearchLocationCallBackFunction: (
        locationName: string,
    ) => Promise<IGeoCoordinatesData[] | null>;
    handleSetCurrentLocationCallBackFunction: (geoData: IGeoCoordinatesData) => void;
    handleSaveSelectedLocationToListCallBackFunction: (
        locationGeoData: IGeoCoordinatesData,
    ) => void;
    maxNumSavedLocations: number;
    currentSavedLocationsList: IGeoCoordinatesData[];
}
export default function SearchLocationMenu({
    handleSetMenuOpenCallBackFunction,
    handleSearchLocationCallBackFunction,
    handleSetCurrentLocationCallBackFunction,
    handleSaveSelectedLocationToListCallBackFunction,
    maxNumSavedLocations,
    currentSavedLocationsList,
}: ISearchLocationMenuProps) {
    const [locations, setLocations] = useState<IGeoCoordinatesData[] | null>(null);
    const [showMaxLocationsPopUp, setShowMaxLocationsPopUp] = useState<boolean>(false);
    const handleLocationSearchFunction = async (locationName: string) => {
        const apiData: IGeoCoordinatesData[] | null =
            await handleSearchLocationCallBackFunction(locationName);
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
                timeZone: locations[0].timeZone,
            };
            handleSetCurrentLocationCallBackFunction(firstResultGeoData);
        }
    };

    let locationCards =
        locations != null ? (
            createLocationCard(
                locations,
                handleSetCurrentLocationOnClick,
                handleSaveSelectedLocationToListCallBackFunction,
                maxNumSavedLocations,
                currentSavedLocationsList,
                setShowMaxLocationsPopUp,
            )
        ) : (
            <p className="no-location-found-text">no location found</p>
        );
    console.log("pop up state", showMaxLocationsPopUp);
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
                <SearchBar
                    handleSearchButtonOnClickCallBackFunction={handleSearchButtonOnClick}
                    handleSearchCallBackFunction={handleLocationSearchFunction}
                />
                <div className="location-search-results-container">{locationCards}</div>
                {showMaxLocationsPopUp ? (
                    <PopUpMessageBox
                        message="Couldn’t add any more locations, 
                            remove others to add new ones"
                        handleClosePopUpCallBackFunction={() => {
                            setShowMaxLocationsPopUp(false);
                        }}
                    />
                ) : null}
                <PopUpMessageBox
                    message="Couldn’t add any more locations, 
                            remove others to add new ones"
                    handleClosePopUpCallBackFunction={() => {
                        setShowMaxLocationsPopUp(false);
                    }}
                />
            </div>
        </div>
    );
}

function createLocationCard(
    locations: IGeoCoordinatesData[],
    handleSetCurrentLocationFunctionOnClick: (geoData: IGeoCoordinatesData) => void,
    handleSaveSelectedLocationToListFunctionOnClick: (locationGeoData: IGeoCoordinatesData) => void,
    _maxNumSavedLocations: number,
    _currentSavedLocationsList: IGeoCoordinatesData[],
    setShowMaxLocationsPopUpStateHook: Dispatch<SetStateAction<boolean>>,
) {
    let locationCards = [];
    for (let i = 0; i < locations.length; i++) {
        let location = locations[i];
        locationCards.push(
            <div
                className="search-location-card"
                key={`${location.latitude}_${location.longitude}`}
            >
                <LocationCard
                    cityName={location.city}
                    adminRegion={location.adminRegion}
                    countryName={location.country}
                    latitude={location.latitude}
                    longitude={location.longitude}
                    timeZone={location.timeZone}
                    setCurrentLocationFunctionOnClick={handleSetCurrentLocationFunctionOnClick}
                />
                <button
                    type="button"
                    className="add-location-button"
                    onClick={() => {
                        if (_currentSavedLocationsList.length < _maxNumSavedLocations) {
                            handleSaveSelectedLocationToListFunctionOnClick(location);
                            handleSetCurrentLocationFunctionOnClick(location);
                        } else {
                            setShowMaxLocationsPopUpStateHook(true);
                        }
                    }}
                >
                    <img src={addButtonIcon} alt="add button" />
                </button>
            </div>,
        );
    }
    return locationCards;
}
