import { View, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import TextInputWithLabel from 'components/scan/TextInputwithLabel';
import CustomRadioInput, { CustomRadioButtonType } from 'components/scan/CustomRadioInput';
import NextStepButton from 'components/scan/NextStepButton';
import CustomHeader from 'components/global/CustomHeader';
import { useScan } from '../ScanContexs';
import { getScanCategories, ScanCategoriesGrouped, openTicket } from 'services/scanApi';
import { SelectedCategories } from '../ScanContexs';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

const EMPTY_CATEGORIES = { item: [], occasion: [], style: [], hijab: [] };

const toRadioItems = (cats: ScanCategoriesGrouped[keyof ScanCategoriesGrouped]): CustomRadioButtonType[] =>
  (cats ?? []).map(cat => ({
    id: String(cat.id),
    value: cat.title,
    icon: (cat.icon ?? 'shirt-outline') as any,
  }));

export default function Step2({ onNext, onBack }: Step2Props) {
  const { formData, updateFormData } = useScan();
  const [isProcessing, setIsProcessing] = useState(false);
  const [groupedCategories, setGroupedCategories] = useState<ScanCategoriesGrouped>({
    item: [], occasion: [], style: [], hijab: [],
  });

  const selected: SelectedCategories = formData.selectedCategories ?? EMPTY_CATEGORIES;

  useEffect(() => {
    getScanCategories()
      .then(setGroupedCategories)
      .catch(() => Alert.alert('Error', 'Gagal memuat kategori.'));
  }, []);

  const updateCategory = (type: keyof SelectedCategories, vals: string[]) => {
    updateFormData({
      selectedCategories: {
        ...(formData.selectedCategories ?? EMPTY_CATEGORIES),
        [type]: vals.map(Number),
      },
    });
  };

  const handleContinue = async () => {
    if (!formData.lookTitle.trim()) {
      Alert.alert('Wajib diisi', 'Masukkan judul untuk look kamu.');
      return;
    }

    const { item, occasion, style, hijab } = selected;
    const totalSelected = item.length + occasion.length + style.length + hijab.length;
    if (totalSelected === 0) {
      Alert.alert('Wajib diisi', 'Pilih minimal satu kategori.');
      return;
    }

    setIsProcessing(true);
    try {
      const { ticket_id } = await openTicket({
        imageUri: formData.image,
        title: formData.lookTitle,
        scanCategoryId: selected,
      });
      updateFormData({ ticketId: ticket_id });
      onNext();
    } catch {
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

        <View className="px-6 mt-4">
          <CustomRadioInput
            title="Item"
            description="Pilih item pakaian yang ingin difokuskan."
            label="Item"
            items={toRadioItems(groupedCategories.item)}
            value={selected.item?.map(String) ?? []}
            onValueChange={vals => updateCategory('item', vals)}
            multiSelect
          />
        </View>

        <View className="px-6 mt-4">
          <CustomRadioInput
            title="Occasion"
            description="Mau dipakai ke acara apa?"
            label="Occasion"
            items={toRadioItems(groupedCategories.occasion)}
            value={selected.occasion?.map(String) ?? []}
            onValueChange={vals => updateCategory('occasion', vals)}
            multiSelect
          />
        </View>

        <View className="px-6 mt-4">
          <CustomRadioInput
            title="Style"
            description="Gaya yang kamu suka?"
            label="Style"
            items={toRadioItems(groupedCategories.style)}
            value={selected.style?.map(String) ?? []}
            onValueChange={vals => updateCategory('style', vals)}
            multiSelect
          />
        </View>

        <View className="px-6 mt-4">
          <CustomRadioInput
            title="Hijab"
            description="Apakah kamu memakai hijab?"
            label="Hijab"
            items={toRadioItems(groupedCategories.hijab)}
            value={selected.hijab?.map(String) ?? []}
            onValueChange={vals => updateCategory('hijab', vals)}
            multiSelect
          />
        </View>

        <View className="px-6 pt-4">
          <TextInputWithLabel
            title="Detail Outfit"
            description="Masukkan detail outfit yang anda inginkan."
            label="Detail Outfit"
            placeholder='e.g. "Hijab yang bagus untuk baju gamis warna merah"'
            value={formData.lookTitle}
            onChangeText={text => updateFormData({ lookTitle: text })}
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