import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { THEME } from '@constants/theme';
import { useAuthStore } from '@stores/authStore';
import { useCartStore } from '@stores/cartStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { Watermark } from '@components/Watermark';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const MeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const setShippingInfo = useCartStore((state) => state.setShippingInfo);

  const {
    status,
    coords,
    distanceKm,
    shippingFee,
    errorMsg,
    requestLocation,
    openSettings,
  } = useCampusLocation();

  // Khi có khoảng cách và phí ship, đồng bộ sang CartStore để màn CartScreen cùng thấy
  useEffect(() => {
    if (shippingFee !== null) {
      setShippingInfo(shippingFee, distanceKm);
    }
  }, [shippingFee, distanceKm, setShippingInfo]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 14 }]}>
        <Text style={styles.headerTitle}>TÔI · LOCATION</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Card định danh sinh viên */}
        <View style={styles.profileCard}>
          <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
          <Text style={styles.studentInfo}>
            {STUDENT.mssv} · #{examStamp()}
          </Text>
          <Text style={styles.tokenInfo}>
            Token: {token ? `${token.slice(0, 16)}...` : 'Chưa có'}
          </Text>
        </View>

        {/* Khối quản lý vị trí GPS */}
        <View style={styles.locationCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Quyền: </Text>
            <Text
              style={[
                styles.statusValue,
                status === 'granted' && styles.statusGranted,
                status === 'denied' && styles.statusDenied,
                status === 'blocked' && styles.statusBlocked,
              ]}
            >
              {status}
            </Text>
          </View>

          {distanceKm !== null && (
            <Text style={styles.distanceText}>
              ≈ {distanceKm} km tới cổng KTX
            </Text>
          )}

          {shippingFee !== null && (
            <View style={styles.feeBox}>
              <Text style={styles.feeLabel}>Phí ship ước tính</Text>
              <Text style={styles.feeValue}>
                {shippingFee.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          )}

          {errorMsg && <Text style={styles.errorMsgText}>{errorMsg}</Text>}
        </View>

        {/* Nút Lấy vị trí */}
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={requestLocation}
        >
          {status === 'loading' ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>Lấy vị trí ước tính ship</Text>
          )}
        </TouchableOpacity>

        {/* Nút Mở cài đặt (khi blocked hoặc bất cứ lúc nào) */}
        <TouchableOpacity
          style={styles.settingsButton}
          activeOpacity={0.8}
          onPress={openSettings}
        >
          <Text style={styles.settingsButtonText}>Mở Cài đặt (blocked)</Text>
        </TouchableOpacity>

        {/* Nút Đăng xuất */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

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
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.text,
  },
  studentInfo: {
    fontSize: 14,
    color: THEME.textLight,
    marginTop: 6,
    fontWeight: '600',
  },
  tokenInfo: {
    fontSize: 12,
    color: THEME.primary,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.text,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textLight,
  },
  statusGranted: {
    color: THEME.success,
  },
  statusDenied: {
    color: THEME.error,
  },
  statusBlocked: {
    color: '#D97706',
  },
  distanceText: {
    fontSize: 14,
    color: THEME.text,
    fontWeight: '600',
    marginVertical: 4,
  },
  feeBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  feeLabel: {
    fontSize: 13,
    color: THEME.textLight,
  },
  feeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.secondary,
    marginTop: 2,
  },
  errorMsgText: {
    marginTop: 8,
    fontSize: 12,
    color: THEME.error,
  },
  actionButton: {
    backgroundColor: THEME.primary,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  settingsButton: {
    backgroundColor: THEME.surface,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  settingsButtonText: {
    color: THEME.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: THEME.error,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MeScreen;
