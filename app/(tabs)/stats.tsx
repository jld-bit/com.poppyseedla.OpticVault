
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type AppearanceMode = 'light' | 'dark';

interface Item {
  id: string;
  brand: string;
  model: string;
  condition: 'New' | 'Used' | 'Vintage';
  price: number;
  notes: string;
  photoUri?: string;
}

export default function StatsScreen() {
  const colors = useThemeColors();
  const [totalItems, setTotalItems] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0.00);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>('light');

  console.log('StatsScreen rendered');

  // Load stats from AsyncStorage
  const loadStats = async () => {
    try {
      const itemsJson = await AsyncStorage.getItem('vaultItems');
      if (itemsJson) {
        const items: Item[] = JSON.parse(itemsJson);
        setTotalItems(items.length);
        const total = items.reduce((sum, item) => sum + item.price, 0);
        setTotalSpend(total);
        console.log('Loaded stats - Items:', items.length, 'Total spend:', total);
      } else {
        setTotalItems(0);
        setTotalSpend(0);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Load stats when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  useEffect(() => {
    const loadAppearance = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('appAppearanceMode');
        if (storedMode === 'light' || storedMode === 'dark') {
          setAppearanceMode(storedMode);
        }
      } catch (error) {
        console.log('Error loading appearance mode:', error);
      }
    };
    loadAppearance();
  }, []);

  const handleDeleteAllData = () => {
    console.log('User tapped Delete All Data button');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    console.log('User confirmed delete all data');
    try {
      await AsyncStorage.removeItem('vaultItems');
      setTotalItems(0);
      setTotalSpend(0);
      console.log('All data deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    console.log('Delete cancelled');
    setShowDeleteModal(false);
  };

  const handleAppearanceChange = async (mode: AppearanceMode) => {
    console.log('User changed appearance mode to:', mode);
    setAppearanceMode(mode);
    try {
      await AsyncStorage.setItem('appAppearanceMode', mode);
      console.log('Appearance mode saved:', mode);
    } catch (error) {
      console.log('Error saving appearance mode:', error);
    }
  };

  const totalItemsDisplay = totalItems.toString();
  const totalSpendDisplay = `$${totalSpend.toFixed(2)}`;
  const paddingTopValue = Platform.OS === 'android' ? 48 : 0;

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
    statCard: {
      backgroundColor: colors.cardLight,
      borderRadius: 12,
      padding: 20,
      marginBottom: 12,
    },
    statLabel: {
      fontSize: 16,
      color: colors.statLabel,
      marginBottom: 8,
    },
    statValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    deleteButton: {
      backgroundColor: colors.danger,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 24,
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    appearanceSection: {
      marginTop: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    appearanceOptions: {
      gap: 12,
    },
    appearanceOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    appearanceLabel: {
      fontSize: 16,
      color: colors.text,
    },
    radioUnchecked: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.textSecondary,
    },
    radioChecked: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#2196F3',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#2196F3',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    modalMessage: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: 22,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalButtonCancel: {
      backgroundColor: colors.backgroundAlt,
    },
    modalButtonDelete: {
      backgroundColor: colors.danger,
    },
    modalButtonTextCancel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    modalButtonTextDelete: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: paddingTopValue }]}>
        <Text style={styles.headerTitle}>Optic Vault</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total items</Text>
          <Text style={styles.statValue}>{totalItemsDisplay}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total spend</Text>
          <Text style={styles.statValue}>{totalSpendDisplay}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAllData}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteButtonText}>Delete All Data</Text>
        </TouchableOpacity>

        <View style={styles.appearanceSection}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Text style={styles.sectionSubtitle}>Choose how the app looks.</Text>
          
          <View style={styles.appearanceOptions}>
            <TouchableOpacity
              style={styles.appearanceOption}
              onPress={() => handleAppearanceChange('light')}
              activeOpacity={0.7}
            >
              <Text style={styles.appearanceLabel}>Light</Text>
              {appearanceMode === 'light' ? (
                <View style={styles.radioChecked}>
                  <View style={styles.radioInner} />
                </View>
              ) : (
                <View style={styles.radioUnchecked} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.appearanceOption}
              onPress={() => handleAppearanceChange('dark')}
              activeOpacity={0.7}
            >
              <Text style={styles.appearanceLabel}>Dark</Text>
              {appearanceMode === 'dark' ? (
                <View style={styles.radioChecked}>
                  <View style={styles.radioInner} />
                </View>
              ) : (
                <View style={styles.radioUnchecked} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete All Data</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete all your items? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={confirmDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonTextDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
