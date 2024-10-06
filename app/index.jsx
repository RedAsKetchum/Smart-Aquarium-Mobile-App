import React, { useRef } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import CustomButton from '../components/CustomButton';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; 
import { useEffect, useState } from 'react';
import {ActivityIndicator } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { styles } from './AppStyles'; //imports app styles for components using stylesheet
import { styled } from 'nativewind';

// ********************* Adafruit IO credentials ***********************/
const AIO_USERNAME = 'RedAsKetchum';  // Your Adafruit IO username
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Your Adafruit IO key
const LED_CONTROL_FEED = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/led-control/data`;  // Adafruit IO feed URL for controlling LED

const StyledView = styled(View);
const StyledText = styled(Text);

// Define and export toggleLED
export const toggleLED = async (isLightOn, setIsLightOn) => {
  const newState = isLightOn ? 'OFF' : 'ON';
  try {
    const response = await fetch(LED_CONTROL_FEED, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': AIO_KEY
      },
      body: JSON.stringify({
        value: newState  // Send the new LED state (ON or OFF)
      })
    });

    if (response.ok) {
      setIsLightOn(!isLightOn);
      Alert.alert('Success', `LED turned ${newState}`);
    } else {
      throw new Error('Failed to update Adafruit IO feed');
    }
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Failed to connect to Adafruit IO');
  }
};

// Define and export debugToggleLED
export const debugToggleLED = async (isLightOn, setIsLightOn) => {
  console.log(`Sending LED state: ${isLightOn ? 'OFF' : 'ON'}`);
  await toggleLED(isLightOn, setIsLightOn);
};

export default function App() {

  //************************CONSTANTS**********************************/
  const today = new Date();
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const monthAndDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(today);
  const sheetRef = useRef(null);
  const snapPoints = ['15%', '32%'];

  const [temperatureSensor, setTemperatureSensor] = useState(-1);
  const [pHSensor, setpHSensor] = useState(-1);
  const [turbiditySensor, setTurbidity] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [isLightOn, setIsLightOn] = useState(true);  // State to track LED status

  //Used to Display Data on the Homescreen Gauge
  const temperatureInFahrenheit = (temperatureSensor);
  
  // Adjust the key based on your data structure
  const maxGauge = 100; // Max value of the gauge

  // Custom handle component with a centered indicator bar
  const CustomHandle = () => {
      return (
        <View className="items-center justify-center top-3">
          <View className="bg-gray-500 rounded-full w-10 h-1" />
        </View>
      );
  };

  return (

    // HomeScreen General Design
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView className="bg-primary h-full">
      <StatusBar backgroundColor="#161622" style="dark" />
        <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="w-full min-[85vh] px-5">
            <Text className="text-2xl font-bold text-white text-center">{dayName}</Text>
            <Text className="text-xl font-semibold text-white text-center pl-2">{monthAndDay}</Text>
            <View className="relative mt-5">

             {/* AQUARIUM'S STATUS PANEL*/}
             <View className="bg-gray-50/40 w-full h-60 rounded-xl items-center p-7">

             <Text className="text-white text-2xl font-bold -mt-5 mb-2">Status</Text>

                 {/* Gauge using nativewind */}
                 <StyledView className="flex-row justify-between items-center">
                  {/*pH Gauge*/}
                  <StyledView className="items-center">
                    <AnimatedCircularProgress
                      size={110}
                      width={20}
                      fill={(pHSensor / maxGauge) * 100}
                      tintColor="#ff1a1a"
                      backgroundColor="#d3d3d3"
                      lineCap="round"
                      arcSweepAngle={270}
                      rotation={225}
                      duration={900}
                    >
                      {() => (
                        <StyledView className="items-center justify-center" style={{height:80 }} >
                          <StyledText className="font-bold text-lg text-black" style={{ fontSize: 28, color: '#ff1a1a' }}>
                            {pHSensor.toFixed(2)} 
                          </StyledText>
                        </StyledView>
                      )}
                    </AnimatedCircularProgress>
                    {/* Small box below the gauge for pH level */}
                    <StyledView className="mt-0 px-2 py-1 bg-gray-200 rounded">
                      <StyledText className="text-black font-semibold">pH level</StyledText>
                    </StyledView>
                  </StyledView>
                  
                  {/*Temperature Gauge*/}
                  <StyledView className="items-center">
                    <StyledView className="mx-2"> 
                      <AnimatedCircularProgress
                        size={150}
                        width={20}
                        fill={(temperatureInFahrenheit / maxGauge) * 100}
                        tintColor="#cc00ff"
                        backgroundColor="#d3d3d3"
                        lineCap="round"
                        arcSweepAngle={270}
                        rotation={225}
                        duration={900}
                      >
                        {() => (
                          <StyledView className="items-center justify-center" style={{height:80 }} >
                            <StyledText className="font-bold text-lg text-black" style={{ fontSize: 28, color: '#cc00ff' }}>
                              {temperatureInFahrenheit.toFixed(0)}°F
                            </StyledText>
                          </StyledView>
                        )}
                      </AnimatedCircularProgress>
                    </StyledView>
                    {/* Small box below the gauge for Temperature */}
                    <StyledView className="mt-0 px-2 py-1 bg-gray-200 rounded">
                      <StyledText className="text-black font-semibold">Temperature</StyledText>
                    </StyledView>
                  </StyledView>

                  {/*Turbidity Gauge*/}
                  <StyledView className="items-center">
                    <AnimatedCircularProgress
                      size={110}
                      width={20}
                      fill={(turbiditySensor / maxGauge) * 100}
                      tintColor="#1a53ff"
                      backgroundColor="#d3d3d3"
                      lineCap="round"
                      arcSweepAngle={270}
                      rotation={225}
                      duration={900}
                    >
                      {() => (
                        <StyledView className="items-center justify-center" style={{height:80 }} >
                          <StyledText className="font-bold text-lg text-black" style={{ fontSize: 28, color: '#1a53ff' }}>
                            {turbiditySensor.toFixed(0)}
                          </StyledText>
                        </StyledView>
                      )}
                    </AnimatedCircularProgress>
                    {/* Small box below the gauge for Turbidity */}
                    <StyledView className="mt-0 px-2 py-1 bg-gray-200 rounded">
                      <StyledText className="text-black font-semibold">Turbidity</StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>
             </View>

              {/* HISTORY BUTTON*/}
              <CustomButton
                title="History"
                handlePress={() => router.push('/history')}
                containerStyles="w-full mt-6"
              />

              {/* SETTINGS BUTTON */}
              <CustomButton
                title="Settings"
                handlePress={() => router.push('/settings')}
                containerStyles="w-full mt-5"
              />
            </View>
          </View>
        </ScrollView>

        {/* BOTTOM SHEET Properties */}
        <BottomSheet
          ref={sheetRef}
          index={1}
          snapPoints={snapPoints}
          handleComponent={CustomHandle}
          backgroundStyle={styles.bottomSheetBackground}
          handleStyle={styles.bottomSheetHandle}
          >
    
          <View style={styles.bottomSheetContent}>
            <BlurView intensity={70} style={styles.blurContainer}>
             {/* Row1 */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                
                {/* Feeding Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => console.log('Feeding Button pressed')}
                >
                  <Image
                    source={require('../assets/icons/feedingButton.png')}
                    style={styles.imageButton}  
                  />
                </TouchableOpacity>

                {/* Camera Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 90, borderRadius: 55, marginHorizontal: 40, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => console.log('Camera Button pressed')}
                >
                  <Image
                    source={require('../assets/icons/cameraButton.png')}  
                    style={{width: 100, height: 100}}  
                  />
                </TouchableOpacity>

                {/* pH Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 80, borderRadius: 40,justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => console.log('pH Button pressed')}
                >
                  <Image
                    source={require('../assets/icons/phButton.png')}  
                    style={styles.imageButton}  
                  />
                </TouchableOpacity>
              </View>
              {/* Row 2 */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                
                {/* Light Button*/}
                <TouchableOpacity
                  style={{ width: 90, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => debugToggleLED(isLightOn, setIsLightOn)} // Call the toggleLED function here
                >
                  <Image
                    source={require('../assets/icons/lightButton.png')}
                    style={styles.imageButton}  
                  />
                </TouchableOpacity>

                {/* Calendar Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 90, borderRadius: 55, marginHorizontal: 40, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => console.log('Calendar Button pressed')}
                >
                  <Image
                    source={require('../assets/icons/calendarButton.png')}  
                    style={styles.imageButton}  
                  />
                </TouchableOpacity>

                {/* Bubbles Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 80, borderRadius: 40,justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => console.log('Bubbles pressed')}
                >
                  <Image
                    source={require('../assets/icons/bubblesButton.png')}  
                    style={styles.imageButton}  
                  />
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
