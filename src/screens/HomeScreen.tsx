import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { productApi, Product, useProductsQuery } from '@services/productApi';
import { STUDENT, ROOM_LABEL, DEBOUNCE_MS, STALE_TIME_MS, VARIANT } from '@constants/student';
import { THEME } from '@constants/theme';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { ProductCard } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';
import { ShopStackParamList } from '@navigation/ShopStack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

const FlashListComponent: any = FlashList;

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, DEBOUNCE_MS);

  const {
    data: products,
    isLoading,
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useProductsQuery();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    return products.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [products, debouncedSearch]);

  const handlePressCard = (id: number) => {
    navigation.navigate('Detail', { id: String(id) });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header (A) */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 4 : 12 }]}>
        <Text style={styles.brandTitle}>KTXGO</Text>
        <Text style={styles.roomSubtitle}>Giao tận {ROOM_LABEL}</Text>
      </View>

      {/* Ô tìm kiếm controlled (B) */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
          placeholderTextColor={THEME.textLight}
        />
      </View>

      {/* 3 Cảnh mạng (Đang tải / Lỗi mạng / Có dữ liệu) */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME.primary} />
          <Text style={styles.loadingText}>Đang tải món...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
          <Text style={styles.errorText}>Không tải được dữ liệu món.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => { refetch(); }}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlashListComponent
            data={filteredProducts}
            numColumns={2}
            estimatedItemSize={200}
            keyExtractor={(item: Product) => `${STUDENT.mssv}-${item.id}`}
            renderItem={({ item }: { item: Product }) => (
              <ProductCard product={item} onPress={handlePressCard} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  refetch();
                }}
                colors={[THEME.primary]}
              />
            }
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy món phù hợp</Text>
              </View>
            }
          />
        </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.primary,
  },
  roomSubtitle: {
    fontSize: 13,
    color: THEME.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    height: 42,
    backgroundColor: THEME.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    color: THEME.text,
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 16,
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
  errorMssv: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.error,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 15,
    color: THEME.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: THEME.error,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: THEME.textLight,
    fontSize: 14,
  },
});

export default HomeScreen;
