import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { Product } from '@services/productApi';
import { PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { THEME } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const addItem = useCartStore((state) => state.addItem);

  const formattedPrice =
    Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';

  const handleAddToCart = () => {
    // Kích hoạt Haptic theo đúng biến thể: selection (15ms) hoặc impact (40ms)
    const duration = VARIANT.hapticOnAdd === 'impact' ? 40 : 15;
    try {
      Vibration.vibrate(duration);
    } catch (e) {
      console.log('Haptic vibrate error:', e);
    }

    addItem(product, 1);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress(product.id)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formattedPrice}</Text>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.7}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderRadius: 12,
    margin: 6,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: THEME.border,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  infoContainer: {
    marginTop: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text,
    lineHeight: 18,
    minHeight: 36,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primary,
    flex: 1,
  },
  addButton: {
    backgroundColor: THEME.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
});

export default ProductCard;
