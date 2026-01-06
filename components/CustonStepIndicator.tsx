import React from 'react';
import { View, Text } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export const CustomStepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabel,
  activeColor = '#8F42DE',
  inactiveColor = '#E5E7EB',
}) => {
  return (
    <View className="flex-row items-center justify-between mb-2 px-3">
      <Text className="text-sm text-gray-600">
        Step {currentStep} of {totalSteps}
        {stepLabel && ` · ${stepLabel}`}
      </Text>
      
      <View className="flex-row gap-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className="w-8 h-1 rounded-full"
            style={{
              backgroundColor: currentStep > index ? activeColor : inactiveColor,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default CustomStepIndicator;