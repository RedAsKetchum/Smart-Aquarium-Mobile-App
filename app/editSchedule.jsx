import React, { useEffect, useState } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter, useLocalSearchParams } from 'expo-router';  // Use router and useLocalSearchParams
import { styles } from './AppStyles';  // Importing the styles from the new file
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'; 
import { Picker } from '@react-native-picker/picker';

// Adafruit IO Configuration
const ADAFRUIT_IO_USERNAME = 'RedAsKetchum';  // Replace with your Adafruit IO username
const ADAFRUIT_IO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Replace with your Adafruit IO key
const ADAFRUIT_IO_FEED = 'feeding-schedule';  // Replace with your Adafruit IO feed

export default function EditSchedule() {
    const router = useRouter();
    const { selectedDays, selectedTime, id, isEditMode } = useLocalSearchParams();

    const [date, setDate] = useState(new Date());
    const [selectedDaysState, setSelectedDaysState] = useState(selectedDays ? selectedDays.split(',') : []);
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState("LED");

    useEffect(() => {
        if (isEditMode) {
            
            if (selectedDays) {
                setSelectedDaysState(selectedDays.split(','));
            }
    
            if (selectedTime) {
                const timeParts = selectedTime.split(':');
                if (timeParts.length === 2) {
                    const [hours, minutes] = timeParts;
                    const restoredDate = new Date();
                    restoredDate.setHours(parseInt(hours));
                    restoredDate.setMinutes(parseInt(minutes));
                    setDate(restoredDate);
                }
            }

            if (selectedDevice) {
                setSelectedDevice(selectedDevice);
            }
        }
    }, [isEditMode, selectedDays, selectedTime, selectedDevice]);
    

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const formatSelectedDays = () => {
        return selectedDaysState.length > 0 ? selectedDaysState.join(', ') : 'None';
    };

    // Save the updated schedule to Adafruit IO
    const handleSave = async () => {
        const newSchedule = {
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            days: selectedDaysState.join(','),  // Send updated days as a string
            enabled: true,  // Enable by default
            executed: false,  // Set executed to false initially
            device: selectedDevice  // Include selected device type
        };
    
        if (isEditMode) {
            // Edit existing schedule
            if (!id) {
                Alert.alert("Error", "No schedule ID provided for editing.");
                return;
            }
    
            const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data/${id}`;
    
            try {
                const response = await axios.put(url, {
                    value: JSON.stringify(newSchedule)
                }, {
                    headers: {
                        'X-AIO-Key': ADAFRUIT_IO_KEY
                    }
                });
    
                console.log("Schedule updated on Adafruit IO:", response.data);
                router.push('/schedulePage');
            } catch (error) {
                console.error('Error updating schedule:', error);
                Alert.alert('Error', 'Failed to update schedule on Adafruit IO.');
            }
        } else {
            // Add a new schedule
            const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data`;
    
            try {
                const response = await axios.post(url, {
                    value: JSON.stringify(newSchedule)
                }, {
                    headers: {
                        'X-AIO-Key': ADAFRUIT_IO_KEY
                    }
                });
    
                console.log("New schedule added to Adafruit IO:", response.data);
                router.push('/schedulePage');
            } catch (error) {
                console.error('Error adding new schedule:', error);
                Alert.alert('Error', 'Failed to add new schedule to Adafruit IO.');
            }
        }
    };
    
    const deleteSchedule = async () => {
        if (!id) {
            Alert.alert("Error", "No schedule ID provided.");
            return;
        }
    
        const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data/${id}`;  // Delete the schedule by id
    
        try {
            const response = await axios.delete(url, {
                headers: {
                    'X-AIO-Key': ADAFRUIT_IO_KEY
                }
            });
    
            console.log("Schedule deleted from Adafruit IO:", response.data);
            Alert.alert("Success", "Schedule deleted successfully.");
            router.push('/schedulePage');  // Navigate back to the schedule page after deletion
        } catch (error) {
            console.error('Error deleting schedule:', error);
            Alert.alert('Error', 'Failed to delete schedule from Adafruit IO.');
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>  
            <SafeAreaView className="bg-primary h-full">
            <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10}}>
                    <TouchableOpacity  
                        onPress={() => router.push('/schedulePage')}
                        style={{padding: 10, marginLeft: 10}}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
                        {isEditMode ? 'Edit' : 'Add'} Schedule
                    </Text>
                    <TouchableOpacity  
                        onPress={handleSave}
                        style={{padding: 10, marginRight: 10}}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ height: '100%', marginTop: 10}}>
                    <View style={{width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginHorizontal: 15, marginTop: 45, marginBottom:45}}>
                        {/* Start Time */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>Start Time</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>  
                                <DateTimePicker
                                    testID="TimePicker"
                                    value={date}  // Correctly displays the selectedTime
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
                                            id,  
                                            isEditMode: true,  
                                        }
                                    })}  
                                    style={{flexDirection: 'row',padding: 10}}>
                                    <Text style={{ fontSize: 17, color: 'purple', marginRight: 10 }}>{formatSelectedDays()}</Text>
                                    <Icon 
                                        name="chevron-forward-outline"
                                        size={22} 
                                        color="white"
                                    />
                                </TouchableOpacity>
                        </View>
                        <View style={{ height: 1, backgroundColor: 'grey', marginTop: 10, marginHorizontal: 10, fontWeight: 'bold'}}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 17,  color: 'white', marginLeft: 10}}>Device</Text>
                    <TouchableOpacity
                        onPress={() => setPickerVisible(true)}  
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                    >
                        <Text style={{ fontSize: 17, color: 'purple', marginRight: 10 }}>{selectedDevice}</Text>
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
                                selectedValue={selectedDevice}
                                onValueChange={(itemValue) => setSelectedDevice(itemValue)}
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
                    <TouchableOpacity style={[styles.buttons, { borderRadius: 30, height: 65, marginTop: 50}]} 
                    onPress={deleteSchedule}>
                    <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>Delete Schedule</Text>
                </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
