import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelectionScreen = () => {
  const router = useRouter();
  const { changeLanguage, languages } = useLanguage();

  const handleLanguageSelect = async (languageCode) => {
    await changeLanguage(languageCode);
    router.replace('/auth/phone');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Select Language</Text>
          <Text style={styles.subtitle}>மொழியைத் தேர்ந்தெடுக்கவும்</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => handleLanguageSelect('en')}
            >
              <Text style={styles.buttonText}>English</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => handleLanguageSelect('ta')}
            >
              <Text style={styles.buttonText}>தமிழ்</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.note}>
            You can change this later in settings
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#E8F5E8',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  languageButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  note: {
    fontSize: 14,
    color: '#E8F5E8',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LanguageSelectionScreen;