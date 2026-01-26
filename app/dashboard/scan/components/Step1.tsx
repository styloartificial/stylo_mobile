import { View, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import PhotoPreview from 'components/scan/PhotoPreview';
import TipsRecommendation from 'components/scan/TipsRecomendation';
import NextStepButton from 'components/scan/NextStepButton';

interface Step1Props {
  image: string;
  updateFormData: (data: Partial<{ image: string }>) => void;
  onNext: () => void;
}

export default function Step1({ image, updateFormData, onNext }: Step1Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoSelected = (imageUri: string) => {
    updateFormData({ image: imageUri });
    console.log('Photo selected:', imageUri);
  };

  const handleContinue = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onNext();
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 mt-2">
          <PhotoPreview
            title="Take a full-body photo"
            subtitle="Make sure your entire outfit is visible."
            guideText="Stand straight and keep your full outfit in frame."
            onPhotoSelected={handlePhotoSelected}
          />
        </View>

        <View className="p-6">
          <TipsRecommendation />
        </View>
      </ScrollView>

      <NextStepButton
        promptText="Next: AI will generate your outfit recommendations"
        buttonText="Continue"
        buttonIcon="sparkles"
        onPress={handleContinue}
        disabled={isProcessing || !image}
      />
    </View>
  );
}