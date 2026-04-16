import { View, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import PhotoPreview from 'components/scan/PhotoPreview';
import TipsRecommendation from 'components/scan/TipsRecomendation';
import NextStepButton from 'components/scan/NextStepButton';
import { useScan } from '../ScanContexs';
import { validateImageByGender } from 'services/scanApi';

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  const { formData, updateFormData } = useScan();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoSelected = (imageUri: string) => {
    updateFormData({ image: imageUri });
  };

  const handleContinue = async () => {
    if (!formData.image) return;
    setIsProcessing(true);
    try {
      const isValid = await validateImageByGender(formData.image);
      if (!isValid) {
        Alert.alert(
          'Foto tidak sesuai',
          'Pastikan foto menampilkan orang dengan gender yang sesuai profil kamu.'
        );
        return;
      }
      onNext();
    } catch (error) {
      Alert.alert('Error', 'Gagal memvalidasi foto. Coba lagi.');
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
        promptText="Next: AI will validate your photo"
        buttonText={isProcessing ? 'Validating...' : 'Continue'}
        buttonIcon="sparkles"
        onPress={handleContinue}
        disabled={isProcessing || !formData.image}
      />
    </View>
  );
}