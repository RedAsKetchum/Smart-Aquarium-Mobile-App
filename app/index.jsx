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
import axios from 'axios'; //for servo motor control
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

// ********************* Adafruit IO credentials ***********************/
const AIO_USERNAME = 'RedAsKetchum';  // Your Adafruit IO username
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Your Adafruit IO key
const LED_CONTROL_FEED = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/led-control/data`; 
const FEED_KEY = 'temperature-sensor';  // Your feed key
const FEED_KEY2 = 'servo-control';  // Your feed key
const AIO_ENDPOINT = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data/last?X-AIO-Key=${AIO_KEY}`;

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
  const snapPoints = ['18%', '32%'];
  const [temperatureSensor, setTemperatureSensor] = useState(-1);
  const [pHSensor, setpHSensor] = useState(-1);
  const [turbiditySensor, setTurbidity] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [isLightOn, setIsLightOn] = useState(true);  // State to track LED status
  const temperatureInFahrenheit = (temperatureSensor);
  const maxGauge = 100; // Max value of the gauge
  const maxpHGauge = 14; // Max value of the pH gauge

  // Custom handle component with a centered indicator bar
  const CustomHandle = () => {
      return (
        <View className="items-center justify-center top-3">
          <View className="bg-gray-500 rounded-full w-10 h-1" />
        </View>
      );
  };

  

   // Function to fetch the latest sensor data from Adafruit IO
const fetchSensorData = async () => {
  try {
    const response = await fetch(AIO_ENDPOINT);
    const data = await response.json();
    //console.log('Latest feed data:', data);

    if (data.value) {
      const sensorData = JSON.parse(data.value);  // Parse the JSON string inside `value`
      
      //Check for Sensor 1 "Temperature Sensor" value
      if (sensorData.Sensor1 !== null && sensorData.Sensor1 !== undefined) {
        const sensorValue = parseFloat(sensorData.Sensor1);  // Convert to number
        if (!isNaN(sensorValue)) {
          setTemperatureSensor(sensorValue);  // Update state with the numeric value
        } else {
          console.error("Sensor1 data is not a valid number:", sensorData.Sensor1);
          setTemperatureSensor(-1);  // Set to null if invalid
        }
      }
        else {
        console.error("Sensor1 is null or undefined.");
        setTemperatureSensor(-1);  // Set to null if no valid value is found
      }

      // Check for Sensor2 "pH Sensor" value
      if (sensorData.Sensor2 !== null && sensorData.Sensor2 !== undefined) {
        const sensorValue2 = parseFloat(sensorData.Sensor2);  // Convert to number
        if (!isNaN(sensorValue2)) {
          // Handle the Sensor2 value here (e.g., log it, update another state, etc.)
          setpHSensor(sensorValue2);  // Update state with the numeric value
          //setpHSensor(7.20);

        } else {
          console.error("Sensor2 data is not a valid number:", sensorData.Sensor2);
          // Optionally, handle invalid Sensor2 data here
          setpHSensor(-1); 
        }
      } else {
        console.error("Sensor2 is null or undefined.");
        // Optionally, handle null or undefined Sensor2 here
        setpHSensor(-1); 
      }

      // Check for Sensor3 "Turbidity Sensor" value
      if (sensorData.Sensor3 !== null && sensorData.Sensor3 !== undefined) {
        const sensorValue3 = parseFloat(sensorData.Sensor3);  // Convert to number
        if (!isNaN(sensorValue3)) {
          // Handle the Sensor3 value here (e.g., log it, update another state, etc.)
          setTurbidity(sensorValue3);  // Update state with the numeric value

        } else {
          console.error("Sensor3 data is not a valid number:", sensorData.Sensor3);
          // Optionally, handle invalid Sensor3 data here
          setTurbidity(-1); 
        }
      } else {
        console.error("Sensor3 is null or undefined.");
        // Optionally, handle null or undefined Sensor3 here
        setTurbidity(-1); 
      }
    }

  } catch (error) {
    console.error('Error fetching sensor data:', error);
  } finally {
    setLoading(false);
  }
};

      // Function to handle long polling
      const startLongPolling = () => {
        fetchSensorData();
        // Poll every 10 seconds (or adjust as needed)
        setTimeout(startLongPolling, 10000);
      };

      useEffect(() => {
        // Start long polling when the component mounts
        startLongPolling();
      }, []);

        // Loading state handler (add this into your UI logic below)
        if (temperatureSensor === null) {
          return <ActivityIndicator size="large" color="#0000ff" />;
        }

        const handleActivateServo = async (manualValue) => {
          const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY2}/data`;
        
          try {
            // Get the current date and time formatted as 'MM.DD hh:mm A'
            const currentTime = dayjs().format('MM.DD hh:mm A');
        
            // Construct the payload with 'Time' and 'Amount' as JSON strings
            const payload = {
              value: JSON.stringify({
                Type: "Manual",
                action: "activate",  
                Time: currentTime,
                Amount: manualValue  // Send the number of activations directly to Arduino
              })
            };
        
            // Send the POST request with the payload
            const response = await axios.post(url, payload, {
              headers: {
                "X-AIO-Key": AIO_KEY,
                "Content-Type": "application/json"
              }
            });
        
            if (response.status === 200) {
              console.log(`Servo activation command sent with amount: ${manualValue}`);
            } else {
              console.log("Failed to send servo activation command.");
            }
        
          } catch (error) {
            console.error("Error sending command:", error);
          }
        };
            
  return (

    // HomeScreen General Design
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView className="bg-primary h-full">
      <StatusBar backgroundColor="#161622" style="dark" />
        <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="w-full min-[85vh] px-3">
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
                      fill={(pHSensor / maxpHGauge) * 100}
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
                   {/*Temperature Gauge*/}
                   <StyledView className="mx-2"> 
                  <AnimatedCircularProgress
                    size={150}
                    width={20}
                    fill={(temperatureInFahrenheit / maxGauge) * 100}
                    tintColor="#9933ff"
                    backgroundColor="#d3d3d3"
                    lineCap="round"
                    arcSweepAngle={270}
                    rotation={225}
                    duration={900}
                  >
                    {() => (
                      <StyledView className="items-center justify-center" style={{height:80 }} >
                        <StyledText className="font-bold text-lg text-black" style={{ fontSize: 28, color: '#9933ff' }}>
                          {temperatureInFahrenheit.toFixed(0)}°F
                        </StyledText>
                      </StyledView>
                    )}
                  </AnimatedCircularProgress>
                  </StyledView>
                    {/* Small box below the gauge for pH level */}
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
                  onPress={async () => {
                    try {
                      const savedManualValue = await AsyncStorage.getItem('manualValue');
                      const manualValue = savedManualValue ? parseInt(savedManualValue, 10) : 1; // Default to 1 if no value is found
                      handleActivateServo(manualValue);  // Pass manualValue to the function to activate the servo
                      //console.log(`Feeding button pressed with manual value: ${manualValue}`);
                    } catch (error) {
                      console.log('Error retrieving manual value:', error);
                    }
                  }}
                >
                  <Image
                    source={require('../assets/icons/feedingButton.png')}
                    style={styles.imageButton}
                  />
                </TouchableOpacity>

                {/* Camera Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 90, borderRadius: 55, marginHorizontal: 40, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => router.push('/camera')}
                >
                  <Image
                    source={require('../assets/icons/cameraButton.png')}  
                    style={{width: 99, height: 97}}  
                  />
                </TouchableOpacity>

                {/* pH Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 80, borderRadius: 40,justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => console.log('pH button pressed.')}
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
                  onPress={() => router.push('/schedulePage')}
                >
                  <Image
                    source={require('../assets/icons/calendarButton.png')}  
                    style={styles.imageButton}  
                  />
                </TouchableOpacity>

                {/* LED Strip Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 80, borderRadius: 40,justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => router.push('/ledSetting')}
                >
                  <Image
                    source={require('../assets/icons/ledStripButton.png')}  
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
