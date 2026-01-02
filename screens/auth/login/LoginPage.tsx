import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AuthScreen from '../AuthScreen';
import CustomTextInput from 'components/CustomTextInput';
import AuthButton from 'components/AuthButton';
import storageHelper from 'helpers/storageHelper';

interface LoginPageProps {
  onLogin?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const handleLogin = async () => {
    // Simulasi login - simpan token
    await storageHelper.setItem('login_token', 'dummy_token_12345');
    
    // Panggil callback untuk refresh auth state
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <AuthScreen
      headerDescription="Smarter outfits, every day"
      titleTitle="Log in to Style Your Next Look"
      titleDescription="Save your Favorites outfits and get instant AI recommendation tailored to you."
    >
      <View className="mx-6 bg-gray-200 rounded-3xl shadow-lg p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back
          </Text>
          <Text className="text-gray-500 text-sm">
            Use your email to continue.
          </Text>
        </View>
      </View>
        
      <View className="px-6">
        <CustomTextInput
          label="Email"
          placeholder="Enter your email"
          icon="mail-outline"
        />

        <CustomTextInput
          label="Password"
          placeholder="Enter your password"
          icon="lock-closed-outline"
          isPassword
        />
      </View>

      <TouchableOpacity className="items-end mb-6">
        <Text className="text-teal-500 text-sm font-medium">
          Forgot password?
        </Text>
      </TouchableOpacity>

      <AuthButton
        title="Login"
        color="primary"
        icon="enter-outline"
        onPress={handleLogin}
      />

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="px-4 text-sm text-gray-400 font-medium">
          OR
        </Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      <AuthButton
        title="Login with Google"
        color="secondary"
        icon="logo-google"
        onPress={() => {}}
      />

      <Text className="text-center text-gray-500 text-xs mt-6 leading-5">
          We never post to your accounts or share your data without permission.
      </Text>    
      
    </AuthScreen>
  );
};

export default LoginPage;