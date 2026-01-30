
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/IconSymbol';

type Condition = 'New' | 'Used' | 'Vintage';

export default function AddItemScreen() {
  const router = useRouter();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState<Condition>('New');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);

  console.log('AddItemScreen rendered');

  const handleSave = () => {
    console.log('User tapped Save button', { brand, model, condition, price, notes });
    router.back();
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
    setShowImageSourceModal(false);

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      console.log('Camera permission denied');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      console.log('Photo captured:', result.assets[0].uri);
    }
  };

  const handleGalleryPick = async () => {
    console.log('User selected Gallery option');
    setShowImageSourceModal(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      console.log('Photo selected from gallery:', result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    console.log('User tapped Remove Photo button');
    setPhotoUri(null);
  };

  const paddingTopValue = Platform.OS === 'android' ? 48 : 0;

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
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showImageSourceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
          </View>
        </View>
      </Modal>
    </React.Fragment>
  );
}

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
    color: colors.text,
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
    color: colors.text,
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
