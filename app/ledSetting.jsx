import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Image, StatusBar } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styles } from './AppStyles';  // Importing the styles from the new file
import { useRouter } from 'expo-router';

export const turnOnLED = () => {
  fetch(`${ESP32_IP}/turnOn`)
  .then(response => response.text())
  .then(data => console.log("LED turned on: ", data))
  .catch(error => console.error('Error', error));
}

export const turnOffLED = () => {
  fetch(`${ESP32_IP}/turnOff`)
    .then(response => response.text())
    .then(data => console.log("LED turned off: ", data))  // Fixed log message
    .catch(error => console.error('Error', error));
};

const ESP32_IP = 'http://192.168.1.47'; // ESP32 IP address

const ColorPickerComponent = () => {
  const router = useRouter(); // Go back to previous page
  const [selectedColor, setSelectedColor] = useState('#ff0000'); // Initial color set to red
  const [brightness, setBrightness] = useState(1); // Initial brightness (1 for full brightness)

  const sendColorToESP32 = (color, brightness) => {
    // Convert the hex color to RGB
    const rgb = hexToRgb(color);
    if (rgb) {
      const { r, g, b } = rgb;

      // Adjust the RGB values based on brightness
      const adjustedR = Math.round(r * brightness);
      const adjustedG = Math.round(g * brightness);
      const adjustedB = Math.round(b * brightness);
      const url = `${ESP32_IP}/setColor?r=${adjustedR}&g=${adjustedG}&b=${adjustedB}`;
    
      console.log(`Sending request to: ${url}`);
  
      // Send the color to the ESP32
      fetch(`${ESP32_IP}/setColor?r=${adjustedR}&g=${adjustedG}&b=${adjustedB}`)
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
  };

  const hexToRgb = (hex) => {
    // Convert hex to RGB
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView className="bg-primary h-full">
        <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10}}>
                {/* Back button */}
                <TouchableOpacity  
                    onPress={() => router.back()}
                    style={{padding: 10, marginLeft: 10}}>
                    <Icon 
                      name="arrow-back"  
                      size={30} 
                      color="white"  
                    />
                </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10}}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>LED Setting</Text>
        </View>
        <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
        <WheelColorPicker  
          initialColor={selectedColor}
          onColorChange={color => {
            setSelectedColor(color);
            sendColorToESP32(color, brightness); 
          }}
          style={{width: 380, height: 400}} 
          sliderSize={35}
        />
        {/* Brightness Controls */}
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30, width: 380}}>
          {/* Decrease Brightness */}
            <TouchableOpacity 
              onPress={() => {
                const newBrightness = Math.max(0, brightness - 0.1); 
                setBrightness(newBrightness);
                sendColorToESP32(selectedColor, newBrightness);
              }}
            >
              <Icon name="sunny" size={30} color="#000" /> 
            </TouchableOpacity>
            {/* Slider */}
            <View style={{position: 'relative', flex: 1, height: 40, justifyContent: 'center'}}>
              <Slider
                style={{width: '100%'}}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                value={brightness}
                onValueChange={(value) => {
                  setBrightness(value);
                  sendColorToESP32(selectedColor, value);
                }}
                minimumTrackTintColor="#FFFFFF" // Change the color for the filled section (traced part)
                maximumTrackTintColor="#FFFFFF" // Change the color for the unfilled section
              />         
            </View>
            {/* Increase Brightness */}
            <TouchableOpacity 
              onPress={() => {
                const newBrightness = Math.min(1, brightness + 0.1); 
                setBrightness(newBrightness);
                sendColorToESP32(selectedColor, newBrightness);
              }}
            >
              <Icon name="sunny" size={40} color="#000" />
            </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
    </GestureHandlerRootView>
      
    
  );
};


export default ColorPickerComponent;
