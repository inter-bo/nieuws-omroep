import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/Header';
import { Drawer } from '@/components/layout/Drawer';
import { DrawerProvider } from '@/context/DrawerContext';
import { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Shows a readable crash report instead of a white screen when an unhandled JS error occurs
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <ScrollView style={{ flex: 1, padding: 20, marginTop: 60 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>App Crash</Text>
          <Text style={{ marginTop: 10 }}>{(this.state.error as Error).message}</Text>
          <Text style={{ marginTop: 10, color: '#666', fontSize: 12 }}>{(this.state.error as Error).stack}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate loading={<View style={{ flex: 1 }} />} persistor={persistor}>
            <SafeAreaProvider>
              <DrawerProvider>
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
                  <Stack.Screen name="menu" options={{ headerShown: false }} />
                </Stack>
                <Drawer />
              </DrawerProvider>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
