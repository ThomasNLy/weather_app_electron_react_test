// See the Electron documentation for details on how to use preload scripts:

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IGeoCoordinatesData } from "./typings";
contextBridge.exposeInMainWorld("mainProcess", {
    getWeatherData: (latitude: number, longitude: number) =>
        ipcRenderer.invoke("get-weather-data", latitude, longitude),
    getLocationData: (cityName: string) => ipcRenderer.invoke("get-location-data", cityName),
    getDefaultLocation: () => ipcRenderer.invoke("get-default-location"),
    setDefaultLocation: (newDefaultCity: IGeoCoordinatesData) =>
        ipcRenderer.send("set-default-location", newDefaultCity),
});
