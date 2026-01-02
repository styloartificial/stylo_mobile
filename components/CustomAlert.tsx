import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export enum AlertType {
  SUCCESS = 'success',
  DANGER = 'danger',
  ALERT = 'alert',
}

interface CustomAlertProps {
  type: AlertType;
  message: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ type, message }) => {
  const alertConfig = {
    [AlertType.SUCCESS]: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: '#10B981',
      icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
    },
    [AlertType.DANGER]: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: '#EF4444',
      icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
    },
    [AlertType.ALERT]: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: '#F59E0B',
      icon: 'warning' as keyof typeof Ionicons.glyphMap,
    },
  };

  const config = alertConfig[type];

  return (
    <View
      className={`
        flex-row items-center rounded-lg border px-4 py-3 mb-4
        ${config.bgColor} ${config.borderColor}
      `}
    >
      <Ionicons
        name={config.icon}
        size={22}
        color={config.iconColor}
        style={{ marginRight: 12 }}
      />

      <Text className={`flex-1 text-sm font-medium ${config.textColor}`}>
        {message}
      </Text>
    </View>
  );
};

export default CustomAlert;