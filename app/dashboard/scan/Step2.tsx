import { useRouter } from 'expo-router';
import Step2 from './components/Step2';
import { useScan } from './ScanContexs';

export default function ScanStep2() {
  const router = useRouter();
  const { formData, updateFormData } = useScan();

  return (
    <Step2
      image={formData.image}
      lookTitle={formData.lookTitle}
      selectedCategories={formData.selectedCategories}
      updateFormData={updateFormData}
      onNext={() => router.push('/dashboard/scan/step3')}
      onBack={() => router.back()}
    />
  );
}
