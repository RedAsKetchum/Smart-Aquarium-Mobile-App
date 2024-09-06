import React, { useRef } from 'react';
import {Text, View} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, ImageBackground } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Redirect, router } from 'expo-router';
import { StyleSheet} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import {images} from '../constants';
import { Image } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {TouchableOpacity } from 'react-native';




export default function App() {
  
  const ESP32_IP = 'http://192.168.50.35'; // Replace <ESP32-IP-ADDRESS> with your ESP32's IP address

  const today = new Date();  // Get the current date

  // Format the day and date separately
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const monthAndDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(today);

  const sheetRef = useRef(null);
  const snapPoints = ['10%', '40%'];

  // Function to activate the servo motor
  // const activateServo = async () => {
  //   try {
  //     const response = await fetch(`${ESP32_IP}/activate_servo`);
  //     if (response.ok) {
  //       Alert.alert('Success', 'Servo Activated');
  //     } else {
  //       Alert.alert('Error', 'Failed to activate servo');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', `Failed to send request: ${error.message}`);
  //   }
  // };

  // // Function to deactivate the servo motor
  // const deactivateServo = async () => {
  //   try {
  //     const response = await fetch(`${ESP32_IP}/deactivate_servo`);
  //     if (response.ok) {
  //       Alert.alert('Success', 'Servo Deactivated');
  //     } else {
  //       Alert.alert('Error', 'Failed to deactivate servo');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', `Failed to send request: ${error.message}`);
  //   }
  // };

  return (
<GestureHandlerRootView style={styles.container}>
<SafeAreaView className= "bg-primary h-full">
  <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>   
    <ScrollView contentContainerStyle={{ height: '100%'}} >
      {/* min-[85vh] center the content at this min height */}
      <View className="w-full  min-[85vh] px-4"> 
    
      {/* <Text style={styles.dayText}> {dayName} </Text>             
      <Text style={styles.dateText}> {monthAndDay} </Text> */}

        <Text className="text-2xl font-bold text-white text-center">   {dayName} </Text>             
        <Text className="text-xl font-semibold text-white text-center pl-2"> {monthAndDay} </Text>
      

       <View className="relative mt-5">  
      
        <CustomButton title="History" 
         handlePress={() => router.push('/history')}
         containerStyles="w-full mt-7"/>  

        <CustomButton title="Settings" 
         handlePress={() => router.push('/settings')}
         containerStyles="w-full mt-7"/>
       </View>
     </View>
  </ScrollView>

        <BottomSheet
          ref={sheetRef}
          index={0} // Initial index, will start at 10%
          snapPoints={snapPoints}
          handleComponent={null} // Remove default handle if you don't want one
          onChange={(index) => {
            // Optionally handle changes
          }}
          backgroundStyle={styles.bottomSheetBackground}
          handleStyle={styles.bottomSheetHandle}
        >
          <View style={styles.bottomSheetContent}>
            <BlurView intensity={80} style={styles.blurContainer}>
            </BlurView>
          </View>
        </BottomSheet>
  <StatusBar backgroundColor='#161622' style='light'/>
</SafeAreaView>
</GestureHandlerRootView>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    height: '100%',
  },
  textContainer: {
    width: '100%',
    minHeight: '85vh',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 8,
  },
  bottomSheetContent: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent', // Ensure transparent background
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent', // Ensure transparent background
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  bottomSheetBackground: {
    backgroundColor: 'transparent',
  },
  bottomSheetHandle: {
    display: 'none', // Hide handle if not needed
  },
});