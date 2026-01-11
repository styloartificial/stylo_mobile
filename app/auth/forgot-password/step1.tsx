import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import CustomTextInput from 'components/CustomTextInput';
import CustomAlert, { AlertType } from 'components/CustomAlert';
import AuthButton from 'components/AuthButton';
import authService from 'services/authService';

type Step1Props = {
  email: string;
  updateFormData: (data: { email?: string }) => void;
  onNext: () => void;
};

export default function Step1({
  email,
  updateFormData,
  onNext,
}: Step1Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.DANGER);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (type: AlertType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);

    setTimeout(() => setAlertVisible(false), 5000);
  };

  const handleContinue = async () => {
    if (!email) {
      showAlert(AlertType.ALERT, 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert(AlertType.ALERT, 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setAlertVisible(false);

    try {
      const response = await authService.sendForgotPasswordOtp({ email });

      const message = response?.data?.message;

      if (message && message !== 'Success') {
        showAlert(AlertType.SUCCESS, message);
      }

      onNext();
    } catch (error: any) {
      const response = error?.response?.data;

      const errorMessage =
        response?.errors?.email?.[0] ||
        response?.message;

      if (errorMessage) {
        showAlert(AlertType.ALERT, errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View className="bg-white rounded-3xl shadow-lg p-6 mb-4">

        {alertVisible && (
          <CustomAlert type={alertType} message={alertMessage} />
        )}

        <CustomTextInput
          label="Email"
          placeholder="you@example.com"
          icon="mail-outline"
          containerClassName="mb-6"
          value={email}
          onChangeText={text =>
            updateFormData({ email: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AuthButton
          title={isLoading ? 'Sending...' : 'Continue'}
          color="primary"
          icon="arrow-forward-outline"
          onPress={handleContinue}
          disabled={isLoading}
        />
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center py-3"
        onPress={() => router.replace('/auth/login')}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back-outline" size={20} color="#8F42DE" />
        <Text className="text-primary ml-2 text-base font-medium">
          Back to login
        </Text>
      </TouchableOpacity>
    </>
  );
}
