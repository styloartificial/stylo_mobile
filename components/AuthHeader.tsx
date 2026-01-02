import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';

type AuthHeaderProps = {
  description: string;
  onLoginPress?: () => void;
};

const AuthHeader: React.FC<AuthHeaderProps> = ({ description, onLoginPress }) => {
  return (
    <View className="mb-8 px-4">
      <View className="flex-row items-center mb-2 w-full">

        <Image
          source={require('../assets/logo/logo.png')}
          className="w-16 h-16"
          resizeMode="contain"
        />

        <View className="ml-3">
          <Text className="text-xl font-bold text-gray-900">
            Stylo AI
          </Text>
          <Text className="text-sm text-gray-500">
            {description}
          </Text>
        </View>

        <Pressable onPress={onLoginPress} className="ml-auto pr-6">
          <Text className="text-[#8F42DE] font-semibold text-sm">
            Log in
          </Text>
        </Pressable>

      </View>
    </View>
  );
};

export default AuthHeader;
