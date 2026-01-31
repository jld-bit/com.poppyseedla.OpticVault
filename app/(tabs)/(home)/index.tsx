
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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
  const colors = useThemeColors();
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  console.log('ItemsScreen rendered with items:', items.length);

  // Load items from AsyncStorage
  const loadItems = async () => {
    try {
      const itemsJson = await AsyncStorage.getItem('vaultItems');
      if (itemsJson) {
        const loadedItems: Item[] = JSON.parse(itemsJson);
        setItems(loadedItems);
        console.log('Loaded items from storage:', loadedItems.length);
      } else {
        setItems([]);
        console.log('No items in storage');
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  // Load items when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

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

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const brandMatch = item.brand.toLowerCase().includes(query);
    const modelMatch = item.model.toLowerCase().includes(query);
    const notesMatch = item.notes.toLowerCase().includes(query);
    return brandMatch || modelMatch || notesMatch;
  });

  const handleSearchChange = (text: string) => {
    console.log('User searching for:', text);
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    console.log('User cleared search');
    setSearchQuery('');
  };

  const paddingTopValue = Platform.OS === 'android' ? 48 : 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: paddingTopValue,
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: colors.background,
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      height: 48,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 0,
    },
    clearButton: {
      padding: 4,
      marginLeft: 8,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 8,
      paddingBottom: 100,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 40,
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
      color: '#FFFFFF',
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

  const showClearButton = searchQuery.length > 0;
  const displayItems = filteredItems;
  const hasNoResults = searchQuery.length > 0 && filteredItems.length === 0;
  const isVaultEmpty = items.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <View style={styles.searchIcon}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={20}
              color={colors.textSecondary}
            />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by brand, model or notes..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {showClearButton ? (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isVaultEmpty ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Your vault is empty</Text>
            <Text style={styles.emptyStateText}>
              Tap the + button below to add your first item
            </Text>
          </View>
        ) : hasNoResults ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <React.Fragment>
            {displayItems.map((item, index) => {
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
          </React.Fragment>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem} activeOpacity={0.8}>
        <IconSymbol
          ios_icon_name="plus"
          android_material_icon_name="add"
          size={28}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
