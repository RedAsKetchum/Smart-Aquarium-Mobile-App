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
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10}}>
                {/* Back button */}
                <TouchableOpacity  
                    onPress={() => router.push('/schedulePage')} 
                    style={{padding: 10, marginLeft: 10}}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Add</Text>
                {/* Add Schedule Button */}
                <TouchableOpacity  
                    onPress={() => console.log("Save Button Pressed")} 
                    style={{padding: 10, marginRight: 10}}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Save</Text>
                </TouchableOpacity>
            </View>
        <ScrollView contentContainerStyle={{ height: '100%', marginTop: 10}}>
            <View style={{width: '90', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginHorizontal: 15, marginTop: 45}}>
                {/* Start Time */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>Start Time</Text>
                    <TouchableOpacity  
                        onPress={() => console.log("Start Time Pressed")} 
                        style={{flexDirection: 'row',padding: 10}}>
                        <Text style={{ fontSize: 17, color: 'purple', marginRight: 10}}>None</Text>
                        <Icon 
                            name="chevron-forward-outline"
                            size={22} 
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
                    <View style={{ height: 1, backgroundColor: 'grey', marginTop: 10, marginHorizontal: 10, fontWeight: 'bold'}}></View>
                    {/* End Time */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>End Time</Text>
                        <TouchableOpacity  
                            onPress={() => console.log("End Time Pressed")} 
                            style={{flexDirection: 'row',padding: 10}}>
                            <Text style={{ fontSize: 17, color: 'purple', marginRight: 10}}>None</Text>
                            <Icon 
                                name="chevron-forward-outline"
                                size={22} 
                                color="white"
                            />
                        </TouchableOpacity>
                </View>
                    <View style={{ height: 1, backgroundColor: 'grey', marginTop: 10, marginHorizontal: 10, fontWeight: 'bold'}}></View>
                    {/* Repeat Day */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>Repeat Day</Text>
                        <TouchableOpacity  
                            onPress={() => console.log("Repeat Day Pressed")} 
                            style={{flexDirection: 'row',padding: 10}}>
                            <Text style={{ fontSize: 17, color: 'purple', marginRight: 10}}>None</Text>
                            <Icon 
                                name="chevron-forward-outline"
                                size={22} 
                                color="white"
                            />
                        </TouchableOpacity>
                </View>
                    <View style={{ height: 1, backgroundColor: 'grey', marginTop: 10, marginHorizontal: 10, fontWeight: 'bold'}}></View>
                    {/* Repeat Time */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>Repeat Time</Text>
                        <TouchableOpacity  
                            onPress={() => console.log("Repeat Time Pressed")} 
                            style={{flexDirection: 'row',padding: 10}}>
                            <Text style={{ fontSize: 17, color: 'purple', marginRight: 10}}>None</Text>
                            <Icon 
                                name="chevron-forward-outline"
                                size={22} 
                                color="white"
                            />
                        </TouchableOpacity>
                </View>  
            </View>
            <View style={{width: '90', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginHorizontal: 15, marginTop: 45}}>
                <TouchableOpacity  
                    onPress={() => console.log("Delete Button Pressed")} 
                    style={{alignItems: 'center' ,padding: 10}}>
                        <Text style={{ fontSize: 17, color: 'red', marginRight: 10}}>Delete</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
        </GestureHandlerRootView>
    );
}
