import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type CustomRadioButtonType = {
  id: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

interface CustomRadioInputProps {
  title: string;
  description?: string;
  label?: string;
  items: CustomRadioButtonType[];
  value?: string[];
  onValueChange?: (ids: string[]) => void;
  multiSelect?: boolean;
}

const CustomRadioInput: React.FC<CustomRadioInputProps> = ({
  title,
  description,
  label,
  items,
  value = [],
  onValueChange,
  multiSelect = false,
}) => {
  const handlePress = (id: string) => {
    if (multiSelect) {
      const newValue = value.includes(id)
        ? value.filter(v => v !== id)
        : [...value, id];

      onValueChange?.(newValue);
    } else {
      onValueChange?.([id]);
    }
  };

  return (
    <View className="p-6 bg-white rounded-lg">
      <Text className="text-xl font-semibold text-gray-900 mb-1">
        {title}
      </Text>

      {description && (
        <Text className="text-sm text-gray-600 mb-4">
          {description}
        </Text>
      )}

      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-3">
          {label}
        </Text>
      )}

      <View className="flex-row flex-wrap gap-2">
        {items.map(item => {
          const isSelected = value.includes(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item.id)}
              activeOpacity={0.8}
              className={`px-4 py-2 rounded-full flex-row items-center ${
                isSelected
                  ? 'bg-primary'
                  : 'bg-white border border-gray-300'
              }`}
            >
              {item.icon && (
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={isSelected ? '#fff' : '#374151'}
                />
              )}

              <Text
                className={`ml-2 text-sm font-medium ${
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
