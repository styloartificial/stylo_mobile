import React from 'react';
import { View, Text } from 'react-native';
import ButtonGlobal from 'components/global/ButtonGlobal'; // Sesuaikan path-nya
import { Ionicons } from '@expo/vector-icons';

interface NextStepButtonProps {
  promptText: string;
  buttonText: string;
  buttonIcon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}

const NextStepButton: React.FC<NextStepButtonProps> = ({
  promptText,
  buttonText,
  buttonIcon = 'sparkles',
  onPress,
  disabled = false,
}) => {
  return (
    <View className="flex-row items-center justify-between px-6 py-3 bg-white">
      
      <Text className="text-sm text-gray-500 flex-1 mr-3 ">
        {promptText}
      </Text>

      <ButtonGlobal
        color="primary"
        title={buttonText}
        onPress={onPress}
        icon={buttonIcon}
        disabled={disabled}
        
      />
    </View>
  );
};

export default NextStepButton;