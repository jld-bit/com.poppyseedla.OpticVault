
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

interface Item {
  id: string;
  brand: string;
  model: string;
  condition: 'New' | 'Used' | 'Vintage';
  price: number;
  notes: string;
  photoUri?: string;
}

export default function ItemsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      brand: 'Oakley',
      model: 'Holbrook',
      condition: 'New',
      price: 150.00,
      notes: 'Polarized lenses',
    },
    {
      id: '2',
      brand: 'Ray-Ban',
      model: 'Wayfarer',
      condition: 'Used',
      price: 100.00,
      notes: 'Classic style',
    },
    {
      id: '3',
      brand: 'Persol',
      model: 'PO3019S',
      condition: 'Vintage',
      price: 100.00,
      notes: 'Limited edition',
    },
  ]);

  console.log('ItemsScreen rendered with items:', items.length);

  const handleAddItem = () => {
    console.log('User tapped Add Item button');
    router.push('/add-item');
  };

  const handleEditItem = (itemId: string) => {
    console.log('User tapped Edit Item:', itemId);
    router.push(`/edit-item?id=${itemId}`);
  };

  const conditionColor = (condition: string) => {
    if (condition === 'New') return '#4CAF50';
    if (condition === 'Used') return '#FF9800';
    return '#9C27B0';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Optic Vault</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {items.map((item, index) => {
          const priceDisplay = `$${item.price.toFixed(2)}`;
          const conditionColorValue = conditionColor(item.condition);
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.itemCard}
              onPress={() => handleEditItem(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemBrand}>{item.brand}</Text>
                  <Text style={styles.itemModel}>{item.model}</Text>
                </View>
                <View style={[styles.conditionBadge, { backgroundColor: conditionColorValue }]}>
                  <Text style={styles.conditionText}>{item.condition}</Text>
                </View>
              </View>
              
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>{priceDisplay}</Text>
                {item.notes ? (
                  <Text style={styles.itemNotes} numberOfLines={1}>{item.notes}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem} activeOpacity={0.8}>
        <IconSymbol
          ios_icon_name="plus"
          android_material_icon_name="add"
          size={28}
          color={colors.text}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemBrand: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  itemModel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  itemNotes: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    marginLeft: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
