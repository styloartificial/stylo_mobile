import React from 'react';
import { View, Text } from 'react-native';

type AuthTitleProps = {
  title: string;
  description: string;
};

const AuthTitle: React.FC<AuthTitleProps> = ({ title, description }) => {
  return (
    <View className="mb-4 px-2">
      <Text className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
        {title}
      </Text>
      <Text className="text-base text-gray-500 leading-relaxed">
        {description}
      </Text>
    </View>
  );
};

export default AuthTitle;