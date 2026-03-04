import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/Header';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Header />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="article/[url]"
            options={{
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal'
            }}
          />
          <Stack.Screen name="[...article]" />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  );
}
