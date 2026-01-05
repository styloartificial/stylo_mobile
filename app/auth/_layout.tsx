import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, Redirect } from 'expo-router';
import AuthHeader from 'components/AuthHeader';
import AuthTitle from 'components/AuthTitle';
import storageHelper from 'helpers/storageHelper';

export default function AuthLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const headerDescription = 'Smarter outfits, every day';
  const titleTitle = 'Log in to Style Your Next Look';
  const titleDescription =
    'Save your Favorites outfits and get instant AI recommendation tailored to you.';

  useEffect(() => {
    const check = async () => {
      const token = await storageHelper.getItem('login_token');
      setIsLoggedIn(!!token);
    };
    check();
  }, []);

  if (isLoggedIn === null) {
    return null; 
  }

  if (isLoggedIn) {
    return <Redirect href="/dashboard/home" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <AuthHeader description={headerDescription} />
        <AuthTitle title={titleTitle} description={titleDescription} />

        <View className="px-6">
          <Slot />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}