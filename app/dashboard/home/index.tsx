import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AuthButton from 'components/AuthButton';
import CustomHeader from 'components/global/CustomHeader';
import storageHelper from 'helpers/storageHelper';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await storageHelper.removeItem('login_token');
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <CustomHeader
        title="Saved looks"
        subtitle="Your favorited AI outfit recommendations"
        rightAction="profile"
        profileImage={require('../../../assets/lucu1.jpg')}
        onProfilePress={() => router.push('/dashboard/profile')}
        
      />

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
