import React, { useState } from "react";
import { IGeoCoordinatesData } from "../typings";
import "./CityCard.css";
interface ICityCardProps {
    cityName: string;
    adminRegion: string;
    countryName: string;
    latitude: number;
    longitude: number;
    setCurrentCityFunctionOnClick: (geoData: IGeoCoordinatesData) => void;
}

export default function CityCard({
    cityName,
    adminRegion,
    countryName,
    latitude,
    longitude,
    setCurrentCityFunctionOnClick,
}: ICityCardProps) {
    let geoData: IGeoCoordinatesData = {
        latitude: latitude,
        longitude: longitude,
        city: cityName,
        adminRegion: adminRegion,
        country: countryName,
    };
    return (
        <div className="city-card" onClick={() => setCurrentCityFunctionOnClick(geoData)}>
            <h1>{cityName}</h1>
            <p>{`${adminRegion}, ${countryName}`}</p>
        </div>
    );
}
