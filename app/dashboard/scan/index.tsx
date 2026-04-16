import { useRouter } from 'expo-router';
import Step1 from './components/Step1';
import { ScanProvider } from './ScanContexs';

export default function ScanFlow() {
  const router = useRouter();
  return (
    <ScanProvider>
      <Step1 onNext={() => router.push('/dashboard/scan/step2')} />
    </ScanProvider>
  );
}