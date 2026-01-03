import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomTextInputProps {
  label?: string;
  placeholder: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onlyNumber?: boolean;
  isPassword?: boolean;
  isDate?: boolean;
  containerClassName?: string; 
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  isRequired?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  icon,
  onlyNumber = false,
  isPassword = false,
  isDate = false,
  containerClassName = 'mb-4',
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  isRequired = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleDatePress = () => {
    if (onChangeText) {
      onChangeText(new Date().toISOString().slice(0, 10));
    }
  };

  const handleTextChange = (text: string) => {
    if (onChangeText) {
      if (onlyNumber) {
        onChangeText(text.replace(/[^0-9]/g, ''));
      } else {
        onChangeText(text);
      }
    }
  };

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </Text>
      )}

      <View className="flex-row items-center rounded-lg border border-gray-200 bg-gray-50 px-3">
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#888"
            className="mr-2"
          />
        )}

        {isDate ? (
          <TouchableOpacity
            onPress={handleDatePress}
            className="flex-1 py-2"
          >
            <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
              {value || placeholder}
            </Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            className="flex-1 py-3 text-gray-900"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={handleTextChange}
            keyboardType={onlyNumber ? 'numeric' : keyboardType}
            secureTextEntry={isPassword && !showPassword}
            autoCapitalize={autoCapitalize}
          />
        )}

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="ml-2"
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomTextInput;