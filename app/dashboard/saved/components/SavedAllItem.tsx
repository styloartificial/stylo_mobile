import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ButtonGlobal from 'components/global/ButtonGlobal';
import { SavedItem } from 'types/GenerationSteps';
import SavedSingleItem from './SavedSingleItem';

const DUMMY_SAVED_ITEMS: SavedItem[] = [
  {
    id: '1',
    type: 'outfit',
    title: 'Minimal office layers',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f36?w=200',
    date: 'Yesterday',
    category: 'Work',
    tags: [
      { id: 't1', label: 'Business casual' },
      { id: 't2', label: 'Footwear focus' },
    ],
  },
  {
    id: '2',
    type: 'outfit',
    title: 'Weekend coffee run',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200',
    date: 'Mon, 10 Feb',
    category: 'Casual',
    tags: [
      { id: 't3', label: 'Cozy' },
      { id: 't4', label: 'Layered' },
    ],
  },
  {
    id: '3',
    type: 'outfit',
    title: 'Street style vibes',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200',
    date: 'Sun, 9 Feb',
    category: 'Street',
    tags: [
      { id: 't5', label: 'Bold' },
      { id: 't6', label: 'Edgy' },
    ],
  },
  {
    id: '4',
    type: 'single',
    title: 'Classic white sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
    date: 'Sat, 8 Feb',
    category: 'Footwear',
    tags: [
      { id: 't7', label: 'Minimalist' },
      { id: 't8', label: 'Everyday' },
    ],
  },
  {
    id: '5',
    type: 'single',
    title: 'Oversized beige blazer',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
    date: 'Fri, 7 Feb',
    category: 'Tops',
    tags: [
      { id: 't9', label: 'Office ready' },
      { id: 't10', label: 'Neutral' },
    ],
  },
];

type TabType = 'outfits' | 'single';

const SavedAllItem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('outfits');
  const [loading] = useState(false);

  const filteredItems = DUMMY_SAVED_ITEMS.filter((item) =>
    activeTab === 'outfits' ? item.type === 'outfit' : item.type === 'single'
  );

  const handleShare = (item: SavedItem) => {
    console.log('Share item:', item.id);
  };

  return (
    <View className="flex-1 bg-[#F8F8F8] px-6 pt-4">

      {/* Counter */}
      {filteredItems.length > 0 && (
        <Text className="text-sm text-gray-500 mb-3">
          {filteredItems.length} saved {activeTab === 'outfits' ? 'outfits' : 'items'}
        </Text>
      )}
      {/* Tab Toggle */}
      <View className="flex-row bg-[#F1F5F7] rounded-full p-1 self-start mb-4">
        {(['outfits', 'single'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab ? 'bg-[#8F42DE]' : ''
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === tab ? 'text-white' : 'text-gray-500'
              }`}
            >
              {tab === 'outfits' ? 'Outfits' : 'Single items'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List / Loading */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8F42DE" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SavedSingleItem item={item} onShare={handleShare} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListFooterComponent={
            <View className="bg-[#F1F5F7] rounded-2xl mt-4 py-10 px-6 items-center">
              <View className="bg-white rounded-full p-4">
                <Ionicons name="heart-outline" size={40} color="#8F42DE" />
              </View>
              <Text className="text-base font-bold text-gray-800 mt-4 mb-2 text-center">
                Save your favorite looks
              </Text>
              <Text className="text-sm text-gray-400 text-center mb-6">
                Tap the heart icon on any AI recommendation to quickly find it here before you buy.
              </Text>
              <ButtonGlobal
                title="Start a new scan"
                color="primary"
                icon="scan-outline"
                onPress={() => router.push('/dashboard/scan')}
                size="md"
                shape="pill"
              />
            </View>
          }
        />
      )}

    </View>
  );
};

export default SavedAllItem;