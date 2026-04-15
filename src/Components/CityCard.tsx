import React, { useState } from "react";
import { ILocationData } from "../typings";
import "./CityCard.css";
interface ICityCardProps {
    cityName: string;
    adminRegion: string;
    countryName: string;
    latitude: number;
    longitude: number;
    setCurrentCityFunction: (latitude: number, longitude: number) => void;
}

export default function CityCard({
    cityName,
    adminRegion,
    countryName,
    latitude,
    longitude,
    setCurrentCityFunction,
}: ICityCardProps) {
    return (
        <div className="city-card" onClick={() => setCurrentCityFunction(latitude, longitude)}>
            <h1>{cityName}</h1>
            <p>{`${adminRegion}, ${countryName}`}</p>
        </div>
    );
}

/**
 * returns geo data, latitude and longitude to add city and
 * get weather data about it
 */
function handleOnClick(callBackFunction: (latitude: number, longitude: number) => void) {
    //some function that
    // gets passed as prop here from app.tsx to use
    // the latitude and longitude data
}
