import { Slot, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import storageHelper from 'helpers/storageHelper';

export default function DashboardLayout() {
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

  return <Slot />;
}