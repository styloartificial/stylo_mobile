import React, { useRef, useState } from 'react';
import { View, TextInput } from 'react-native';

type CustomResetTokenProps = {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
  secureTextEntry?: boolean;
};

export default function CustomResetToken({
  value,
  onChangeText,
  length = 5,
  secureTextEntry = true,
}: CustomResetTokenProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const values = value.split('');

  const handleChangeText = (text: string, index: number) => {
    if (text && !/^\d+$/.test(text)) return;

    const newValues = [...values];
    
    if (text === '') {
      
      newValues[index] = '';
      onChangeText(newValues.join(''));
      
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else {

      const digit = text.slice(-1);
      newValues[index] = digit;
      onChangeText(newValues.join(''));
      
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center gap-3 my-5">
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          className={`w-14 h-14 bg-white rounded-2xl border-2 justify-center items-center shadow-md ${
            focusedIndex === index
              ? 'border-primary'
              : values[index]
              ? 'border-gray-300'
              : 'border-gray-200'
          }`}
        >
          <TextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={values[index] || ''}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            secureTextEntry={secureTextEntry}
            className="text-gray-800 text-2xl text-center font-semibold w-full h-full"
          />
        </View>
      ))}
    </View>
  );
}