// src/app/scan/index.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Step1 from './Step1';
import Step2 from './Step2';

// import Step4 from './step4';

type ScanStep = 1 | 2 | 3 | 4;

type StepConfig = {
  title: string;
  description: string;
};

export default function ScanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ScanStep>(1);

  const [formData, setFormData] = useState({
    image: '',
    lookTitle: '',
    selectedCategories: [] as string[],
    occasion: '',
    style: '',
    detectedItems: [],
    selectedProducts: [],
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const stepConfigMap: Record<ScanStep, StepConfig> = {
    1: {
      title: 'Scan your outfit',
      description: 'Use a clear full-body photo for best results.',
    },
    2: {
      title: 'Describe your style',
      description: 'Tell us about the occasion and your style preferences.',
    },
    3: {
      title: 'Generating recommendations',
      description: 'AI is analyzing your style and finding similar items.',
    },
    4: {
      title: 'Your recommendations',
      description: 'Browse items that match your style from trusted sellers.',
    },
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as ScanStep);
    } else {
      router.back();
    }
  };

  return (
    <>
    
      <View className="flex-1">
        {currentStep === 1 && (
          <Step1
            image={formData.image}
            updateFormData={updateFormData}
            onNext={() => setCurrentStep(2)}
          />
        )}

         {currentStep === 2 && (
          <Step2
            image={formData.image}
            lookTitle={formData.lookTitle}
            selectedCategories={formData.selectedCategories}
            updateFormData={updateFormData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
{/* 
        <Step3
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        /> */}

   

      </View>

    </>
  );
}