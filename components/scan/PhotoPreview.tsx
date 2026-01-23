import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonGlobal from 'components/global/ButtonGlobal';

interface PhotoPreviewProps {
  title?: string;
  subtitle?: string;
  guideText?: string;
  previewImage?: string | null;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onHelpPress?: () => void;
}

export default function PhotoPreview({
  title = 'Photo preview',
  subtitle = 'Stand straight, keep your full outfit in frame.',
  guideText = 'Align yourself with the guide. Make sure your shoes are visible.',
  previewImage = null,
  onCameraPress,
  onGalleryPress,
  onHelpPress,
}: PhotoPreviewProps) {
  return (
    <View className="flex-1 bg-white p-6 rounded-lg">
      <View className="flex-row items-start justify-between mb-6">
        <View className="flex-1">
          <Text className="text-xl font-semibold text-gray-900">{title}</Text>
          <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
        </View>  
      </View>

      {/* Preview Container */}
      <View className="flex-1 bg-gray-100 items-center rounded-lg">
        <View className="w-full px-4 py-2">
          <View
            className="bg-gray-200 rounded-xl items-center justify-center overflow-hidden"
            style={{ aspectRatio: 0.75 }}
          >
            {previewImage ? (
              <Image
                source={{ uri: previewImage }}
                className="w-full h-full"
                resizeMode="contain"
              />
            ) : (
              <View className="items-center justify-center">
                <Ionicons name="person-outline" size={80} color="#D1D5DB" />
                <Text className="text-gray-400 mt-3 text-center">
                  No photo selected
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text className="text-center text-sm text-gray-600 mb-2 px-4">
          {guideText}
        </Text>
      </View>

      <View className="flex-row gap-6 justify-center mt-4">
       <ButtonGlobal
          title="Camera"
          color="primary"
          icon="camera"
          size="md"
          shape="rounded"
          onPress={onCameraPress}
        />

        <ButtonGlobal
          title="Gallery"
          color="secondary"
          icon="image-outline"
          size="md"
          shape="rounded"
          onPress={onGalleryPress}
        />

      </View>
    </View>
  );
}