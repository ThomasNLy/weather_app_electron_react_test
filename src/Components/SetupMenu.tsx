import { useState } from "react";
import LocationCard from "./LocationCard";
import { IGeoCoordinatesData } from "../typings";
import partlyCloudyDayIcon from "../assets/icons_160/partly_cloudy_day_160.png";
import SearchBar from "./SearchBar";
import "./SetUpMenu.css";
interface ISetupMenuProps {
    searchLocationCallBackFunction: (locationName: string) => Promise<IGeoCoordinatesData[] | null>;
    setDefaultLocationCallBackFunction: (locationGeoData: IGeoCoordinatesData) => void;
    setCurrentLocationCallBackFunction: (locationGeoData: IGeoCoordinatesData) => void;
    saveSelectedLocationToListCallBackFunction: (locationGeoData: IGeoCoordinatesData) => void;
}
export default function SetupMenu({
    searchLocationCallBackFunction,
    setDefaultLocationCallBackFunction,
    setCurrentLocationCallBackFunction,
    saveSelectedLocationToListCallBackFunction,
}: ISetupMenuProps) {
    const [locations, setLocations] = useState<IGeoCoordinatesData[] | null>(null);
    const handleSearchButtonOnClick = () => {
        if (locations != null) {
            setDefaultLocationCallBackFunction(locations[0]);
            setCurrentLocationCallBackFunction(locations[0]);
            saveSelectedLocationToListCallBackFunction(locations[0]);
        }
    };
    const handleSearchLocationFunction = async (locationName: string) => {
        const apiData: IGeoCoordinatesData[] | null =
            await searchLocationCallBackFunction(locationName);
        setLocations(apiData);
    };
    const handleSetAsDefaultLocationOnClick = (locationData: IGeoCoordinatesData) => {
        setDefaultLocationCallBackFunction(locationData);
        setCurrentLocationCallBackFunction(locationData);
        saveSelectedLocationToListCallBackFunction(locationData);
    };
    let locationCards =
        locations != null
            ? createLocationCards(locations, handleSetAsDefaultLocationOnClick)
            : null;
    return (
        <div className="setup-menu">
            <img
                className="setup-menu-icon"
                src={partlyCloudyDayIcon}
                alt="setup-menu-icon of a sun covered by a cloud"
            />
            <h1 className="setup-menu-header">Set Default Location</h1>
            <p>Enter your city to see the local weather forecast</p>
            <SearchBar
                handleSearchCallBackFunction={handleSearchLocationFunction}
                handleSearchButtonOnClickCallBackFunction={handleSearchButtonOnClick}
            />
            <div className="setup-menu-search-location-cards-container">{locationCards}</div>
        </div>
    );
}
function createLocationCards(
    locations: IGeoCoordinatesData[],
    handleSetAsDefaultLocationFunctionOnClick: (geoData: IGeoCoordinatesData) => void,
) {
    let locationCards = [];
    for (let i = 0; i < locations.length; i++) {
        let location = locations[i];
        locationCards.push(
            <LocationCard
                cityName={location.city}
                adminRegion={location.adminRegion}
                countryName={location.country}
                latitude={location.latitude}
                longitude={location.longitude}
                timezone={location.timezone}
                setCurrentLocationFunctionOnClick={handleSetAsDefaultLocationFunctionOnClick}
            />,
        );
    }
    return locationCards;
}
