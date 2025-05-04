import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
export const STORAGE_KEYS = {
  SETTINGS: 'habitTracker.settings'
};

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface ColorPreset {
  primary: string;
  accent: string;
}

export const COLOR_PRESETS: Record<string, ColorPreset> = {
  BLUE: { primary: '#3B82F6', accent: '#8B5CF6' },
  RED: { primary: '#EF4444', accent: '#F87171' },
  GREEN: { primary: '#10B981', accent: '#6EE7B7' },
  PURPLE: { primary: '#8B5CF6', accent: '#A78BFA' },
};

// Types
export interface Settings {
  themeMode: ThemeMode;
  primaryColor: string;
  accentColor: string;
  fontScale: number;
  visibleSections: {
    stats: boolean;
    chart: boolean;
    history: boolean;
    timeComparison: boolean;
  }
}

type SettingsAction = 
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'UPDATE_VISIBILITY'; payload: keyof Settings['visibleSections'] }
  | { type: 'APPLY_COLOR_PRESET'; payload: ColorPreset }
  | { type: 'RESET_TO_DEFAULT' };

// Default settings
export const defaultSettings: Settings = {
  themeMode: ThemeMode.DARK,
  primaryColor: COLOR_PRESETS.BLUE.primary,
  accentColor: COLOR_PRESETS.BLUE.accent,
  fontScale: 1.0,
  visibleSections: {
    stats: true,
    chart: true,
    history: true,
    timeComparison: true,
  }
};

// Reducer
const settingsReducer = (state: Settings, action: SettingsAction): Settings => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload };
    case 'UPDATE_VISIBILITY':
      return {
        ...state,
        visibleSections: {
          ...state.visibleSections,
          [action.payload]: !state.visibleSections[action.payload as keyof Settings['visibleSections']]
        }
      };
    case 'APPLY_COLOR_PRESET':
      return {
        ...state,
        primaryColor: action.payload.primary,
        accentColor: action.payload.accent
      };
    case 'RESET_TO_DEFAULT':
      return defaultSettings;
    default:
      return state;
  }
};

// Context
interface SettingsContextType {
  settings: Settings;
  dispatch: React.Dispatch<SettingsAction>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

// Provider Component
interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (storedSettings) {
          dispatch({ 
            type: 'UPDATE_SETTINGS', 
            payload: JSON.parse(storedSettings) 
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    };

    saveSettings();
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using settings
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};