import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from './ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';
import { VARIANT } from '@constants/student';
import { THEME } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

import { Text, StyleSheet } from 'react-native';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  const shopScreen = (
    <Tab.Screen
      key="shop"
      name="ShopTab"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>🏪</Text>
        ),
      }}
    />
  );

  const cartScreen = (
    <Tab.Screen
      key="cart"
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Giỏ',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>🛒</Text>
        ),
        // tabBarBadge = tổng SL Zustand (ẩn khi 0) theo yêu cầu Câu 1b
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        tabBarBadgeStyle: {
          backgroundColor: THEME.secondary,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    />
  );

  const meScreen = (
    <Tab.Screen
      key="me"
      name="MeTab"
      component={MeScreen}
      options={{
        title: 'Tôi',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>👤</Text>
        ),
      }}
    />
  );

  // Sắp xếp thứ tự Tab theo biến thể sinh viên: shopFirst hay cartFirst
  const tabs =
    VARIANT.tabOrder === 'cartFirst'
      ? [cartScreen, shopScreen, meScreen]
      : [shopScreen, cartScreen, meScreen];

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.textLight,
        tabBarStyle: {
          backgroundColor: THEME.surface,
          borderTopColor: THEME.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      {tabs}
    </Tab.Navigator>
  );
};

export default MainTabs;
