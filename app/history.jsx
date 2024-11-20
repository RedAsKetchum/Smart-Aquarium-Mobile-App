import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import TemperatureIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TurbidityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PHIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FoodIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // Icon for dispenser "Type"
import AmountIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // Icon for dispenser "Amount"

const AIO_USERNAME = 'RedAsKetchum';
const AIO_KEY = 'aio_Ecnw98E4ugDJ18vonFBSkLymwvwj';
const SENSOR_FEED_KEY = 'temperature-sensor';
const DISPENSER_FEED_KEY = 'servo-control';  
const SENSOR_FEED_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${SENSOR_FEED_KEY}/data?limit=168`;
const DISPENSER_FEED_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${DISPENSER_FEED_KEY}/data?limit=200`;

const RenderItem = React.memo(({ item, isDispenser }) => (

  <View className="p-3 bg-white rounded-lg m-3 shadow-sm flex-row">
    <View style={{ flex: 1 }}>
      <Text className="font-bold text-lg text-black">
        {isDispenser ? item.Time : `${item.Date}  ${item.Sensor1Timestamp}`}
      </Text>
    </View>
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginTop: 8 }}>
      {isDispenser ? (
        <>
          {/* Display Type (Manual) Icon and Text */}
          <View className="flex-row items-center">
            <FoodIcon name="fishbowl" size={18} color="#FFA500" />
            <Text className="text-black text-base ml-2">Type: </Text>
            <Text className="text-black text-base">{item.Type}</Text>
          </View>
          
          <View className="flex-row items-center mt-1">
            <AmountIcon name="scale" size={18} color="#9c9e9f" />
            <Text className="text-black text-base ml-2">{`Amount: ${item.Amount}`}</Text>
          </View>
        </>
      ) : (
        <>
          <View className="flex-row items-center">
            <TemperatureIcon name="thermometer" size={18} color="#ff1a1a" />
            <Text className="text-black text-base ml-2">{`Temperature: ${item.Sensor1} °F`}</Text>
          </View>
          {/* <View className="flex-row items-center mt-1">
            <TurbidityIcon name="water" size={18} color="#2489FD" />
            <Text className="text-black text-base ml-2">{`Turbidity: ${item.Sensor3} NTU`}</Text>
          </View> */}

          <View className="flex-row items-center mt-1">
            <TurbidityIcon name="water" size={18} color="#2489FD" />
            <Text className="text-black text-base ml-2">
              {`Turbidity: ${
                item.Sensor3 >= 3.2
                  ? 'Clean'
                  : item.Sensor3 >= 2.0 && item.Sensor3 < 3.2
                  ? 'Murky'
                  : 'Dark'
              }`}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            <PHIcon name="test-tube" size={18} color="#9933ff" />
            <Text className="text-black text-base ml-2">{`pH Level: ${item.Sensor2}`}</Text>
          </View>
        </>
      )}
    </View>
  </View>
));

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);
  const [isDispenser, setIsDispenser] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchHistoryData = async () => {
    setLoading(true);
    const url = isDispenser ? DISPENSER_FEED_URL : SENSOR_FEED_URL;
    try {
      const response = await fetch(url, {
        headers: {
          'X-AIO-Key': AIO_KEY,
        },
      });
      const data = await response.json();

      const parsedData = data.map((item) => {
        try {
          const parsedValue = JSON.parse(item.value);
          console.log(parsedValue); // Add this line to inspect the structure
          if (parsedValue && typeof parsedValue === 'object') {
            return parsedValue;
          }
          return null;
        } catch (error) {
          console.error('Invalid JSON:', item.value);
          return null;
        }
      }).filter(item => item !== null);

      const uniqueData = isDispenser
        ? parsedData
        : parsedData.filter((item, index, self) =>
            index === self.findIndex((t) => t.ID === item.ID)
          );

      if (isDispenser) {
        const formattedDispenserData = uniqueData.map(item => {
          // Debugging Type field presence
          console.log(item.Type); // Check if Type exists in the item
          return {
            Type: item.Type, // Ensure Type is correctly mapped
            Amount: item.Amount,
            Time: item.Time,
          };
        });
        setHistoryData(formattedDispenserData);
      } else {
        const formattedSensorData = uniqueData.map(item => ({
          Sensor1: item.Sensor1,
          Sensor2: item.Sensor2,
          Sensor3: item.Sensor3,
          Sensor1Timestamp: item.Sensor1Timestamp,
          Sensor2Timestamp: item.Sensor2Timestamp,
          Sensor3Timestamp: item.Sensor3Timestamp,
          Date: item.Date,
        }));
        setHistoryData(formattedSensorData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [isDispenser]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground 
        source={require('../assets/images/gradient.png')} 
        className="flex-1 absolute top-0 left-0 right-0 bottom-0" 
        resizeMode="cover"
      />

      <View className="flex-row items-center justify-center px-4 mt-2 mb-6 relative">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="absolute left-0 p-2"
        >
          <Icon name="arrow-back" size={35} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white text-center">History</Text>

        <TouchableOpacity 
          onPress={() => setIsDispenser(!isDispenser)}
          className="absolute right-0 p-2"
        >
          <Text className="text-white text-lg font-bold">{isDispenser ? 'Sensors' : 'Dispenser'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <FlatList
          data={historyData}
          renderItem={({ item }) => <RenderItem item={item} isDispenser={isDispenser} />}
          keyExtractor={(item, index) => {
            return item.ID ? item.ID.toString() : `${item.Sensor1Timestamp}-${item.Sensor2}-${item.Sensor3}-${index}`;
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
