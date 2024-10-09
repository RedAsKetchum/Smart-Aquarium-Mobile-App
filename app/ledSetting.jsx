import React, { useState } from 'react';
import { View, Text } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';

const ColorPickerComponent = () => {
  const [selectedColor, setSelectedColor] = useState('#ff0000'); // Initial color set to red

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ marginBottom: 20 }}>Selected Color: {selectedColor}</Text>
      <WheelColorPicker
        initialColor={selectedColor}
        onColorChange={color => setSelectedColor(color)} // Updates the selected color
        style={{ width: 300, height: 300 }} // Adjust the size of the color wheel
      />
    </View>
  );
};

export default ColorPickerComponent;