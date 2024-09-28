import React, { useRef } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '../components/CustomButton';
import { router } from 'expo-router';
import { styles } from './AppStyles';  // Importing the styles from the new file
import Icon from 'react-native-vector-icons/Ionicons';

export default function AddSchedule() {
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
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '20', marginTop: '20'}}>
                {/* Back button */}
                <TouchableOpacity  
                    onPress={() => router.push('/')} 
                    style={{padding: 10}}>
                    <Icon 
                      name="arrow-back"  
                      size={35} 
                      color="white"  
                    />
                </TouchableOpacity>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Feeding Schedule</Text>
                {/* Add Schedule Button */}
                <TouchableOpacity  
                    onPress={() => router.push('/addSchedule')} 
                    style={{padding: 10}}>
                    <Icon 
                        name="add-outline" 
                        size={35} 
                        color="white"  
                    />
                </TouchableOpacity>
            </View>
        <ScrollView contentContainerStyle={{ height: '100%', marginTop: 10}}>
            <View style={{width: '100', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '10', borderRadius: 15}}>
             
            </View>
        </ScrollView>
        </SafeAreaView>
        </GestureHandlerRootView>
    );
}
