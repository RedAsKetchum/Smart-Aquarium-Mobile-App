import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

// Destructuring the props to pass on as properties rather an individual arguments ({})
const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
      onPress={handlePress} 
      activeOpacity={0.7} 
      className={`bg-gray-50/40 rounded-xl min-h-[95px] flex flex-row justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : '' }`}
      disabled={isLoading}>
        
        {/* The use of `{}` makes the part dynamic so you can pass on values from a variable */}
        <Text className={`text-white font-psemibold text-lg ${textStyles}`}> {title} </Text>    
 
    </TouchableOpacity>
  );
};

export default CustomButton;

