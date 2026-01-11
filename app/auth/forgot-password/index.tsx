import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AuthTitle from 'components/AuthTitle';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';


type ForgotPasswordStep = 1 | 2 | 3;

type StepTitle = {
  title: string;
  description: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] =
    useState<ForgotPasswordStep>(1);

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });

  const updateFormData = (
    data: Partial<typeof formData>
  ) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const stepTitleMap: Record<ForgotPasswordStep, StepTitle> = {
    1: {
      title: 'Forgot your password?',
      description:
        "No worries, it happens. Enter your email associated with your account.",
    },
    2: {
      title: 'Check your Inbox',
      description:
        'We sent a reset token. Enter it below to processed.',
    },
    3: {
      title: 'Create new password',
      description:
        'Your identity has been verified. Set a new password to secure your account.',
    },
  };

  return (
    <>
      <AuthTitle
        title={stepTitleMap[currentStep].title}
        description={stepTitleMap[currentStep].description}
      />

      {currentStep === 1 && (
        <Step1
          email={formData.email}
          updateFormData={updateFormData}
          onNext={() => setCurrentStep(2)}
        />
      )}

      
      {currentStep === 2 && (
        <Step2
          email={formData.email}
          otp={formData.otp}
          updateFormData={updateFormData}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3
          email={formData.email}
          otp={formData.otp}
          updateFormData={updateFormData}
          newPassword={formData.newPassword}
          onBack={() => setCurrentStep(2)}
          onSuccess={() => router.replace('/auth/login')}
        />
      )}
      

    </>
  );
}
