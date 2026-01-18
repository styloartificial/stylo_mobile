import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TipsRecommendation = ({ 
  title = "Pro tips for better recommendations",
  tips = [
    "Capture your full body from head to shoes.",
    "Use bright, even lighting (avoid strong shadows).",
    "Stand against a simple, neutral background.",
    "Avoid motion blur by holding your phone steady."
  ]
}) => {
  return (
    <View className="p-4 bg-white rounded-lg">

      <View className="flex-row items-center gap-3 mb-4 ">
        <View className="w-10 h-10 bg-primary rounded-full items-center justify-center">
          <Ionicons name="bulb" size={18} color="white" />
        </View>
        <Text className="text-base font-semibold text-gray-800 flex-1">
          {title}
        </Text>
      </View>

      <View className="space-y-3">
        {tips.map((tip, index) => (
          <View key={index} className="flex-row items-start gap-2 mb-1">
            <Text className="text-gray-400 mt-1">•</Text>
            <Text className="text-gray-600 text-sm flex-1 leading-relaxed">
              {tip}
            </Text>
          </View>
        ))}
      </View>

    </View>
  );
};

export default TipsRecommendation;