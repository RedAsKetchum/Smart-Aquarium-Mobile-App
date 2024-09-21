import React, { useRef } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import CustomButton from '../components/CustomButton';
import { router } from 'expo-router';
import { styles } from './AppStyles';  // Importing the styles from the new file
import { StatusBar } from 'expo-status-bar'; // Corrected import for Expo
import { useEffect, useState } from 'react';
import {ActivityIndicator } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
//import Svg, { Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
//import io from 'socket.io-client';

export default function App() {
 
  //const ESP32_IP = 'ws://192.168.50.35:81';  // Replace with your ESP32 IP address
  //const socket = useRef(io(ESP32_IP)).current;  // Maintain a single WebSocket connection
  const today = new Date();
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const monthAndDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(today);
  const sheetRef = useRef(null);
  const snapPoints = ['15%', '32%'];

  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   // Extract temperature value from sensor data by looking for the text entry "Sensor1" on the JSON reponse from the ESP32 server
   const temperature = sensorData?.Sensor1; // Adjust the key based on your actual data structure

   //const temperatureInFahrenheit = (temperature * 9/5) + 32;
   const temperatureInFahrenheit = (temperature);
   
   // Adjust the key based on your data structure
   const maxTemperature = 100; // Max value of the gauge

   const [forceUpdate, setForceUpdate] = useState(false)
  
  // Custom handle component with a centered indicator bar
  const CustomHandle = () => {
      return (
        <View className="items-center justify-center top-3">
          <View className="bg-gray-500 rounded-full w-10 h-1" />
        </View>
      );
    };

      // Function to fetch the sensor data from ESP32
      useEffect(() => {
        const fetchSensorData = async () => {
          try {
            const response = await fetch('http://192.168.50.35/getNewestEntry'); // Replace <ESP32_IP> with your ESP32's IP address
            if (!response.ok) {
              throw new Error('Failed to fetch sensor data');
            }
            const data = await response.json();
            if (data && Object.keys(data).length > 0) {
              setSensorData(data);
            } else {
              setError('No data available');
            }
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchSensorData();

      }, []);

      useEffect(() => {
        // Function to perform long polling
        const pollServerForSensor1 = async () => {
          try {
            const response = await fetch('http://192.168.50.35/long-polling-sensor1');  // Replace with your ESP32's IP
            const data = await response.json();
            console.log('Received data:', data);  // Log the data
            console.log('Sensor Value:', data.Sensor1);
  
            // Update state with the new data
            setSensorData(data);
            setLoading(false);
    
            // Poll again after receiving the data
            pollServerForSensor1();
          } catch (error) {
            console.error('Error polling server:', error);
            setTimeout(pollServerForSensor1, 5000);  // Retry after 5 seconds in case of an error
          }
        };
    
        // Start polling when the component mounts
        pollServerForSensor1();
    
        return () => {
          // Clean up if necessary
        };
      }, []);

      // useEffect(() => {
      //   // Function to handle incoming WebSocket messages
      //   const handleMessage = (message) => {
      //     try {
      //       const data = JSON.parse(message.data);
      //       if (data && data.Sensor1 !== undefined) {
      //         console.log('Received WebSocket message:', data);
      //         setSensorData(data);
      //         setForceUpdate(prev => !prev);  // Force a re-render
      //       }
      //     } catch (error) {
      //       console.error('Error parsing WebSocket message:', error);
      //     }
      //   };
      
      //   socket.on('connect', () => {
      //     console.log('Connected to WebSocket');
      //   });
      
      //   socket.on('message', function (message) {
      //     handleMessage(message);
      //   });
        
      
      //   // Clean up WebSocket connection on component unmount
      //   return () => {
      //     socket.removeAllListeners(); // Remove all event listeners
      //     socket.disconnect(); // Disconnect the WebSocket connection
      //   };
      // }, [socket]);
      

    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
  
    if (error) {
      return (
        <View style={styles.container}>
          <Text>Error: {error}</Text>
        </View>
      );
    }

  return (

    // HomeScreen General Design
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView className="bg-primary h-full">
      <StatusBar backgroundColor="#161622" style="dark" />
        <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="w-full min-[85vh] px-4">
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
                      {temperatureInFahrenheit.toFixed(1)}°F
                     
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

