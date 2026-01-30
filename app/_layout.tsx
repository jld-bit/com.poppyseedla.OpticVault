
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Note: Error logging is auto-initialized via index.ts import

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)", // Ensure any route can link back to `/`
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const networkState = useNetworkState();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | null>(null);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Load user's theme preference from AsyncStorage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appAppearanceMode');
        console.log('Loaded theme preference from storage:', storedTheme);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setUserTheme(storedTheme);
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      } finally {
        setThemeLoaded(true);
      }
    };
    loadThemePreference();
  }, []);

  // Listen for theme changes in AsyncStorage
  useEffect(() => {
    const checkThemeChanges = setInterval(async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appAppearanceMode');
        if (storedTheme !== userTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          console.log('Theme changed in storage, updating to:', storedTheme);
          setUserTheme(storedTheme);
        }
      } catch (error) {
        console.log('Error checking theme changes:', error);
      }
    }, 500);

    return () => clearInterval(checkThemeChanges);
  }, [userTheme]);

  useEffect(() => {
    if (loaded && themeLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, themeLoaded]);

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!loaded || !themeLoaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)", // System Blue
      background: "rgb(242, 242, 247)", // Light mode background
      card: "rgb(255, 255, 255)", // White cards/surfaces
      text: "rgb(0, 0, 0)", // Black text for light mode
      border: "rgb(216, 216, 220)", // Light gray for separators/borders
      notification: "rgb(255, 59, 48)", // System Red
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)", // System Blue (Dark Mode)
      background: "rgb(1, 1, 1)", // True black background for OLED displays
      card: "rgb(28, 28, 30)", // Dark card/surface color
      text: "rgb(255, 255, 255)", // White text for dark mode
      border: "rgb(44, 44, 46)", // Dark gray for separators/borders
      notification: "rgb(255, 69, 58)", // System Red (Dark Mode)
    },
  };

  // Use user's preference if set, otherwise fall back to system theme
  const activeColorScheme = userTheme || systemColorScheme || 'light';
  const isDark = activeColorScheme === 'dark';

  console.log('Active theme:', activeColorScheme, '(user:', userTheme, ', system:', systemColorScheme, ')');

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} animated />
        <ThemeProvider
          value={isDark ? CustomDarkTheme : CustomDefaultTheme}
        >
          <WidgetProvider>
            <GestureHandlerRootView>
            <Stack>
              {/* Main app with tabs */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <SystemBars style={isDark ? "light" : "dark"} />
            </GestureHandlerRootView>
          </WidgetProvider>
        </ThemeProvider>
    </>
  );
}
