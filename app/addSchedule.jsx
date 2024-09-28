import React, { useRef, useState, useEffect } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router, useLocalSearchParams, useRouter } from 'expo-router';  // Use router and useLocalSearchParams
import { styles } from './AppStyles';  // Importing the styles from the new file
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddSchedule() {
    const ESP32_IP = 'http://192.168.50.35';  // Replace with your ESP32 IP address
    const router = useRouter();  // Use the router to handle navigation
    const { selectedDays } = useLocalSearchParams(); // Get selected days passed from repeatDay

    const [date, setDate] = useState(new Date());
    const [selectedDaysState, setSelectedDaysState] = useState(selectedDays ? selectedDays.split(',') : []);  // Parse passed days

    useEffect(() => {
        if (selectedDays) {
            setSelectedDaysState(selectedDays.split(','));
        }
    }, [selectedDays]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);  // Save the selected date or time
    };

    // Function to format selected days for display
    const formatSelectedDays = () => {
        return selectedDaysState.length > 0 ? selectedDaysState.join(', ') : 'None';
    };

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
                {/* Save Schedule Button */}
                <TouchableOpacity  
                    onPress={() => console.log("Save Button Pressed")} 
                    style={{padding: 10, marginRight: 10}}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Save</Text>
                </TouchableOpacity>
            </View>
        <ScrollView contentContainerStyle={{ height: '100%', marginTop: 10}}>
            <View style={{width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginHorizontal: 15, marginTop: 45}}>
                {/* Start Time */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>Start Time</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>  
                        <DateTimePicker
                            testID="TimePicker"
                            value={date}
                            mode={"time"}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                        <Icon 
                            name="chevron-forward-outline"
                            size={22} 
                            color="white"
                            style={{ marginLeft: 10 }}
                        />
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: 'grey', marginTop: 10, marginHorizontal: 10, fontWeight: 'bold'}}></View>
                {/* Repeat Day */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>Repeat Day</Text>
                    <TouchableOpacity  
                        onPress={() => router.push({ pathname: './repeatDay', params: { selectedDays: selectedDaysState.join(',') }})} // Passing selected days to repeatDay
                        style={{flexDirection: 'row',padding: 10}}>
                        <Text style={{ fontSize: 17, color: 'purple', marginRight: 10}}>{formatSelectedDays()}</Text>
                        <Icon 
                            name="chevron-forward-outline"
                            size={22} 
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginHorizontal: 15, marginTop: 45}}>
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
