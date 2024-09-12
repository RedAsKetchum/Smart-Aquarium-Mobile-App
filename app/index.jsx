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



export default function App() {
  const ESP32_IP = 'http://192.168.50.35';  // Replace with your ESP32 IP address
  const today = new Date();
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const monthAndDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(today);
  const sheetRef = useRef(null);
  const snapPoints = ['15%', '32%'];

  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
    // Custom handle component with a centered indicator bar
    const CustomHandle = () => {
      return (
        <View className="items-center justify-center top-3">
          <View className="bg-gray-500 rounded-full w-10 h-1" />
        </View>
      );
    };

    //Fetch Sensor Data TESTING****
    useEffect(() => {
      // Function to fetch the sensor data from ESP32
      const fetchSensorData = async () => {
        try {
          const response = await fetch('http://192.168.50.35/getFirstEntry'); // Replace <ESP32_IP> with your ESP32's IP address
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
                
              <Text className="text-2xl font-bold">Sensor Data</Text>
              <Text>ID: {sensorData.ID}</Text>
              <Text>Sensor 1: {sensorData.Sensor1}</Text>
              <Text>Sensor 1 Timestamp: {sensorData.Sensor1Timestamp}</Text>
              <Text>Sensor 2: {sensorData.Sensor2}</Text>
              <Text>Sensor 2 Timestamp: {sensorData.Sensor2Timestamp}</Text>
              <Text>Sensor 3: {sensorData.Sensor3}</Text>
              <Text>Sensor 3 Timestamp: {sensorData.Sensor3Timestamp}</Text>
               
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