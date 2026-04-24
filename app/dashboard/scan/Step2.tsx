import { useRouter } from 'expo-router';
import Step2 from './components/Step2';

export default function ScanStep2() {
  const router = useRouter();

  return (
    <Step2
      onNext={() => router.push('/dashboard/scan/step3')}
      onBack={() => router.back()}
    />
  );
}