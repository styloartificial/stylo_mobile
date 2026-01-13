import { Tabs, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import storageHelper from 'helpers/storageHelper';
import CustomHeader from 'components/global/CustomHeader';
import { useRouter } from 'expo-router';

export default function DashboardLayout() {
  const DashboardHeaderMap = {
    "home": {
      title: 'Create your Stylo account',
      description: 'Save looks you love and get AI-powered outfit ideas in seconds.',
    },
    "scan": {
      title: 'Tell us about you',
      description: 'We will use your details to fine-tune sizing, colours, and fit recommendations.',
    },
  };

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const token = await storageHelper.getItem('login_token');
      setIsLoggedIn(!!token);
    };
    check();
  }, []);

  if (isLoggedIn === null) return null;

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-black">
      <CustomHeader
              title="Saved looks"
              subtitle="Your favorited AI outfit recommendations"
              rightAction="profile"
              profileImage={require('../../../assets/lucu1.jpg')}
              onProfilePress={() => router.push('/dashboard/profile')}
              
            />
      
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#8F42DE',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            backgroundColor: '#ffffff',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size || 24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="scan/index"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'scan' : 'scan-outline'} 
                size={size || 24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="saved/index"
          options={{
            title: 'Saved',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'heart' : 'heart-outline'} 
                size={size || 24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={size || 24} 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}