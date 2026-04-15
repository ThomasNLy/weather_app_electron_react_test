import React, { useState } from "react";
import { ILocationData } from "../typings";
import "./CityCard.css";
interface ICityCardProps {
    cityName: string;
    countryName: string;
    latitude: number;
    longitude: number;
}

export default function CityCard({ cityName, countryName, longitude, latitude }: ICityCardProps) {
    let test = (a, b) => {};
    return (
        <div className="city-card">
            <h1>City Name</h1>
            <h2>Country Name</h2>
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
