import { View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Step1 from './components/Step1';

export default function ScanFlow() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    image: '',
    lookTitle: '',
    selectedCategories: [],
    occasion: '',
    style: '',
    detectedItems: [],
    selectedProducts: [],
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <Step1
      image={formData.image}
      updateFormData={updateFormData}
      onNext={() => router.push('/dashboard/scan/step2')}
    />
  );
}
