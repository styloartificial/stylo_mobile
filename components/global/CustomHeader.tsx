import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RightActionType = 'profile' | 'notification' | 'icon' | 'both';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: RightActionType;
  profileImage?: ImageSourcePropType;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  onIconPress?: () => void;
}

export default function CustomHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  profileImage,
  iconName = 'notifications-outline',
  iconSize = 24,
  iconColor = '#374151',
  onProfilePress,
  onNotificationPress,
  onIconPress,
}: CustomHeaderProps) {
  const handleBackPress = () => {
    onBackPress?.();
  };

  const renderProfileImage = () => {
    if (profileImage) {
      return (
        <Image
          source={profileImage}
          className="w-10 h-10 rounded-full"
        />
      );
    }

  };

  const renderRightAction = () => {
    switch (rightAction) {
      case 'profile':
        return (
          <TouchableOpacity onPress={onProfilePress}>
            {renderProfileImage()}
          </TouchableOpacity>
        );      
    }
  };

  return (
    <View className="px-6 py-4 flex-row items-center border-b border-gray-200 bg-white">
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          className="mr-3 p-2 rounded-full bg-gray-100"
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color="#374151"
          />
        </TouchableOpacity>
      )}

      <View className="flex-1">
        <Text className="text-xl font-bold text-gray-800">
          {title}
        </Text>

        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>

      {renderRightAction()}
    </View>
  );
}
