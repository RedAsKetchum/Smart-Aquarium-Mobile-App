import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Slider from '@react-native-community/slider';
import WheelColorPicker from 'react-native-wheel-color-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styles } from './AppStyles';  // Importing the styles from the new file
import { useRouter } from 'expo-router';
import { Client, Message } from 'paho-mqtt';  // Correct import for Paho MQTT

const AIO_USERNAME = 'RedAsKetchum';  // Adafruit IO username
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Adafruit IO key
const ESP32_MQTT_TOPIC_COLOR = `${AIO_USERNAME}/feeds/led-control`;  // Define Adafruit IO topic for color

const ColorPickerComponent = () => {
  const router = useRouter();
  
  // Set initial color to green to match the ESP32 default
  const [selectedColor, setSelectedColor] = useState('#00ff00');  // Default to green (RGB: 0, 255, 0)
  const [brightness, setBrightness] = useState(1);  // Initial brightness (1 for full brightness)
  const [mqttClient, setMqttClient] = useState(null);

  useEffect(() => {
    // Initialize the MQTT client using Paho with a unique Client ID
    const client = new Client('wss://io.adafruit.com/mqtt', `mqtt-client-${Date.now()}`);  // Ensure Client ID is unique

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Connection lost:', responseObject.errorMessage);
      }
    };

    client.onMessageArrived = (message) => {
      console.log('Message arrived:', message.payloadString);
    };

    // Connect to Adafruit IO using MQTT over WebSocket
    client.connect({
      useSSL: true,  // For secure WebSocket connections
      userName: AIO_USERNAME,
      password: AIO_KEY,
      onSuccess: () => {
        console.log('Connected to Adafruit IO via Paho MQTT WebSocket');
        setMqttClient(client);

        // Send the default color (green) and brightness when the app connects to match the ESP32 default
        sendColorAndBrightnessToESP32('#00ff00', 1);  // Green color with full brightness
      },
      onFailure: (err) => {
        console.error('Connection error:', err);
      },
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  // Function to send both color and brightness to ESP32
  const sendColorAndBrightnessToESP32 = (color, brightness) => {
    const rgb = hexToRgb(color);
    if (rgb && mqttClient) {
      const { r, g, b } = rgb;

      // Format the color message as "r,g,b"
      const colorMessage = `${Math.round(r * brightness)},${Math.round(g * brightness)},${Math.round(b * brightness)}`;

      // Publish the color and brightness data to Adafruit IO
      const message = new Message(colorMessage);
      message.destinationName = ESP32_MQTT_TOPIC_COLOR;
      mqttClient.send(message);

      console.log(`Color and brightness sent: ${colorMessage}`);
    }
  };

  // Helper function to convert HEX to RGB
  const hexToRgb = (hex) => {
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
          {/* Make sure the initialColor is set to selectedColor */}
          <WheelColorPicker  
            color={selectedColor}  // Set color prop to selectedColor to reflect changes
            onColorChange={color => {
              setSelectedColor(color);
              sendColorAndBrightnessToESP32(color, brightness);  // Send color and brightness together
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
                sendColorAndBrightnessToESP32(selectedColor, newBrightness);  // Send color and brightness together
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
                  sendColorAndBrightnessToESP32(selectedColor, value);  // Send color and brightness together
                }}
                minimumTrackTintColor="#FFFFFF" 
                maximumTrackTintColor="#FFFFFF" 
              />         
            </View>
            {/* Increase Brightness */}
            <TouchableOpacity 
              onPress={() => {
                const newBrightness = Math.min(1, brightness + 0.1); 
                setBrightness(newBrightness);
                sendColorAndBrightnessToESP32(selectedColor, newBrightness);  // Send color and brightness together
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
