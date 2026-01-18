import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ButtonGlobalProps = {
  title: string;
  color: 'primary' | 'secondary';
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  shape?: 'pill' | 'rounded';
  size?: 'xs' | 'sm' | 'md';
};

const sizeConfig = {
  xs: {
    padding: 'px-3 py-2',
    text: 'text-xs',
    icon: 14,
  },
  sm: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 16,
  },
  md: {
    padding: 'px-8 py-3',
    text: 'text-sm',
    icon: 16,
  },
};

const ButtonGlobal: React.FC<ButtonGlobalProps> = ({
  title,
  color,
  icon,
  onPress,
  disabled = false,
  loading = false,
  shape = 'pill',
  size = 'md',
}) => {
  const isPrimary = color === 'primary';

  const shapeClass =
    shape === 'pill' ? 'rounded-full' : 'rounded-lg';

  const { padding, text, icon: iconSize } = sizeConfig[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`
        ${padding}
        flex-row items-center justify-center
        ${shapeClass}
        ${isPrimary
          ? 'bg-[#8F42DE]'
          : 'bg-[#F1F5F7] border border-[#8F42DE]'}
        ${(disabled || loading) ? 'opacity-50' : ''}
      `}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? '#FFFFFF' : '#8F42DE'}
        />
      ) : (
        <View className="flex-row items-center">
          {icon && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={isPrimary ? '#FFFFFF' : '#8F42DE'}
              style={{ marginRight: 6 }}
            />
          )}
          <Text
            className={`font-semibold ${text} ${
              isPrimary ? 'text-white' : 'text-[#8F42DE]'
            }`}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ButtonGlobal;
