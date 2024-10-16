import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

const AIO_USERNAME = 'RedAsKetchum';  // Your Adafruit IO username
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Your Adafruit IO key
const FEED_KEY = 'temperature-sensor';  // Your specific feed key
const FEED_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data`;  // Feed URL

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);

  // Fetch data from Adafruit IO
  const fetchHistoryData = async () => {
    try {
      const response = await fetch(FEED_URL, {
        headers: {
          'X-AIO-Key': AIO_KEY,
        },
      });
      const data = await response.json();  // Fetch the array of data
      const parsedData = data.map((item) => JSON.parse(item.value));  // Parse each JSON string
      setHistoryData(parsedData);  // Set the state with parsed data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data once when the component is mounted
  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Render each item in FlatList
  const renderItem = ({ item }) => (
    <View className="py-4 px-4">
      <Text className="text-gray-500">{`Time: ${item.Sensor1Timestamp}`}</Text>
      <Text className="text-black">{`Temperature: ${item.Sensor1}`}</Text>

      <Text className="text-gray-500 mt-2">{`Time: ${item.Sensor2Timestamp}`}</Text>
      <Text className="text-black">{`pH Level: ${item.Sensor2}`}</Text>

      <Text className="text-gray-500 mt-2">{`Time: ${item.Sensor3Timestamp}`}</Text>
      <Text className="text-black">{`Turbidity: ${item.Sensor3}`}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">

        {/* Keep the ImageBackground */}
        <ImageBackground 
          source={require('../assets/images/gradient.png')} 
          className="flex-1 absolute top-0 left-0 right-0 bottom-0" 
          resizeMode="cover"
        ></ImageBackground>

      <View className="flex-row items-center justify-center px-4 mt-2 relative">
        {/* Back button */}
        <TouchableOpacity 
                onPress={() => router.push('/')} 
                className="absolute left-0 p-2" >
                <Icon name="arrow-back" size={35} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold mb-2 text-white text-center">History</Text>
     </View>

      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.ID.toString()}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-300 mx-4" />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
