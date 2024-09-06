import React, { useRef } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '../components/CustomButton';
import { router } from 'expo-router';
import { styles } from './AppStyles';  // Importing the styles from the new file


const settings = () => {
  const ESP32_IP = 'http://192.168.50.35';  // Replace with your ESP32 IP address
  const today = new Date();
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const monthAndDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(today);
  const sheetRef = useRef(null);
  const snapPoints = ['10%', '40%'];

  return (
    <GestureHandlerRootView style={styles.container}>  
    <SafeAreaView className="bg-primary h-full">
      <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
        {/* Back button */}
        <View>
          <TouchableOpacity  
            onPress={() => router.push('/')} 
            style={{
            top: 10,  
            left: 20,}}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '400'}}>{'<'} Index</Text> 
          </TouchableOpacity>
        </View>
      <ScrollView contentContainerStyle={{ height: '100%', marginTop: 40}}>
        <View className="w-full min-[85vh] px-4">
          <Text className="text-2xl font-bold text-white text-center">{dayName}</Text>
          <Text className="text-xl font-semibold text-white text-center pl-2">{monthAndDay}</Text>
          <View className="relative mt-5">
            <CustomButton
              title="Sensor Setting"
              handlePress={() => router.push('/sensorSetting')}
              containerStyles="w-full mt-7"
            />
            <CustomButton
              title="Dispenser Setting"
              handlePress={() => router.push('/dispenserSetting')}
              containerStyles="w-full mt-7"
            />
             <CustomButton
              title="LED Setting"
              handlePress={() => router.push('/ledSetting')}
              containerStyles="w-full mt-7"
            />
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
      </GestureHandlerRootView>
  );
};


export default settings

