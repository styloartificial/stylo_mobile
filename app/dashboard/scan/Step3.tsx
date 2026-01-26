import { useRouter } from 'expo-router';
import Step3 from './components/Step3';

export default function ScanStep3Page() {
  const router = useRouter();

  return (
    <Step3
      onBack={() => router.back()}   
      onNext={() => router.push('/dashboard/scan/step4')}
    />
  );
}
