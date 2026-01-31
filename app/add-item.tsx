
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from '@pietile-native-kit/keyboard-aware-scrollview';

type Condition = 'New' | 'Used' | 'Vintage';

interface Item {
  id: string;
  brand: string;
  model: string;
  condition: Condition;
  price: number;
  notes: string;
  photoUri?: string;
}

export default function AddItemScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState<Condition>('New');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);

  console.log('AddItemScreen rendered');

  const handleSave = async () => {
    console.log('User tapped Save button', { brand, model, condition, price, notes });
    
    const brandValue = brand.trim();
    const modelValue = model.trim();
    
    if (!brandValue || !modelValue) {
      console.log('Validation failed: brand and model are required');
      Alert.alert('Required Fields', 'Please enter both brand and model.');
      return;
    }

    try {
      const existingItemsJson = await AsyncStorage.getItem('vaultItems');
      const existingItems: Item[] = existingItemsJson ? JSON.parse(existingItemsJson) : [];
      
      const priceValue = price ? parseFloat(price) : 0;
      const notesValue = notes.trim();
      
      const newItem: Item = {
        id: Date.now().toString(),
        brand: brandValue,
        model: modelValue,
        condition,
        price: priceValue,
        notes: notesValue,
        photoUri: photoUri || undefined,
      };

      const updatedItems = [...existingItems, newItem];
      
      await AsyncStorage.setItem('vaultItems', JSON.stringify(updatedItems));
      console.log('Item saved successfully:', newItem);
      
      router.back();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    }
  };

  const handleCancel = () => {
    console.log('User tapped Cancel button');
    router.back();
  };

  const handleAddPhoto = () => {
    console.log('User tapped Add Photo button');
    setShowImageSourceModal(true);
  };

  const handleCameraCapture = async () => {
    console.log('User selected Camera option');

    try {
      console.log('Requesting camera permissions...');
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission result:', permissionResult);
      
      if (!permissionResult.granted) {
        console.log('Camera permission denied');
        setShowImageSourceModal(false);
        Alert.alert('Permission Required', 'Camera access is needed to take photos.');
        return;
      }

      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setPhotoUri(selectedUri);
        console.log('Photo captured:', selectedUri);
      } else {
        console.log('Camera was canceled');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setShowImageSourceModal(false);
    }
  };

  const handleGalleryPick = async () => {
    console.log('User selected Gallery option');

    try {
      console.log('Requesting media library permissions...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission result:', permissionResult);
      
      if (!permissionResult.granted) {
        console.log('Media library permission denied');
        setShowImageSourceModal(false);
        Alert.alert('Permission Required', 'Photo library access is needed to choose photos.');
        return;
      }

      console.log('Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setPhotoUri(selectedUri);
        console.log('Photo selected from gallery:', selectedUri);
      } else {
        console.log('Gallery selection was canceled');
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      Alert.alert('Error', 'Failed to pick photo. Please try again.');
    } finally {
      setShowImageSourceModal(false);
    }
  };

  const handleRemovePhoto = () => {
    console.log('User tapped Remove Photo button');
    setPhotoUri(null);
  };

  const paddingTopValue = Platform.OS === 'android' ? 48 : 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    headerButton: {
      fontSize: 16,
      color: colors.text,
      paddingHorizontal: 16,
    },
    photoSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    photoContainer: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.card,
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    addPhotoButton: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    addPhotoText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
    },
    formSection: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notesInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    conditionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    conditionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    conditionButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    conditionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    conditionButtonTextActive: {
      color: '#FFFFFF',
    },
    priceInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingLeft: 12,
    },
    currencySymbol: {
      fontSize: 16,
      color: colors.text,
      marginRight: 4,
    },
    priceInput: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    removePhotoButton: {
      backgroundColor: colors.danger,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 12,
    },
    removePhotoText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
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
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.backgroundAlt,
      borderRadius: 8,
      marginBottom: 12,
    },
    modalOptionText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 16,
      fontWeight: '500',
    },
    modalCancelButton: {
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    modalCancelText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '500',
    },
  });

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Add Item',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.headerButton}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.headerButton}>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          extraScrollHeight={20}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
        >
          <View style={styles.photoSection}>
            {photoUri ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photoUri }} style={styles.photo} />
              </View>
            ) : (
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <IconSymbol
                  ios_icon_name="camera"
                  android_material_icon_name="camera"
                  size={32}
                  color={colors.textSecondary}
                />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Brand *</Text>
            <TextInput
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
              placeholder="Oakley, Ray-Ban..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Model *</Text>
            <TextInput
              style={styles.input}
              value={model}
              onChangeText={setModel}
              placeholder="Holbrook, Wayfarer..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Condition (details)</Text>
            <View style={styles.conditionButtons}>
              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  condition === 'New' && styles.conditionButtonActive,
                ]}
                onPress={() => setCondition('New')}
              >
                <Text
                  style={[
                    styles.conditionButtonText,
                    condition === 'New' && styles.conditionButtonTextActive,
                  ]}
                >
                  New
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  condition === 'Used' && styles.conditionButtonActive,
                ]}
                onPress={() => setCondition('Used')}
              >
                <Text
                  style={[
                    styles.conditionButtonText,
                    condition === 'Used' && styles.conditionButtonTextActive,
                  ]}
                >
                  Used
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  condition === 'Vintage' && styles.conditionButtonActive,
                ]}
                onPress={() => setCondition('Vintage')}
              >
                <Text
                  style={[
                    styles.conditionButtonText,
                    condition === 'Vintage' && styles.conditionButtonTextActive,
                  ]}
                >
                  Vintage
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Purchase price (optional)</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={setPrice}
                placeholder="99.99"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Where you bought it, limited edition..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          {photoUri ? (
            <TouchableOpacity style={styles.removePhotoButton} onPress={handleRemovePhoto}>
              <Text style={styles.removePhotoText}>Remove Photo</Text>
            </TouchableOpacity>
          ) : null}
        </KeyboardAwareScrollView>
      </SafeAreaView>

      <Modal
        visible={showImageSourceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageSourceModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageSourceModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Add Photo</Text>
            <Text style={styles.modalSubtitle}>Choose a photo source</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleCameraCapture}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="camera"
                android_material_icon_name="camera"
                size={24}
                color={colors.text}
              />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleGalleryPick}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="photo"
                android_material_icon_name="photo"
                size={24}
                color={colors.text}
              />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowImageSourceModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </React.Fragment>
  );
}
