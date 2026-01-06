import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AuthTitle from 'components/AuthTitle';
import AuthFooter from 'components/AuthFooter';
import CustomStepIndicator from 'components/CustonStepIndicator';
import Step1 from 'app/auth/register/step1';
import Step2 from 'app/auth/register/step2';


type RegisterStep = 1 | 2;

type StepTitle = {
  title: string;
  description: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<RegisterStep>(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const stepTitleMap: Record<RegisterStep, StepTitle> = {
    1: {
      title: 'Create your Stylo account',
      description: 'Save looks you love and get AI-powered outfit ideas in seconds.',
    },
    2: {
      title: 'Tell us about you',
      description: 'We will use your details to fine-tune sizing, colours, and fit recommendations.',
    },
  };

  return (
    <>
      <AuthTitle
        title={stepTitleMap[currentStep].title}
        description={stepTitleMap[currentStep].description}
      />

      <CustomStepIndicator currentStep={currentStep} totalSteps={2} />

      {currentStep === 1 && (
        <Step1
          formData={formData}
          updateFormData={updateFormData}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <Step2
          formData={formData}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 1 && (
        <AuthFooter
          type="login"
          onActionPress={() => router.push('/auth/login')}
        />
      )}
    </>
  );
}
