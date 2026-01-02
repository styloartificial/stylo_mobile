import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AuthButtonProps = {
  title: string;
  color: 'primary' | 'secondary';
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const AuthButton: React.FC<AuthButtonProps> = ({ 
  title, 
  color, 
  icon, 
  onPress,
  disabled = false,
  loading = false
}) => {
  const isPrimary = color === 'primary';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`
        w-[300px] py-3 rounded-full flex-row items-center justify-center
        ${isPrimary ? 'bg-[#8F42DE]' : 'bg-[#F1F5F7]'}
        ${(disabled || loading) ? 'opacity-50' : ''}
      `}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#8F42DE'} />
      ) : (
        <View className="flex-row items-center">
          {icon && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={isPrimary ? '#FFFFFF' : '#8F42DE'}
              style={{ marginRight: 8 }}
            />
          )}
          <Text 
            className={`text-base font-semibold ${
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

export default AuthButton;