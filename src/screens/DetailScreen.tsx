import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
  Vibration,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { productApi, Product } from '@services/productApi';
import { STUDENT, PRICE_MULTIPLIER, VARIANT, STALE_TIME_MS } from '@constants/student';
import { THEME } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';
import { ShopStackParamList } from '@navigation/ShopStack';

type DetailRouteProp = RouteProp<ShopStackParamList, 'Detail'>;

export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const { id } = route.params;
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductById(id),
    staleTime: STALE_TIME_MS,
  });

  const handleAddToCart = () => {
    if (!product) return;

    // Kích hoạt Haptic theo đúng biến thể: selection
    const duration = VARIANT.hapticOnAdd === 'impact' ? 40 : 15;
    try {
      Vibration.vibrate(duration);
    } catch (e) {
      console.log('Haptic vibration error:', e);
    }

    addItem(product, 1);

    // Alert có chứa MSSV theo đúng yêu cầu đề bài (Giao diện 3 & Câu 3a)
    Alert.alert(
      'Thành công',
      `Đã thêm món vào giỏ hàng!\nMSSV: ${STUDENT.mssv} - ${STUDENT.hoTen}`,
    );
  };

  const formattedPrice = product
    ? Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ'
    : '0 đ';

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME.primary} />
          <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
        </View>
      ) : isError || !product ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Không thể tải thông tin món #{id}</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.imageCard}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{formattedPrice}</Text>
            <Text style={styles.tagline}>Giao nội khu · nhận tận phòng</Text>

            <View style={styles.divider} />

            <Text style={styles.descriptionLabel}>Mô tả ngắn từ API (tối đa 3 dòng):</Text>
            <Text style={styles.description} numberOfLines={3}>
              {product.description}
            </Text>
            <Text style={styles.idLabel}>Giữ nguyên id từ route.params: {id}</Text>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            activeOpacity={0.85}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Thêm vào giỏ · Haptic</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: THEME.textLight,
  },
  errorText: {
    fontSize: 15,
    color: THEME.error,
  },
  imageCard: {
    width: '100%',
    height: 250,
    backgroundColor: THEME.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 16,
  },
  image: {
    width: '90%',
    height: '90%',
  },
  detailsCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text,
    lineHeight: 24,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.primary,
    marginTop: 8,
  },
  tagline: {
    fontSize: 13,
    color: THEME.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 12,
  },
  descriptionLabel: {
    fontSize: 12,
    color: THEME.textLight,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: THEME.text,
    lineHeight: 20,
  },
  idLabel: {
    marginTop: 10,
    fontSize: 12,
    color: THEME.textLight,
  },
  addToCartButton: {
    backgroundColor: THEME.primary,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DetailScreen;
