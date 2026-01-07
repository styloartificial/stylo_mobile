import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleTextChange = (text: string) => {
    if (!onChangeText) return;

    if (onlyNumber) {
      onChangeText(text.replace(/[^0-9]/g, ''));
    } else {
      onChangeText(text);
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate && onChangeText) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onChangeText(formattedDate);
    }
  };

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={isDate ? 0.7 : 1}
        onPress={() => isDate && setShowDatePicker(true)}
        className="flex-row items-center rounded-lg border border-gray-200 bg-gray-50 px-3"
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#888"
            style={{ marginRight: 8 }}
          />
        )}

        {isDate ? (
          <Text className={`flex-1 py-3 ${value ? 'text-gray-900' : 'text-gray-400'}`}>
            {value || placeholder}
          </Text>
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
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()} 
        />
      )}
    </View>
  );
};

export default CustomTextInput;
