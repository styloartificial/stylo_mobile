import { View, Text, TextInput, TextInputProps } from 'react-native';

interface TextInputWithLabelProps extends TextInputProps {
  title: string;
  description?: string;
  label?: string;
}

export default function TextInputWithLabel({
  title,
  description,
  label,
  ...textInputProps
}: TextInputWithLabelProps) {
  return (
    <View className="mb-6 bg-white p-4 rounded-lg">
    
      <Text className="text-lg font-semibold text-gray-900 mb-1">
        {title}
      </Text>

      {description && (
        <Text className="text-sm text-gray-500 mb-4">
          {description}
        </Text>
      )}

      {label && (
        <Text className="text-sm text-gray-700 mb-2">
          {label}
        </Text>
      )}

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
        placeholderTextColor="#9CA3AF"
        {...textInputProps}
      />
    </View>
  );
}