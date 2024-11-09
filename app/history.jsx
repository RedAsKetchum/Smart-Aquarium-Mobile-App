import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import TemperatureIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // For example icon
import TurbidityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PHIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const AIO_USERNAME = 'RedAsKetchum';
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';
const FEED_KEY = 'temperature-sensor';
const FEED_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data?limit=168`;

const RenderItem = React.memo(({ item }) => (
  <View className="p-3 bg-white rounded-lg m-3 shadow-sm flex-row">
    <View style={{ flex: 1 }}>
      <Text className="font-bold text-lg text-black">{`${item.Date}  ${item.Sensor1Timestamp}`}</Text>
    </View>
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginTop: 8 }}>
      <View className="flex-row items-center">
        <TemperatureIcon name="thermometer" size={18} color="#FF6347" />
        <Text className="text-black text-base ml-2">{`Temperature: ${item.Sensor1} °F`}</Text>
      </View>
      <View className="flex-row items-center mt-1">
        <TurbidityIcon name="water" size={18} color="#1E90FF" />
        <Text className="text-black text-base ml-2">{`Turbidity: ${item.Sensor3} NTU`}</Text>
      </View>
      <View className="flex-row items-center mt-1">
        <PHIcon name="test-tube" size={18} color="#32CD32" />
        <Text className="text-black text-base ml-2">{`pH Level: ${item.Sensor2}`}</Text>
      </View>
    </View>
  </View>
));

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);
  const navigation = useNavigation();

  const fetchHistoryData = async () => {
    try {
      const response = await fetch(FEED_URL, {
        headers: {
          'X-AIO-Key': AIO_KEY,
        },
      });
      const data = await response.json();
      const parsedData = data.map((item) => JSON.parse(item.value));

      const uniqueData = parsedData.filter((item, index, self) =>
        index === self.findIndex((t) => t.ID === item.ID)
      );

      setHistoryData(uniqueData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground 
        source={require('../assets/images/gradient.png')} 
        className="flex-1 absolute top-0 left-0 right-0 bottom-0" 
        resizeMode="cover"
      ></ImageBackground>

      <View className="flex-row items-center justify-center px-4 mt-2 mb-6 relative">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="absolute left-0 p-2"
        >
          <Icon name="arrow-back" size={35} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white text-center">History</Text>

        <TouchableOpacity 
          onPress={() => console.log('Dispenses button pressed')}
          className="absolute right-0 p-2"
        >
          <Text className="text-white text-lg font-bold">Dispenses</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={historyData}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item, index) => {
          // Check if 'ID' exists and is unique, if not, fall back to a combination of properties.
          return item.ID ? item.ID.toString() : `${item.Sensor1Timestamp}-${item.Sensor2}-${item.Sensor3}-${index}`;
        }}
        
        //ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-300 mx-4" />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
