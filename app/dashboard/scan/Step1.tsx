import { View, ScrollView } from 'react-native';
import { useState } from 'react';
import PhotoPreview from 'components/scan/PhotoPreview';
import TipsRecommendation from 'components/scan/TipsRecomendation';
import NextStepButton from 'components/scan/NextStepButton';


interface Step1Props {
  image: string;
  updateFormData: (data: Partial<{
    image: string;
  }>) => void;
  onNext: () => void;
}

export default function Step1({
  image,
  updateFormData,
  onNext,
}: Step1Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = (imageData: string) => {
    updateFormData({ image: imageData });
  };


  const handleContinue = async () => {
    // if (!image) {
    //   // Bisa tambahkan toast/alert di sini
    //   console.warn('Please select an image first');
    //   return;
    // }

    setIsProcessing(true);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 500));

    
      onNext();
    } catch (error) {
      console.error('Error processing image:', error);
      
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
      
        <View className="px-6 mt-2">
          <PhotoPreview
            onCameraPress={() => {
              console.log('Camera pressed');
            }}
            onGalleryPress={() => {
              console.log('Gallery pressed');
             
            }}
            onHelpPress={() => {
              console.log('Help pressed');
             
            }}
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
        disabled={isProcessing}
        />
    </View>
  );
}