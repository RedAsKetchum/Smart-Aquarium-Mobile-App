import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

const AIO_USERNAME = 'RedAsKetchum';  // Your Adafruit IO username
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Your Adafruit IO key
const FEED_KEY = 'temperature-sensor';  // Your specific feed key
const FEED_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data`;  // Feed URL

// Memoized component for rendering each item
const RenderItem = React.memo(({ item }) => (
  <View className="py-4 px-4">
    <Text className="font-bold">{`Date: ${item.Date}`}</Text>
    <Text className="text-gray-500">{`Time: ${item.Sensor1Timestamp}`}</Text>
    <Text className="text-black">{`Temperature: ${item.Sensor1}`}</Text>

    <Text className="text-gray-500 mt-2">{`Time: ${item.Sensor2Timestamp}`}</Text>
    <Text className="text-black">{`pH Level: ${item.Sensor2}`}</Text>

    <Text className="text-gray-500 mt-2">{`Time: ${item.Sensor3Timestamp}`}</Text>
    <Text className="text-black">{`Turbidity: ${item.Sensor3}`}</Text>

  </View>
));

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);

  // Fetch data from Adafruit IO and remove duplicates and handles malformed entries
// const fetchHistoryData = async () => {
//   try {
//     const response = await fetch(FEED_URL, {
//       headers: {
//         'X-AIO-Key': AIO_KEY,
//       },
//     });
//     const data = await response.json();  // Fetch the array of data
    
//     // Debugging: Log the fetched data before parsing
//     console.log('Fetched data:', data);

//     const parsedData = data.map((item) => {
//       try {
//         console.log('Raw item value:', item.value);  // Debugging: log raw JSON string
//         return JSON.parse(item.value);  // Parse each JSON string
//       } catch (error) {
//         console.error('Error parsing JSON:', error, item.value);  // Log the exact error and problematic JSON
//         return null;  // Return null to handle malformed JSON
//       }
//     }).filter(Boolean);  // Remove null values caused by parsing failures

//     // Remove duplicates based on the ID field
//     const uniqueData = parsedData.filter((item, index, self) =>
//       index === self.findIndex((t) => t.ID === item.ID)
//     );

//     setHistoryData(uniqueData);  // Set the state with de-duplicated data
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

  // Fetch data from Adafruit IO and remove duplicates
  const fetchHistoryData = async () => {
    try {
      const response = await fetch(FEED_URL, {
        headers: {
          'X-AIO-Key': AIO_KEY,
        },
      });
      const data = await response.json();  // Fetch the array of data
      const parsedData = data.map((item) => JSON.parse(item.value));  // Parse each JSON string

      // Remove duplicates based on the ID field
      const uniqueData = parsedData.filter((item, index, self) =>
        index === self.findIndex((t) => t.ID === item.ID)
      );

      setHistoryData(uniqueData);  // Set the state with de-duplicated data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data once when the component is mounted
  useEffect(() => {
    fetchHistoryData();
  }, []);

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
        renderItem={({ item }) => <RenderItem item={item} />}  // Use memoized component
        keyExtractor={(item, index) => {
          const key = item.ID ? item.ID.toString() : index.toString();
          return key;
        }}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-300 mx-4" />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
