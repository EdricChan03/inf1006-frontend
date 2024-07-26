import { get, writable } from 'svelte/store';
import { settings } from './settings';

export const temperatureSensor = writable<number[]>([]);
export const humiditySensor = writable<number[]>([]);

export const addTemperature = (
  tempCelsius: number,
  maxSensorPoints: number = get(settings).maxSensorPoints
) => {
  temperatureSensor.update((arr) => {
    if (arr.length > maxSensorPoints) arr.shift();

    return [...arr, tempCelsius];
  });
};

export const addHumidity = (
  humidity: number,
  maxSensorPoints: number = get(settings).maxSensorPoints
) => {
  humiditySensor.update((arr) => {
    if (arr.length > maxSensorPoints) arr.shift();

    return [...arr, humidity];
  });
};
