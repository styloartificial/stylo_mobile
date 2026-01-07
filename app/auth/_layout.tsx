import { useEffect, useState } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, Redirect } from 'expo-router';
import AuthHeader from 'components/AuthHeader';
import storageHelper from 'helpers/storageHelper';

export default function AuthLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const token = await storageHelper.getItem('login_token');
      setIsLoggedIn(!!token);
    };
    check();
  }, []);

  if (isLoggedIn === null) return null;

  if (isLoggedIn) {
    return <Redirect href="/dashboard/home" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <AuthHeader description="Smarter outfits, every day" />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6">
            <Slot />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
