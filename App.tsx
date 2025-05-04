import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { EntriesProvider } from './src/contexts/EntriesContext';
import { ComparisonProvider } from './src/contexts/ComparisonContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function App() {
  // Request notification permissions on app launch
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <EntriesProvider>
          <ComparisonProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppNavigator />
            </NavigationContainer>
          </ComparisonProvider>
        </EntriesProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default registerRootComponent(App);