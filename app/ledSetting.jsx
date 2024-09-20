import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';

const ESP32_IP = 'http://192.168.1.245'; // ESP32 IP address

const ColorPickerComponent = () => {
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
    <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
      <WheelColorPicker  
        initialColor={selectedColor}
        onColorChange={color => {
          setSelectedColor(color);
          sendColorToESP32(color, brightness); 
        }}
        style={{width: 380, height: 400}} 
        sliderSize={30}
      />
      {/* Brightness Controls */}
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30, width: 380}}>
        {/* Minus icon */}
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
            />         
          </View>
          {/* Plus icon */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPicker: {
    width: 380,
    height: 400,
  },
  brightnessContainer: {
    flexDirection: 'row', // Aligns items horizontally
    alignItems: 'center',
    marginTop: 30,
    width: 380,
  },
  slider: {
    flex: 1, // Takes up available space between the icons
    marginHorizontal: 10,
  },
});

export default ColorPickerComponent;
