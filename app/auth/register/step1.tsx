import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CustomTextInput from 'components/CustomTextInput';
import CustomAlert, { AlertType } from 'components/CustomAlert';
import AuthButton from 'components/AuthButton';
import authService from 'services/authService';

interface Step1Props {
  formData: {
    name: string;
    email: string;
    password: string;
  };
  updateFormData: (data: Partial<Step1Props['formData']>) => void;
  onNext: () => void;
}

export default function Step1({ formData, updateFormData, onNext }: Step1Props) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Alert States
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.DANGER);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (type: AlertType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  const handleNext = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.password || !confirmPassword) {
      showAlert(AlertType.ALERT, 'Please fill in all fields');
      return;
    }

    if (formData.password !== confirmPassword) {
      showAlert(AlertType.ALERT, 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    setAlertVisible(false);

    try {
      const response = await authService.checkEmail({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const message = response?.data?.message;

      if (message && message !== 'Success') {
        showAlert(AlertType.SUCCESS, message);
      }

      onNext();

    } catch (error: any) {
      const errors = error.response?.data?.errors as Record<string, string[]> | undefined;

      const errorMessage =
        errors
          ? Object.values(errors)[0][0]
          : error.response?.data?.message || 'Registration failed';

      showAlert(AlertType.DANGER, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            Basic info
          </Text>
          <Text className="text-sm text-gray-500">
            We'll use this to personalise your experience.
          </Text>
        </View>

        {alertVisible && (
          <CustomAlert type={alertType} message={alertMessage} />
        )}

        <CustomTextInput
          label="Name"
          placeholder="Enter your full name"
          icon="person-outline"
          containerClassName="mb-4"
          value={formData.name}
          onChangeText={(text) => updateFormData({ name: text })}
          autoCapitalize="words"
        />

        <CustomTextInput
          label="Email"
          placeholder="you@example.com"
          icon="mail-outline"
          containerClassName="mb-4"
          value={formData.email}
          onChangeText={(text) => updateFormData({ email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomTextInput
          label="Password"
          placeholder="Create a strong password"
          icon="lock-closed-outline"
          isPassword
          containerClassName="mb-4"
          value={formData.password}
          onChangeText={(text) => updateFormData({ password: text })}
        />

        <CustomTextInput
          label="Confirm password"
          placeholder="Re-enter your password"
          icon="lock-closed-outline"
          isPassword
          containerClassName="mb-4"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View className="mb-2">
          <AuthButton
            title={isLoading ? 'Checking...' : 'Next'}
            color="primary"
            icon="arrow-forward-outline"
            onPress={handleNext}
            disabled={isLoading}
          />
        </View>
      </View>
    </>
  );
}
