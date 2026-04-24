import { useRouter } from 'expo-router';
import Step1 from './components/Step1';

export default function ScanFlow() {
  const router = useRouter();
  return (
    <Step1 onNext={() => router.push('/dashboard/scan/step2')} />
  );
}