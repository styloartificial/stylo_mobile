import React, { useState } from 'react';
import { View } from 'react-native';
import CustomTextInput from 'components/CustomTextInput';
import CustomAlert, { AlertType } from 'components/CustomAlert';
import AuthButton from 'components/AuthButton';
import authService from 'services/authService';

type Step3Props = {
  email: string;
  otp: string;
  newPassword: string;
  updateFormData: (data: { newPassword?: string }) => void;
  onBack: () => void;
  onSuccess: () => void;
};

export default function Step3({
  email,
  otp,
  newPassword,
  updateFormData,
  onBack,
  onSuccess,
}: Step3Props) {
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showAlert(AlertType.ALERT, 'Please fill all fields');
      return;
    }

    if (newPassword.length < 8) {
      showAlert(
        AlertType.ALERT,
        'Password must be at least 8 characters'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert(AlertType.ALERT, 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    setAlertVisible(false);

    try {
      const response = await authService.changePassword({
        email,
        token: otp,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      const message = response?.data?.message || 'Password successfully changed';

      showAlert(AlertType.SUCCESS, message);

      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error: any) {
      const response = error?.response?.data;

      const errorMessage =
        response?.errors?.new_password?.[0] ||
        response?.errors?.password?.[0] ||
        response?.message ||
        'Failed to change password';

      showAlert(AlertType.ALERT, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        label="New Password"
        placeholder="Min. 8 characters"
        icon="lock-closed-outline"
        isPassword
        value={newPassword}
        onChangeText={text =>
          updateFormData({ newPassword: text })
        }
        containerClassName="mb-4"
      />

      <CustomTextInput
        label="Confirm New Password"
        placeholder="Re-enter password"
        icon="lock-closed-outline"
        isPassword
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        containerClassName="mb-6"
      />

      <AuthButton
        title={isLoading ? 'Changing...' : 'Change Password'}
        color="primary"
        icon="checkmark-outline"
        onPress={handleChangePassword}
        disabled={isLoading}
      />
      <View className='mt-6'>
        <AuthButton
            title="Back"
            color="secondary"
            onPress={onBack}
            disabled={isLoading}
        />
      </View>
    </View>
  );
}