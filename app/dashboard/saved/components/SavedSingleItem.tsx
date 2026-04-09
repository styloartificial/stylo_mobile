import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ButtonGlobal from 'components/global/ButtonGlobal';
import { SavedItem } from 'types/GenerationSteps';

interface SavedSingleItemProps {
  item: SavedItem;
  onShare?: (item: SavedItem) => void;
}

const SavedSingleItem: React.FC<SavedSingleItemProps> = ({ item, onShare }) => {
  const handleViewDetails = () => {
    router.push(`/dashboard/saved/${item.id}`);
  };

  return (
    <View className="bg-white rounded-2xl mb-3 p-3 shadow-sm">
      <View className="flex-row gap-3">

        <Image
          source={{ uri: item.imageUrl }}
          className="w-28 h-36 rounded-xl bg-gray-100"
          resizeMode="cover"
        />

        {/* Konten */}
        <View className="flex-1">
          
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {item.title}
          </Text>

          {/* Tanggal & Kategori */}
          <View className="flex-row items-center gap-1 mb-2">
            <Ionicons name="time-outline" size={12} color="#9ca3af" />
            <Text className="text-xs text-gray-400">
              {item.date} • {item.category}
            </Text>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-1 mb-3">
            {item.tags.map((tag) => (
              <View
                key={tag.id}
                className="bg-[#F3E8FF] px-2 py-1 rounded-full flex-row items-center gap-1"
              >
                <Ionicons name="pricetag-outline" size={10} color="#8F42DE" />
                <Text className="text-xs text-[#8F42DE] font-medium">
                  {tag.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Bottom Action Row */}
          <View className="flex-row items-center justify-between mt-auto">
            
            {/* View Details */}
            <View className="flex-1 mr-2">
              <ButtonGlobal
                title="View details"
                color="primary"
                icon="eye-outline"
                onPress={handleViewDetails}
                size="sm"
                shape="pill"
              />
            </View>

            {/* Share */}
            <TouchableOpacity
              onPress={() => onShare?.(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="share-social-outline" size={18} color="#9ca3af" />
            </TouchableOpacity>

          </View>

        </View>

      </View>
    </View>
  );
};

export default SavedSingleItem;