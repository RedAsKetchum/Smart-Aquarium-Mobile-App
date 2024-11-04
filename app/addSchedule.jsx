import React, { useEffect, useState } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Alert, Modal} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter, useLocalSearchParams } from 'expo-router';  // Use router and useLocalSearchParams
import { styles } from './AppStyles';  // Importing the styles from the new file
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function AddSchedule() {
    const router = useRouter();  // Use the router to handle navigation
    const { selectedDays, selectedTime, isEditMode = false, selectedDevice = "LED" } = useLocalSearchParams();  
    const [date, setDate] = useState(new Date());
    const [selectedDaysState, setSelectedDaysState] = useState(selectedDays ? selectedDays.split(',') : []);
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [device, setDevice] = useState(selectedDevice);
    const [scheduledValue, setScheduledValue] = useState(1); 

    useEffect(() => {
        const loadScheduledValue = async () => {
            try {
                const value = await AsyncStorage.getItem('scheduledValue');
                if (value !== null) {
                    setScheduledValue(parseInt(value, 10));
                }
            } catch (error) {
                console.log('Error loading scheduledValue', error);
            }
        };
    
        loadScheduledValue();
    
        if (selectedDays) {
            setSelectedDaysState(selectedDays.split(','));
        }
    
        if (selectedTime) {
            const restoredDate = new Date(selectedTime);  
            setDate(restoredDate); 
        }
    }, [selectedDays, selectedTime]);

    // Time change handler for DateTimePicker
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);  // Save the selected date or time
        console.log("Selected Time:", currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    // Function to format selected days for display
    const formatSelectedDays = () => {
        return selectedDaysState.length > 0 ? selectedDaysState.join(', ') : 'None';
    };

    const handleSave = () => {
        const newSchedule = JSON.stringify({
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            days: selectedDaysState.join(',') || '',
            device,
            scheduledDispenses: device === "LED" ? 1 : scheduledValue,
        });
            
        console.log('New Schedule:', newSchedule);
    
        router.push({
            pathname: '/schedulePage',
            params: { newSchedule, device },
        });
    };
    
    return (
    <GestureHandlerRootView style={styles.container}>  
        <SafeAreaView className="bg-primary h-full">
        <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10}}>
                {/* Back button */}
                <TouchableOpacity  
                    onPress={() => router.push('/schedulePage')}  // Navigate back
                    style={{padding: 10, marginLeft: 10}}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Add</Text>
                {/* Save Schedule Button */}
                <TouchableOpacity  
                    onPress={handleSave}  // Use handleSave to navigate back to schedulePage with selected data
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
                        onPress={() => router.push({ 
                            pathname: './repeatDay', 
                            params: { 
                                selectedDays: selectedDaysState.join(','), 
                                selectedTime: date.toISOString(),
                                isEditMode,
                                selectedDevice: device,
                            }})}  
                        style={{flexDirection: 'row',padding: 10}}>
                        <Text style={{ fontSize: 17, color: 'purple', marginRight: 10}}>{formatSelectedDays()}</Text>
                        <Icon 
                            name="chevron-forward-outline"
                            size={22} 
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, backgroundColor: 'grey', marginTop: 10, marginHorizontal: 10, fontWeight: 'bold'}}></View>
                {/* Select Device */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>Device</Text>
                    <TouchableOpacity
                        onPress={() => setPickerVisible(true)}  
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                    >
                        <Text style={{ fontSize: 17, color: 'purple', marginRight: 10 }}>{device}</Text>
                        <Icon name="chevron-forward-outline" size={22} color="white" />
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={isPickerVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setPickerVisible(false)}
                >
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 10, padding: 20 }}>
                            <Text style={{ fontSize: 18, marginBottom: 10 }}>Choose Device</Text>
                            <Picker
                                selectedValue={device}
                                onValueChange={(itemValue) => setDevice(itemValue)}
                                style={{ width: '100%' }}
                            >
                                <Picker.Item label="LED" value="LED" />
                                <Picker.Item label="Feeder" value="Feeder" />
                            </Picker>
                            <TouchableOpacity onPress={() => setPickerVisible(false)}>
                                <Text style={{ color: 'blue', marginTop: 10, textAlign: 'right' }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
        </SafeAreaView>
    </GestureHandlerRootView>
    );
}
