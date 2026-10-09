import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp } from '@constants/student';
import { THEME } from '@constants/theme';

export const Watermark: React.FC = () => {
  const stamp = examStamp();
  const text = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#DBEAFE', // nhẹ nhàng, hài hoà nền EFF6FF
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.border,
    zIndex: 10,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.text,
    letterSpacing: 0.5,
  },
});

export default Watermark;
