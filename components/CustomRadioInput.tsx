import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type CustomRadioButtonType = {
  key: any;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

interface CustomRadioInputProps {
  label?: string;
  items: CustomRadioButtonType[];
}

const CustomRadioInput: React.FC<CustomRadioInputProps> = ({
  label,
  items,
}) => {
  const [selectedKey, setSelectedKey] = useState(items[0]?.key);

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </Text>
      )}

      <View className="flex-row flex-wrap gap-3">
        {items.map((item) => {
          const isSelected = selectedKey === item.key;
          
          return (
            <TouchableOpacity
                key={item.key}
                onPress={() => setSelectedKey(item.key)}
                activeOpacity={0.8}
                className={`
                    px-4 py-3 rounded-full flex-row items-center
                    ${isSelected 
                    ? 'bg-primary'
                    : 'bg-gray-50 border border-gray-300'
                    }
                `}
                >
                <Text 
                    className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-gray-800'
                    }`}
                >
                    {item.value}
                </Text>
            </TouchableOpacity>

          );
        })}
      </View>
    </View>
  );
};

export default CustomRadioInput;