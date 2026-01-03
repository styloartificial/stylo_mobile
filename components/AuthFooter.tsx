import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AuthFooterProps {
  type: 'register' | 'login' | 'terms-only';
  onActionPress?: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ type, onActionPress }) => {
  const renderActionSection = () => {
    if (type === 'register') {
      return (
        <View className="items-center">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity 
              onPress={onActionPress}
              activeOpacity={0.7}
            >
              <Text className="text-sm font-semibold text-[#8F42DE]">
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (type === 'login') {
      return (
        <View className="items-center">
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity 
              onPress={onActionPress}
              activeOpacity={0.7}
            >
              <Text className="text-xs font-semibold text-[#8F42DE]">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <>
      {renderActionSection()}

      <View className="mt-2 px-8">
        <Text className="w-full text-center text-xs text-gray-500 leading-5">
          By continuing, you agree to our{' '}
          <Text className="font-medium">Terms of Service</Text> and{' '}
          <Text className="font-medium">Privacy Policy</Text>
        </Text>
      </View>
    </>
  );
};

export default AuthFooter;