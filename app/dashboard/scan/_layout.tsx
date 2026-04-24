import { Stack } from 'expo-router';
import { ScanProvider } from './ScanContexs';

export default function ScanLayout() {
  return (
    <ScanProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ScanProvider>
  );
}