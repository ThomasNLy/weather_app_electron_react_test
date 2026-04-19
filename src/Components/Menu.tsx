import React, { useState, useCallback } from "react";
import CityCard from "./CityCard";
import "./Menu.css";
import { ILocationData, IGeoCoordinatesData } from "../typings";
import closeMenuButtonIcon from "../assets/close_menu_button.svg";
interface IMenuProps {
    handleCloseMenuFunction: (newVal: boolean) => void;
    handleSearchCityFunction: (cityName: string) => Promise<ILocationData[] | null>;
    handleSetCurrentCityFunction: (geoData: IGeoCoordinatesData) => void;
}
export default function Menu({
    handleCloseMenuFunction,
    handleSearchCityFunction,
    handleSetCurrentCityFunction,
}: IMenuProps) {
    const [locations, setLocations] = useState<ILocationData[] | null>(null);

    const handleCitySearchFunction = useCallback(async (cityName: string) => {
        const apiData: ILocationData[] | null = await handleSearchCityFunction(cityName);
        setLocations(apiData);
    }, []);

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleCitySearchFunction(e.target.value);
    }

    let cityCards =
        locations != null ? (
            createCityCards(locations, handleSetCurrentCityFunction)
        ) : (
            <p>no city found</p>
        );

    return (
        <div className="menu-overlay">
            <div className="menu">
                <button
                    className="close-menu-button"
                    type="button"
                    onClick={() => {
                        handleCloseMenuFunction(false);
                    }}
                >
                    <img src={closeMenuButtonIcon} alt="close menu button" />
                </button>
                <div className="search-bar">
                    <label htmlFor="city-search" className="hide-visually"></label>
                    <input type="search" name="q" id="city-search" onChange={handleOnChange} />
                    <button type="submit">search</button>
                </div>
                <div className="city-search-results-container">{cityCards}</div>
            </div>
        </div>
    );
}

function createCityCards(
    locations: ILocationData[],
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
                setCurrentCityFunction={handleSetCurrentCityFunction}
            />,
        );
    }
    return cityCards;
}
