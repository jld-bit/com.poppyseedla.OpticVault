
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <Label>Items</Label>
        <Icon sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }} drawable="apps" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="stats">
        <Label>Stats</Label>
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} drawable="bar-chart" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
