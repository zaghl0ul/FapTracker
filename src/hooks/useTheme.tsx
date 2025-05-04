import { useColorScheme } from 'react-native';
import { useSettings, ThemeMode } from '../contexts/SettingsContext';

interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export const useTheme = (): Theme => {
  const { settings } = useSettings();
  const deviceTheme = useColorScheme();
  
  // Determine if dark mode based on settings or device theme
  const isDarkMode = settings.themeMode === ThemeMode.DARK || 
    (settings.themeMode === 'system' && deviceTheme === 'dark');
  
  // Define colors based on theme mode
  const colors: ThemeColors = {
    primary: settings.primaryColor,
    accent: settings.accentColor,
    background: isDarkMode ? '#121212' : '#F9FAFB',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#F9FAFB' : '#111827',
    border: isDarkMode ? '#333333' : '#E5E7EB',
    notification: '#FF9500',
    error: '#FF3B30',
    success: '#34C759',
  };
  
  return {
    dark: isDarkMode,
    colors
  };
};