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

const AIO_USERNAME = 'jazzfaye7';  // Adafruit IO username
const AIO_KEY = 'aio_XHzM43BcDX46OMZ5ZoG0DYoN6zDr';  // Adafruit IO key
const ESP32_MQTT_TOPIC_COLOR = `${AIO_USERNAME}/feeds/led-control`;  // Define Adafruit IO topic for color
const ESP32_MQTT_TOPIC_BRIGHTNESS = `${AIO_USERNAME}/feeds/led-brightness`;  // Define Adafruit IO topic for brightness

const ColorPickerComponent = () => {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('#ff0000');  // Initial color set to red
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

  // Function to send the color data to ESP32
  const sendColorToESP32 = (color, brightness) => {
    const rgb = hexToRgb(color);
    if (rgb && mqttClient) {
      const { r, g, b } = rgb;

      // Format the color message as "r,g,b"
      const colorMessage = `${Math.round(r * brightness)},${Math.round(g * brightness)},${Math.round(b * brightness)}`;

      // Publish the color data to Adafruit IO
      const message = new Message(colorMessage);
      message.destinationName = ESP32_MQTT_TOPIC_COLOR;
      mqttClient.send(message);

      console.log(`Color sent: ${colorMessage}`);
    }
  };

  // Function to send the brightness data to ESP32
  const sendBrightnessToESP32 = (brightness) => {
    if (mqttClient) {
      // Publish the brightness value to Adafruit IO
      const message = new Message(brightness.toString());
      message.destinationName = ESP32_MQTT_TOPIC_BRIGHTNESS;
      mqttClient.send(message);

      console.log(`Brightness sent: ${brightness}`);
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
          <WheelColorPicker  
            initialColor={selectedColor}
            onColorChange={color => {
              setSelectedColor(color);
              sendColorToESP32(color, brightness);  // Send color and brightness
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
                sendBrightnessToESP32(newBrightness);  // Send brightness separately
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
                  sendBrightnessToESP32(value);  // Send brightness separately
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
                sendBrightnessToESP32(newBrightness);  // Send brightness separately
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
