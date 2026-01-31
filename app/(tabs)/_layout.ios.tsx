
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <Label>Optic Vault</Label>
        <Icon 
          sf={{ default: 'lock', selected: 'lock.fill' }} 
          drawable="lock" 
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="stats">
        <Label>Stats</Label>
        <Icon 
          sf={{ default: 'chart.bar.xaxis', selected: 'chart.bar.xaxis' }} 
          drawable="bar-chart" 
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
