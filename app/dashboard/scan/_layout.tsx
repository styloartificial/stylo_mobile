import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScanContext, ScanFormData } from './ScanContexs';

export default function ScanLayout() {
  const [formData, setFormData] = useState<ScanFormData>({
    image: '',
    lookTitle: '',
    selectedCategories: [],
    occasion: '',
    style: '',
    detectedItems: [],
    selectedProducts: [],
  });

  const updateFormData = (data: Partial<ScanFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <ScanContext.Provider value={{ formData, updateFormData }}>
      <Stack screenOptions={{ headerShown: false }} />
    </ScanContext.Provider>
  );
}
