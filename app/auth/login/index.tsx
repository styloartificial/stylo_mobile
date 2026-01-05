import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import storageHelper from 'helpers/storageHelper';
import CustomTextInput from 'components/CustomTextInput';
import AuthFooter from 'components/AuthFooter';
import authService from 'services/authService';
import CustomAlert, { AlertType } from 'components/CustomAlert';
import AuthButton from 'components/AuthButton';
import { useRouter } from 'expo-router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.DANGER);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const showAlert = (type: AlertType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);

    setTimeout(() => setAlertVisible(false), 5000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert(AlertType.ALERT, 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setAlertVisible(false);

    try {
      const response = await authService.login({ email, password });
      await storageHelper.setItem('login_token', response.data.data.token);
      await storageHelper.setItem('user_data', JSON.stringify(response.data.data.user));

      showAlert(AlertType.SUCCESS, 'Login successful!');

      setTimeout(() => {
        router.replace('/dashboard/home');
      }, 500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      showAlert(AlertType.DANGER, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => console.log('Forgot password clicked');
  const handleRegister = () => console.log('Register clicked');

  return (
    <View className="mb-4 bg-white rounded-3xl shadow-lg p-6">

      <View className="mb-4">
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          Welcome back
        </Text>
        <Text className="text-sm text-gray-500">
          Use your email to continue.
        </Text>
      </View>

      {alertVisible && <CustomAlert type={alertType} message={alertMessage} />}

      <CustomTextInput
        label="Email"
        placeholder="you@example.com"
        icon="mail-outline"
        containerClassName="mb-4"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <CustomTextInput
        label="Password"
        placeholder="Enter your password"
        icon="lock-closed-outline"
        isPassword
        containerClassName="mb-3"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity 
        className="items-end mb-4"
        onPress={handleForgotPassword}
        activeOpacity={0.7}
      >
        <Text className="text-sm font-medium text-[#8F42DE]">
          Forgot password?
        </Text>
      </TouchableOpacity>

      <View className="mb-2">
        <AuthButton
          title={isLoading ? "Logging in..." : "Login"}
          color="primary"
          icon="enter-outline"
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>

      <View className="flex-row items-center mb-2">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="px-4 text-sm font-medium text-gray-400">OR</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <View className="mb-4">
        <AuthButton
          title="Login with Google"
          color="secondary"
          icon="logo-google"
          onPress={() => console.log('Google login')}
        />
      </View>

      <Text className="mt-6 text-sm leading-5 text-gray-500">
        We never post to your accounts or share your data without permission.
      </Text>

      <AuthFooter type="register" onActionPress={handleRegister} />
    </View>
  );
}