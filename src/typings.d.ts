/*
type definition for preload script to expose
the API to renderer process 
interface follows the api definition in preload.js
sets it as a magical global type
*/
declare global {
    /**
     * @type {object} interface the window implements to allow usage of electron's api packages from renderer
     * exposed by the preload.ts script
     */
    interface IElectronAPI {
        /**
         * @property {Promise<IWeatherAPIResponse>} ```getWeatherData()``` - The promise object returned representing
         * api response status and weather data
         * @see {@link IGeoAPIResponse}
         * @return {IWeatherAPIResponse} JSON object with weather data and api status
         */
        getWeatherData: (latitude: number, longitude: number) => Promise<IWeatherAPIResponse>;
        /**
         * @property {Promise<IGeoAPIResponse>} ```getLocationData(string)``` - The promise object returned representing
         * api response an array of location data based on the city name argument passed as a string
         * @see {@link IGeoAPIResponse}
         * @return {IGeoAPIResponse} JSON object holding an array of JSON objects with location data
         */
        getLocationData: (cityName: string) => Promise<IGeoAPIResponse>;
    }

    //merging with built in Window interface with new property added
    interface Window {
        /**
         * @property {IElectronAPI} mainProcess - Represents the API for communicating with the main process from the renderer
         * @see {@link IElectronAPI}
         * @property ```IElectronAPI.getWeatherData()```
         */
        mainProcess: IElectronAPI;
    }
}

//-------Typing to be used throughout the project------

/**
 * @type {object} IWeatherData
 * @property {string} isDay - string representing if day or night
 * @property {number} utcOffSetSeconds - UTC time off set in seconds
 * @property {{temperature: string, percipitation: string}} units - units used for weather data
 * @property {number} currentApparentTemp - the current apparent temperature, "feels like"
 * @property {number} currentTemp - the current temperature
 * @property {number} currentWeatherCode - the current weather code
 * @property {string[]} forecastDays - dates of weather forecast
 * @property {number[]} weatherCode - weather codes for weather status
 * @property {number[]} dailyMaxTemp - array of daily max temperature
 * @property {number[]} dailyMinTemp - array of daily min temperature
 * @property {number[]} dailyApparentMaxTemp - array of daily max apparent temperature
 * @property {number[]} dailyApparentMinTemp - array of daily max apparent temperature
 * @property {number[]} percipitation - array of daily percipitation percentage
 */
export interface IWeatherData {
    isDay: boolean;
    utcOffSetSeconds: number;
    units: {
        temperature: string;
        precipitation: string;
    };
    currentApparentTemp: number;
    currentTemp: number;
    currentWeatherCode: number;
    forecastDays: string[];
    weatherCode: number[];
    dailyMaxTemp: number[];
    dailyMinTemp: number[];
    dailyMaxApparentTemp: number[];
    dailyMinApparentTemp: number[];
    precipitationChance: number[];
}

/**
 * Represents an api response for pulling weather data
 * serves as a contract for weather data related object variables
 * @type {object} IAPIResponse
 * @property {boolean} status - ```true``` if connection was made, ```false``` if connection failed
 * @property {IWeatherData} weatherData - JSON representation of the data recieved from the api call
 * @example
 * {
 *  status: true,
 *  weatherData: {
 *   isDay: "Day",
 *   units: {
        temperature: "°C";
        precipitation: "%";
    },
    forecastDays: [2026-01-02, 2026-01-02, ...],
    dailyMaxTemp: [9, 12, 5, ...],
    dailyMinTemp: number[1, 4, 2,...],
    precipitationChance: number[20, 10, 15,...],
 *  }
 * }
 *
 */
export interface IWeatherAPIResponse {
    status: boolean;
    weatherData: IWeatherData | null;
    message: string;
}

export interface IGeoAPIResponse {
    locations: ILocationData[] | null;
}
export interface ILocationData {
    city: string;
    adminRegion: string;
    country: string;
    latitude: number;
    longitude: number;
}
export interface IGeoCoordinatesData {
    latitude: number;
    longitude: number;
    cityName: string;
}
