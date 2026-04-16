// See the Electron documentation for details on how to use preload scripts:

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("mainProcess", {
    getWeatherData: (latitude: number, longitude: number) =>
        ipcRenderer.invoke("get-weather-data", latitude, longitude),
    getLocationData: (cityName: string) => ipcRenderer.invoke("get-location-data", cityName),
});
