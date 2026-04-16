import { View, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import TextInputWithLabel from 'components/scan/TextInputwithLabel';
import CustomRadioInput, { CustomRadioButtonType } from 'components/scan/CustomRadioInput';
import NextStepButton from 'components/scan/NextStepButton';
import CustomHeader from 'components/global/CustomHeader';
import { useScan } from '../ScanContexs';
import { getScanCategories, openTicket } from 'services/scanApi';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2({ onNext, onBack }: Step2Props) {
  const { formData, updateFormData } = useScan();
  const [isProcessing, setIsProcessing] = useState(false);
  const [categories, setCategories] = useState<CustomRadioButtonType[]>([]);

  useEffect(() => {
    getScanCategories()
      .then(data => {
        setCategories(
          data.map(cat => ({
            id: String(cat.id),
            value: cat.title,
            icon: (cat.icon ?? 'shirt-outline') as any,
          }))
        );
      })
      .catch(() => Alert.alert('Error', 'Gagal memuat kategori.'));
  }, []);

  const handleContinue = async () => {
    if (!formData.lookTitle.trim()) {
      Alert.alert('Wajib diisi', 'Masukkan judul untuk look kamu.');
      return;
    }
    if (formData.selectedCategories.length === 0) {
      Alert.alert('Wajib diisi', 'Pilih minimal satu kategori.');
      return;
    }
    setIsProcessing(true);
    try {
      const { ticket_id } = await openTicket({
        imageUri: formData.image,
        title: formData.lookTitle,
        scanCategoryId: formData.selectedCategories[0],
      });
      updateFormData({ ticketId: ticket_id });
      onNext();
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat tiket. Coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <CustomHeader
        title="Tell us the vibe"
        subtitle="Describe where you're going and what you like."
        showBackButton
        onBackPress={onBack}
      />
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
            value={formData.lookTitle}
            onChangeText={text => updateFormData({ lookTitle: text })}
          />
        </View>
        <View className="px-6">
          <CustomRadioInput
            title="What should we focus on?"
            description="Pick one or more categories."
            label="Categories"
            items={categories}
            value={formData.selectedCategories.map(String)}
            onValueChange={vals =>
              updateFormData({ selectedCategories: vals.map(Number) })
            }
            multiSelect
          />
        </View>
      </ScrollView>

      <NextStepButton
        promptText="Next: AI generates outfits and finds matching products."
        buttonText={isProcessing ? 'Processing...' : 'Generate outfit'}
        buttonIcon="sparkles"
        onPress={handleContinue}
        disabled={isProcessing}
      />
    </View>
  );
}