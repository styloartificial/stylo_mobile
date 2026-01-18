import { Tabs, Redirect, useRouter, useSegments } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import storageHelper from 'helpers/storageHelper';
import CustomHeader from 'components/global/CustomHeader';

export default function DashboardLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const token = await storageHelper.getItem('login_token');
      setIsLoggedIn(!!token);
    };
    check();
  }, []);

  type DashboardTab = 'home' | 'scan' | 'saved' | 'profile';

  const DashboardHeaderMap: Record<
    DashboardTab,
    { title: string; subtitle: string }
  > = {
    home: {
      title: 'Hello, Gilang',
      subtitle: 'Ready to style your day?',
    },
    scan: {
      title: 'Scan Outfit',
      subtitle: 'Let AI analyze your style',
    },
    saved: {
      title: 'Saved looks',
      subtitle: 'Your favorited AI outfit recommendations',
    },
    profile: {
      title: 'Your Profile',
      subtitle: 'Manage your account',
    },
  };

  const isDashboardTab = (tab: string): tab is DashboardTab => {
    return tab in DashboardHeaderMap;
  };

  const activeTab = segments[segments.length - 1];
  const headerConfig = isDashboardTab(activeTab)
    ? DashboardHeaderMap[activeTab]
    : null;

  if (isLoggedIn === null) return null;

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <SafeAreaView edges={['top','bottom','right', 'left']} className="flex-1 bg-white">
      {headerConfig && (
        <CustomHeader
          title={headerConfig.title}
          subtitle={headerConfig.subtitle}
          rightAction="profile"
          profileImage={require('../../assets/lucu1.jpg')}
          onProfilePress={() => router.push('/dashboard/profile')}
        />
      )}

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