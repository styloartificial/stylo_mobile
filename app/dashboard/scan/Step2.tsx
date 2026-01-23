import { View, ScrollView } from 'react-native';
import { useState } from 'react';
import TextInputWithLabel from 'components/scan/TextInputwithLabel';
import CustomRadioInput, { CustomRadioButtonType } from 'components/scan/CustomRadioInput';
import NextStepButton from 'components/scan/NextStepButton';

interface Step2Props {
  image: string;
  lookTitle: string;
  selectedCategories: string[];
  updateFormData: (data: Partial<{
    lookTitle: string;
    selectedCategories: string[];
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2({
  lookTitle,
  selectedCategories,
  updateFormData,
  onNext,
}: Step2Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLookTitleChange = (text: string) => {
    updateFormData({ lookTitle: text });
  };

  const handleCategoriesChange = (categories: string[]) => {
    updateFormData({ selectedCategories: categories });
  };

  const handleContinue = () => {
    onNext(); // langsung ke Step 3
  };

  // const handleContinue = async () => {
  //   if (!lookTitle.trim()) {
  //     console.warn('Please add a look title');
  //     return;
  //   }

  //   if (selectedCategories.length === 0) {
  //     console.warn('Please select at least one category');
  //     return;
  //   }

  //   setIsProcessing(true);

  //   try {
  //     // Simulasi proses atau API call
  //     await new Promise(resolve => setTimeout(resolve, 500));

  //     // Lanjut ke step 3 (generation)
  //     onNext();
  //   } catch (error) {
  //     console.error('Error processing:', error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const categories: CustomRadioButtonType[] = [
    { id: 'outerwear', value: 'Outerwear', icon: 'shirt-outline' },
    { id: 'footwear', value: 'Footwear', icon: 'footsteps-outline' },
    { id: 'dress', value: 'Dress', icon: 'woman-outline' },
    { id: 'work', value: 'Work', icon: 'briefcase-outline' },
    { id: 'date', value: 'Date', icon: 'heart-outline' },
    { id: 'party', value: 'Party', icon: 'wine-outline' },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        <View className="px-6 pt-2">
          <TextInputWithLabel
            title="Title this look"
            description="Add a short name so you can find it easily later."
            label="Look title"
            placeholder='e.g. "Friday date night", "Office casual",...'
            value={lookTitle}
            onChangeText={handleLookTitleChange}
          />
        </View>

        <View className="px-6">
          <CustomRadioInput
            title="What should we focus on?"
            description="Pick one or more categories to guide the recommendations."
            label="Categories"
            items={categories}
            value={selectedCategories}
            onValueChange={handleCategoriesChange}
            multiSelect
          />
        </View>
      </ScrollView>

      <NextStepButton
        promptText="Next: AI generates outfits and finds matching products."
        buttonText="Generate outfit"
        buttonIcon="sparkles"
        onPress={handleContinue}
        disabled={false}
      />
    </View>
  );
}