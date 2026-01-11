import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CustomTextInput from 'components/CustomTextInput';
import CustomAlert, { AlertType } from 'components/CustomAlert';
import AuthButton from 'components/AuthButton';
import authService from 'services/authService';

type Step2Props = {
  email: string;
  otp: string;
  updateFormData: (data: { otp?: string }) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Step2({
  email,
  otp,
  updateFormData,
  onNext,
  onBack,
}: Step2Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.DANGER);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (type: AlertType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 5000);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      showAlert(AlertType.ALERT, 'Please enter verification code');
      return;
    }

    if (otp.length !== 5) {
      showAlert(AlertType.ALERT, 'Please enter 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setAlertVisible(false);

    try {
      const response = await authService.submitResetToken({
        email,
        token: otp,
      });

      const message = response?.data?.message;

      if (message && message !== 'Success') {
        showAlert(AlertType.SUCCESS, message);
      }

      setTimeout(() => {
        onNext();
      }, 1500);
      
    } catch (error: any) {
      const response = error?.response?.data;

      const errorMessage =
        response?.errors?.token?.[0] ||
        response?.message ||
        'Failed to verify OTP';

      showAlert(AlertType.ALERT, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setAlertVisible(false);

    try {
      const response = await authService.sendForgotPasswordOtp({ email });

      const message = response?.data?.message;

      if (message && message !== 'Success') {
        showAlert(AlertType.SUCCESS, message);
      } else {
        showAlert(AlertType.SUCCESS, 'OTP has been resent to your email');
      }

      updateFormData({ otp: '' });
      
    } catch (error: any) {
      const response = error?.response?.data;

      const errorMessage =
        response?.errors?.email?.[0] ||
        response?.message ||
        'Failed to resend OTP';

      showAlert(AlertType.ALERT, errorMessage);
    } finally {
      setIsResending(false);
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
          placeholder="Email"
          icon="mail-outline"
          value={email}
          editable={false}
          containerClassName="mb-4"
        />

        <CustomTextInput
          label="Verification Code"
          placeholder="Enter OTP code"
          icon="key-outline"
          value={otp}
          onChangeText={text => updateFormData({ otp: text })}
          onlyNumber
          containerClassName="mb-6"
          maxLength={5}
        />

        <AuthButton
          title={isLoading ? 'Verifying...' : 'Submit'}
          color="primary"
          icon="checkmark-outline"
          onPress={handleVerifyOtp}
          disabled={isLoading || isResending}
        />
      </View>

      <TouchableOpacity
        className="flex-row justify-center"
        onPress={handleResendOtp}
        disabled={isResending}
        activeOpacity={0.7}
      >
        <Text className="text-gray-500">
          Didn't receive the email?{' '}
          <Text className="text-primary font-medium">
            {isResending ? 'Sending...' : 'Click to resend'}
          </Text>
        </Text>
      </TouchableOpacity>
    </>
  );
}