import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface CustomSelectInputType {
  key: any;
  value: string;
  description?: string;
}

interface CustomSelectInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  items: CustomSelectInputType[];
  placeholder?: string;
  value?: any; 
  onValueChange?: (item: CustomSelectInputType) => void;
}

const CustomSelectInput: React.FC<CustomSelectInputProps> = ({
  label,
  icon,
  items,
  placeholder = 'Select your closest match',
  value,
  onValueChange,
}) => {
  
  const selectedItem = items.find((item) => item.key === value) || null;
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: CustomSelectInputType) => {
    setIsOpen(false);
    onValueChange?.(item);
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </Text>
      )}

      {/* input */}
      <TouchableOpacity
        onPress={() => setIsOpen(prev => !prev)}
        activeOpacity={0.8}
        className="flex-row items-center rounded-lg border border-border bg-white px-3 py-3"
      >
        {icon && (
          <Ionicons name={icon} size={20} color="#888" className="mr-2" />
        )}

        <Text
          className={`flex-1 text-sm ${
            selectedItem ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {selectedItem ? selectedItem.value : placeholder}
        </Text>

        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#888"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="mt-2 max-h-64 overflow-hidden rounded-lg border border-border bg-white">
          <ScrollView 
            nestedScrollEnabled={true} 
            showsVerticalScrollIndicator={true}
          >
            {items.map((item) => {
              const isSelected = selectedItem?.key === item.key;

              return (
                <TouchableOpacity
                  key={String(item.key)}
                  onPress={() => handleSelect(item)}
                  className={`px-4 py-3 ${
                    isSelected ? 'bg-active/10' : 'bg-white'
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <Text
                        className={`text-sm font-medium ${
                          isSelected
                            ? 'text-active'
                            : 'text-gray-900'
                        }`}
                      >
                        {item.value}
                      </Text>
                      
                      {item.description && (
                        <Text className="mt-1 text-xs text-gray-500 leading-4">
                          {item.description}
                        </Text>
                      )}
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#844cd3"
                        className="mt-0.5"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CustomSelectInput;