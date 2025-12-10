import { useTheme } from '@/components/ThemeContext';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <NativeTabs
      // Native Tabs do not support swiping between screens. This is a platform limitation of standard native tabs.
      iconColor={{
        // CHANGE ANDROID ICON COLORS HERE
        default: process.env.EXPO_OS === 'android'
          ? (isDark ? '#CCCCCC' : '#000000') // Android: Light Gray (Dark Mode) vs Pure Black (Light Mode)
          : colors.icon, // iOS
        selected: process.env.EXPO_OS === 'android'
          ? '#FFFFFF' // Android: Pure White Selected (Both Modes)
          : colors.tint, // iOS
      }}
      labelStyle={{
        default: {
          color: process.env.EXPO_OS === 'android'
            ? (isDark ? '#E5E5E5' : '#1A1A1A') // Android: Dark Mode vs Light Mode Default
            : colors.icon
        },
        selected: {
          color: process.env.EXPO_OS === 'android'
            ? (isDark ? '#FFFFFF' : '#000000ff') // Android: Dark Mode vs Light Mode Selected
            : colors.tint
        },
      }}
      // CHANGE ANDROID ACTIVE INDICATOR (PILL) COLOR HERE
      indicatorColor={process.env.EXPO_OS === 'android'
        ? (isDark ? colors.navy : colors.navy)
        : undefined}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="@android:drawable/ic_dialog_info" />
        <NativeTabs.Trigger.TabBar
          // Use Chrome Material for Opaque-like look on iOS without explicit color glitch
          blurEffect={isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterial'}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="map">
        <Label>Map</Label>
        <Icon sf="map.fill" drawable="@android:drawable/ic_dialog_map" />
        <NativeTabs.Trigger.TabBar
          // Standard Blur for Map
          blurEffect={isDark ? 'systemMaterialDark' : 'systemMaterialLight'}
          backgroundColor={process.env.EXPO_OS === 'android'
            ? (isDark ? colors.card : colors.background)
            : undefined}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="upload">
        <Label>Upload</Label>
        <Icon sf="plus.circle.fill" drawable="@android:drawable/ic_input_add" />
        <NativeTabs.Trigger.TabBar
          blurEffect={isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterial'}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" drawable="@android:drawable/ic_lock_idle_lock" />
        <NativeTabs.Trigger.TabBar
          blurEffect={isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterial'}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
