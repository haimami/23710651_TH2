import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { STUDENT, VARIANT } from '@constants/student';
import { THEME } from '@constants/theme';
import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';

export const LoginScreen: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const [inputValue, setInputValue] = useState(
    VARIANT.authField === 'email' ? `${STUDENT.mssv}@iuh.edu.vn` : `09${STUDENT.mssv}`,
  );

  const handleLogin = () => {
    if (!inputValue.trim()) {
      Alert.alert('Thông báo', `Vui lòng nhập ${VARIANT.authField === 'email' ? 'email' : 'số điện thoại'}`);
      return;
    }
    login(inputValue.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.logoTitle}>KTXGO</Text>
          <Text style={styles.subTitle}>Giao đồ tận phòng ký túc xá</Text>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>
              {VARIANT.authField === 'email' ? 'Email sinh viên' : 'Số điện thoại'}
            </Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={
                VARIANT.authField === 'email'
                  ? `${STUDENT.mssv}@iuh.edu.vn`
                  : `Số ĐT (MSSV: ${STUDENT.mssv})`
              }
              placeholderTextColor={THEME.textLight}
              keyboardType={VARIANT.authField === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>Auth Stack · chưa có token</Text>
        </View>
      </KeyboardAvoidingView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.primary,
    letterSpacing: 1.5,
  },
  subTitle: {
    fontSize: 14,
    color: THEME.textLight,
    marginTop: 6,
    marginBottom: 32,
  },
  inputCard: {
    width: '100%',
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: THEME.text,
    backgroundColor: '#FAFCFF',
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: THEME.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    marginTop: 24,
    fontSize: 12,
    color: THEME.textLight,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
