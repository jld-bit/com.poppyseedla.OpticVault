
import { StyleSheet, ViewStyle, TextStyle, useColorScheme } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Hook to get theme-aware colors
export const useThemeColors = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  
  return {
    primary: '#8B4513',      // Dark brown/burgundy for buttons
    secondary: '#A0522D',    // Sienna brown
    accent: '#CD853F',       // Peru/tan accent
    background: theme.colors.background,
    backgroundAlt: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
    text: theme.colors.text,
    textSecondary: colorScheme === 'dark' ? '#666666' : '#666666',
    card: theme.colors.card,
    cardLight: colorScheme === 'dark' ? '#2A2A2A' : '#E8E8E8',
    border: colorScheme === 'dark' ? '#444444' : '#E0E0E0',
    danger: colorScheme === 'dark' ? '#8B3A3A' : '#DC2626',
    modalOptionBackground: colorScheme === 'dark' ? '#333333' : '#F0F0F0',
    modalOptionText: colorScheme === 'dark' ? '#CCCCCC' : '#000000',
    inputBackground: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF',
    inputText: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    statLabel: colorScheme === 'dark' ? '#888888' : '#666666',
  };
};

// Legacy static colors for backwards compatibility (will use dark theme colors)
export const colors = {
  primary: '#8B4513',
  secondary: '#A0522D',
  accent: '#CD853F',
  background: '#000000',
  backgroundAlt: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#999999',
  card: '#1A1A1A',
  cardLight: '#E8E8E8',
  border: '#333333',
  danger: '#8B3A3A',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: "white",
  },
});
