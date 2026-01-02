import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import './global.css';
import storageHelper from 'helpers/storageHelper';
import LoginPage from 'screens/auth/login/LoginPage';
import HomePage from 'screens/dashboard/home/HomePage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await storageHelper.getItem('login_token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  };

  // Function untuk refresh auth state (dipanggil setelah login/logout)
  const refreshAuthState = async () => {
    const token = await storageHelper.getItem('login_token');
    setIsLoggedIn(!!token);
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {isLoggedIn ? (
        <HomePage onLogout={refreshAuthState} />
      ) : (
        <LoginPage onLogin={refreshAuthState} />
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}