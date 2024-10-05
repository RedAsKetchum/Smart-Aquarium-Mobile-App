import React, { useRef } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '../components/CustomButton';
import { router } from 'expo-router';
import { styles } from './AppStyles';
import Icon from 'react-native-vector-icons/Ionicons';



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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
          <TouchableOpacity 
            onPress={() => router.push('/')} 
            style={{ padding: 10 }}
          >    
            <Icon name="arrow-back" size={35} color="white" />
          </TouchableOpacity>
          
        </View>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', textAlign: 'center'}}> Settings </Text>
        <ScrollView contentContainerStyle={{ height: '100%', marginTop: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 10}}> Connected to: </Text>
          {/* Sensor Settings */}
          <TouchableOpacity style={styles.buttons}
            onPress={() => console.log("Sensor Settings Pressed")}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Sensor Settings
            </Text>
          </TouchableOpacity>
          {/* Dispenser Settings */}
          <TouchableOpacity style={styles.buttons}
            onPress={() => console.log("Sensor Settings Pressed")}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Dispenser Settings
            </Text>
          </TouchableOpacity>
          {/* LED Settings */}
          <TouchableOpacity style={styles.buttons}
            onPress={() => console.log("Sensor Settings Pressed")}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              LED Settings
            </Text>
          </TouchableOpacity>
          {/* Reboot */}
          <TouchableOpacity style={[styles.buttons, { borderRadius: 30, height: 65, marginTop: 50}]}
            onPress={() => console.log("Sensor Settings Pressed")}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Reboot
            </Text>
          </TouchableOpacity>
           {/*Format */}
           <TouchableOpacity style={[styles.buttons, { borderRadius: 30, height: 65}]}
            onPress={() => console.log("Sensor Settings Pressed")}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>
              Format
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default settings;
