import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthButton from 'components/AuthButton';
import storageHelper from 'helpers/storageHelper';

interface HomePageProps {
  onLogout?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout }) => {
  const handleLogout = async () => {
    // Hapus token
    await storageHelper.removeItem('login_token');
    
    // Panggil callback untuk refresh auth state
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-4 text-3xl font-bold text-gray-800">
          Welcome to HomePage!
        </Text>

        <AuthButton
          title="Logout"
          color="secondary"
          icon="log-out-outline"
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;