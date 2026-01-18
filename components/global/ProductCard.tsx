import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonGlobal from './ButtonGlobal';

interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: number;
  rating?: number;
  buyerCount?: number;
  onPressProduct: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  price,
  rating,
  buyerCount,
  onPressProduct,
}) => {

  const formatPrice = (price: number): string => {
    return `IDR ${price.toLocaleString('id-ID')}`;
  };

  const formatBuyerCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <View className="bg-white rounded-lg mb-4">
      <View className="flex-row p-3 gap-3">

        <Image
          source={{ uri: imageUrl }}
          className="w-20 h-20 rounded-lg bg-gray-100"
          resizeMode="cover"
        />

        <View className="flex-1 justify-between">
          <Text 
            className="text-sm font-medium text-gray-900 mb-1"
            numberOfLines={2}
          >
            {title}
          </Text>

          <View className="flex-row items-center gap-3 mb-2">
            {/* Rating */}
            {rating !== undefined && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text className="text-xs font-semibold text-gray-700">
                  {rating.toFixed(1)}
                </Text>
              </View>
            )}

            {rating !== undefined && buyerCount !== undefined && (
              <Text className="text-xs text-gray-400">•</Text>
            )}

            {buyerCount !== undefined && buyerCount > 0 && (
              <Text className="text-xs text-gray-500">
                {formatBuyerCount(buyerCount)} buyers
              </Text>
            )}
          </View>

          <Text className="text-base font-bold text-gray-900">
            {formatPrice(price)}
          </Text>
        </View>

        <View className="justify-center">
            <ButtonGlobal
                title="View product"
                color="secondary"
                onPress={onPressProduct}
                size="xs"
            />
        </View>

      </View>
    </View>
  );
};

export default ProductCard;