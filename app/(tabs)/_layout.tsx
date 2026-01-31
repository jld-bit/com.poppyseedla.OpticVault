
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'lock',
      label: 'Optic Vault',
    },
    {
      name: 'stats',
      route: '/(tabs)/stats',
      icon: 'insert-chart',
      label: 'Stats',
    },
  ];

  console.log('Android/Web TabLayout rendering with tabs:', tabs);

  return (
    <React.Fragment>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="stats" name="stats" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </React.Fragment>
  );
}
