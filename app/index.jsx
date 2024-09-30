import React, { useRef } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import CustomButton from '../components/CustomButton';
import { router } from 'expo-router';
import { styles } from './AppStyles';  // Importing the styles from the new file
import schedulePage from './schedulePage';
import { StatusBar } from 'expo-status-bar'; // Corrected import for Expo
import { useEffect, useState } from 'react';
import {ActivityIndicator } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

// ********************* Adafruit IO credentials ***********************/
const AIO_USERNAME = 'RedAsKetchum';  // Your Adafruit IO username
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Your Adafruit IO key
const FEED_KEY = 'temperature-sensor';  // Your feed key
const AIO_ENDPOINT = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data/last?X-AIO-Key=${AIO_KEY}`;

export default function App() {
 
  //*****CONSTANTS*****/
  const today = new Date();
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const monthAndDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(today);
  const sheetRef = useRef(null);
  const snapPoints = ['15%', '32%'];

  const [temperatureSensor, setTemperatureSensor] = useState(null);
  const [loading, setLoading] = useState(true);

  //Used to Display Data on the Homescreen Gauge
  const temperatureInFahrenheit = (temperatureSensor);
   
   // Adjust the key based on your data structure
   const maxTemperature = 100; // Max value of the gauge

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

      if (sensorData.Sensor1 !== null && sensorData.Sensor1 !== undefined) {
        const sensorValue = parseFloat(sensorData.Sensor1);  // Convert to number
        if (!isNaN(sensorValue)) {
          setTemperatureSensor(sensorValue);  // Update state with the numeric value
        } else {
          console.error("Sensor1 data is not a valid number:", sensorData.Sensor1);
          setTemperatureSensor(null);  // Set to null if invalid
        }
      } else {
        console.error("Sensor1 is null or undefined.");
        setTemperatureSensor(null);  // Set to null if no valid value is found
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
        // Poll every 5 seconds (or adjust as needed)
        setTimeout(startLongPolling, 12000);
      };

      useEffect(() => {
        // Start long polling when the component mounts
        startLongPolling();
      }, []);

        // Loading state handler (add this into your UI logic below)
        if (temperatureSensor === null) {
          return <ActivityIndicator size="large" color="#0000ff" />;
        }
  
    // useEffect(() => {
    //   // WebSocket URL with authentication
    //   const socketUrl = `wss://io.adafruit.com/mqtt/${AIO_USERNAME}/feeds/${FEED_KEY}?x-aio-key=${AIO_KEY}`;

    //   // Create a new WebSocket connection
    //   const socket = new WebSocket(socketUrl);
  
    //   // Handle connection open
    //   socket.onopen = () => {
    //     console.log('WebSocket connected');
    //     setConnected(true);
    //   };
  
    //   // Handle incoming messages
    //   socket.onmessage = (event) => {
    //     try {
    //       console.log('Raw message received:', event.data); // Log raw message
    //       const messageData = JSON.parse(event.data);
    //       console.log('Parsed message:', messageData); // Log parsed message
    //       if (messageData && messageData.value) {
    //         setTemperatureSensor(messageData.value);  // Update temperature sensor data
    //       } else {
    //         console.log('No value found in message data:', messageData);
    //       }
    //     } catch (err) {
    //       console.error('Error parsing message data:', err);
    //     }
    //   };
      
    //   // Handle errors
    //   socket.onerror = (error) => {
    //     console.error('WebSocket error:', error);
    //   };
  
    //   // Handle connection close
    //   socket.onclose = (event) => {
    //     console.log(`WebSocket closed: code = ${event.code}, reason = ${event.reason}`);
    //     setConnected(false);
    //   };
      
    //   // Cleanup WebSocket on unmount
    //   return () => {
    //     if (socket) {
    //       socket.close();
    //     }
    //   };
    // }, []);

    // Function to move the servo 30 degrees forward and back
  // const moveServo = async () => {
  //   if (servoMoving) return; // Prevent multiple presses while moving

  //   setServoMoving(true);
  //   try {
  //     const response = await fetch('http://192.168.50.35/move_servo'); // Replace with your ESP32 IP address
  //     if (response.ok) {
  //       Alert.alert('Success', 'Servo moved 50 degrees forward and back');
  //     } else {
  //       Alert.alert('Error', 'Failed to move servo');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', `Failed to connect: ${error.message}`);
  //   } finally {
  //     setServoMoving(false); // Allow further presses after moving is done
  //   }
  // };

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
             <View className="bg-gray-50/40 w-full h-56 rounded-xl items-center p-7">

        
             <Text className="text-white text-2xl font-bold -mt-5 mb-3">Status</Text>
              {/* <Text>ID: {sensorData.ID}</Text> */}
              {/* <Text>Sensor 1: {sensorData.Sensor1} - {sensorData.Sensor1Timestamp}</Text>
              <Text>Sensor 2: {sensorData.Sensor2} - {sensorData.Sensor2Timestamp}</Text>
              <Text>Sensor 3: {sensorData.Sensor3} - {sensorData.Sensor3Timestamp}</Text> */}

              {/* <View style={styles.gaugeContainer}>
                <GradientGauge value={gaugeValue} maxValue={maxValue} />
              </View> */}

        <View style={styles.container}>
                
                      <AnimatedCircularProgress
                size={180}
                width={20}

                fill={(temperatureInFahrenheit / maxTemperature) * 100}

                tintColor="#ff4500"
                backgroundColor="#d3d3d3"
                lineCap="round"
                arcSweepAngle={240}
                rotation={240}
                duration={800}
              >
                {() => (
                  <View style={styles.centerTextContainer}>
                    <Text style={styles.temperatureText}>
                      
                      {temperatureInFahrenheit.toFixed(0)}°F
                     
                    </Text>
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>
         
             </View>

              {/* HISTORY BUTTON*/}
              <CustomButton
                title="History"
                handlePress={() => router.push('/history')}
                containerStyles="w-full mt-7"
              />

              {/* SETTINGS BUTTON */}
              <CustomButton
                title="Settings"
                handlePress={() => router.push('/settings')}
                containerStyles="w-full mt-7"
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
                  
                  //onPress={moveServo}
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
                
                {/* Light Button Needs to be fixed*/}
                <TouchableOpacity
                  style={{ width: 90, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => console.log('Light Button pressed')}
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

                {/* Turbidity Button */}
                <TouchableOpacity
                  style={{ width: 90, height: 80, borderRadius: 40,justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => console.log('Turbidity pressed')}
                >
                  <Image
                    source={require('../assets/icons/turbidityButton.png')}  
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

