import { useRouter } from 'expo-router';
import Step4 from './components/Step4';

export default function ScanStep4Page() {
  const router = useRouter();

  return (
    <Step4
      onBack={() => router.back()}             
    />
  );
}
