import { Redirect } from 'expo-router';
import storageHelper from 'helpers/storageHelper';
import { useEffect, useState } from 'react';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const token = await storageHelper.getItem('login_token');
      setTarget(token ? '/dashboard/home' : '/auth/login');
    };
    check();
  }, []);

  if (!target) return null;

  return <Redirect href={target} />;
}