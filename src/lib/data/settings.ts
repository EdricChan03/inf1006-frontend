import { persisted } from 'svelte-persisted-store';

export interface Settings {
  intervalMs: number;
  maxSensorPoints: number;
}

export const defaultSettings: Settings = {
  intervalMs: 3000,
  maxSensorPoints: 30
};

const clampSettings = (s: Settings): Settings => ({
  intervalMs: Math.max(s.intervalMs, 3000),
  maxSensorPoints: Math.max(s.maxSensorPoints, 30)
});

export const settingsKey = 'water:settings';
export const settings = persisted<Settings>(settingsKey, defaultSettings, {
  beforeWrite: clampSettings,
  beforeRead: clampSettings
});

export const hasNoSettings = (settings: Settings) => Object.keys(settings).length === 0;

export const settingsOrDefault = (settings: Settings) =>
  hasNoSettings(settings) ? defaultSettings : settings;
