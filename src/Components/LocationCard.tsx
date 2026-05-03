import React, { useState } from "react";
import { IGeoCoordinatesData } from "../typings";
import "./LocationCard.css";
interface ILocationCardProps {
    cityName: string;
    adminRegion: string;
    countryName: string;
    latitude: number;
    longitude: number;
    timezone: string;
    setCurrentLocationFunctionOnClick: (geoData: IGeoCoordinatesData) => void;
}

export default function LocationCard({
    cityName,
    adminRegion,
    countryName,
    latitude,
    longitude,
    timezone,
    setCurrentLocationFunctionOnClick,
}: ILocationCardProps) {
    let geoData: IGeoCoordinatesData = {
        latitude: latitude,
        longitude: longitude,
        city: cityName,
        adminRegion: adminRegion,
        country: countryName,
        timezone: timezone,
    };
    return (
        <div className="location-card" onClick={() => setCurrentLocationFunctionOnClick(geoData)}>
            <h1>{cityName}</h1>
            <p>{`${adminRegion}, ${countryName}`}</p>
        </div>
    );
}
