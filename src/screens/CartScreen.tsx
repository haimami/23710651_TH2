import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { ROOM_LABEL, VARIANT } from '@constants/student';
import { THEME } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CartScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const items = useCartStore((state) => state.items);
  const changeQty = useCartStore((state) => state.changeQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalAmount = useCartStore((state) => state.totalAmount());
  const shippingFee = useCartStore((state) => state.shippingFee);

  const grandTotal = totalAmount + (shippingFee ?? 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 14 }]}>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptySubText}>Hãy chọn các món yêu thích từ tab Cửa hàng!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>
                ×{item.quantity} {(item.calculatedPrice * item.quantity).toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => changeQty(item.id, -1)}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNumber}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => changeQty(item.id, 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeItem(item.id)}
              >
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          items.length > 0 ? (
            <View style={styles.summaryBox}>
              <View style={styles.deliveryInfoCard}>
                <Text style={styles.roomText}>Giao đến {ROOM_LABEL}</Text>
                <Text style={styles.shipText}>
                  {shippingFee !== null
                    ? `Phí ship: ${shippingFee.toLocaleString('vi-VN')} đ (công thức ${VARIANT.shipFormula})`
                    : 'Chưa ước tính phí — mở tab Tôi'}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng hàng:</Text>
                <Text style={styles.totalPrice}>
                  {grandTotal.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            </View>
          ) : undefined
        }
      />

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
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  emptySubText: {
    fontSize: 13,
    color: THEME.textLight,
    marginTop: 6,
  },
  itemCard: {
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
  },
  itemPrice: {
    fontSize: 13,
    color: THEME.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    backgroundColor: '#EFF6FF',
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: THEME.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  qtyNumber: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
  },
  deleteBtn: {
    backgroundColor: THEME.error,
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  summaryBox: {
    marginTop: 16,
  },
  deliveryInfoCard: {
    backgroundColor: THEME.surface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.secondary,
    marginBottom: 12,
  },
  roomText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
  },
  shipText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.secondary,
    marginTop: 4,
  },
  totalRow: {
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.primary,
  },
});

export default CartScreen;
