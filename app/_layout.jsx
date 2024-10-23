import { StyleSheet, ImageBackground } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <Stack>
      {/* Index Screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Settings Screen */}
      <Stack.Screen name="settings" options={{ headerShown: false }} />

      {/* LED Screen */}
      <Stack.Screen name="ledSetting" options={{ headerShown: false }} />
      
      {/* Schedule Page */}
      <Stack.Screen name="schedulePage" options={{ headerShown: false }} />

      {/* Add Schedule Page */}
      <Stack.Screen name="addSchedule" options={{ headerShown: false }} />

      {/* Repeat Days Page */}
      <Stack.Screen name="repeatDay" options={{ headerShown: false }} />

      {/* Dispenser Settings Page */}
      <Stack.Screen name="dispenserSettings" options={{ headerShown: false }} />

      {/* History Page */}
      <Stack.Screen name="history" options={{ headerShown: false }} />

      {/* Sensor Settings Page */}
      <Stack.Screen name="sensorSettings" options={{ headerShown: false }} />

    </Stack>
  );
};

export default RootLayout;