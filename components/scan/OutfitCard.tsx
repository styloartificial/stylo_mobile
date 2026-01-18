import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AuthButton from 'components/AuthButton';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.6;
const SPACING = 12;

type OutfitCardProps = {
  title: string;
  subtitle: string;
  description: string;
  onSaveOutfit: () => void;
  onSaveItems: () => void;
};

export default function OutfitCard({
  title,
  subtitle,
  description,
  onSaveOutfit,
  onSaveItems,
}: OutfitCardProps) {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    require('../../assets/lucu1.jpg'),
    require('../../assets/lucu1.jpg'),
    require('../../assets/lucu1.jpg'),
  ];

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / (CARD_WIDTH + SPACING));
    setCurrentImageIndex(index);
  };

  return (
    <View className="bg-white rounded-lg mb-6">
      <View className="p-4 pb-2">
        <Text className="text-xl font-semibold text-gray-900">
          {title}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          {subtitle}
        </Text>
      </View>

      {/* Image Carousel */}
      <View className="mt-2 px-4 mb-6">
        <View className='bg-gray-100 py-2 px-2 rounded-lg '>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingHorizontal: 4,
              gap: SPACING,
            }}
          >
            {images.map((image, index) => (
              <View 
                key={index}
                style={{ width: CARD_WIDTH }}
                className="rounded-2xl overflow-hidden bg-gray-500"
              >
                <Image
                  source={image}
                  style={{ width: '100%', height: 300 }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          <View className="flex-row justify-center gap-2 mt-3 mb-2">
            {images.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 rounded-full ${
                  index === currentImageIndex
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </View>
        </View>
        
      </View>

      <View className="px-4">
        <Text className="text-base text-gray-600 leading-5">
          {description}
        </Text>
      </View>

      <View className="flex-row gap-3 px-4 mt-4">
        <View className="flex-1">
          <AuthButton
            title="Save outfit"
            color="secondary"
            icon="bookmark-outline"
            onPress={onSaveOutfit}
          />
        </View>

        <View className="flex-1">
          <AuthButton
            title="Single items"
            color="secondary"
            icon="add-circle-outline"
            onPress={onSaveItems}
          />
        </View>
      </View>

      <View className="px-4 mt-3 mb-4">
        <Text className="text-xs text-gray-400">
          Save this full look to Saved looks, or bookmark individual
          pieces to your single items.
        </Text>
      </View>
    </View>
  );
}
