/*
type definition for preload script to expose
the API to renderer process 
interface follows the api definition in preload.js
*/

interface IElectronAPI {
    getWeatherData: () => Promise<any>;
}

interface Window {
    mainProcess: IElectronAPI;
}
