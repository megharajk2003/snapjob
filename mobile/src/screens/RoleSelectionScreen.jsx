import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoleSelectionScreen = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleRoleSelect = async (role) => {
    try {
      await AsyncStorage.setItem('userRole', role);
      if (role === 'provider') {
        router.push('/provider/profile-setup');
      } else {
        router.push('/hirer/dashboard');
      }
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{t('selectRole')}</Text>
          
          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleRoleSelect('provider')}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.cardGradient}
              >
                <Ionicons name="hammer" size={48} color="#FFFFFF" />
                <Text style={styles.cardTitle}>{t('findWork')}</Text>
                <Text style={styles.cardDescription}>{t('findWorkDesc')}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleRoleSelect('hirer')}
            >
              <LinearGradient
                colors={['#4ECDC4', '#44A08D']}
                style={styles.cardGradient}
              >
                <Ionicons name="business" size={48} color="#FFFFFF" />
                <Text style={styles.cardTitle}>{t('postWork')}</Text>
                <Text style={styles.cardDescription}>{t('postWorkDesc')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.note}>
            You can switch roles later from your profile
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 320,
  },
  roleCard: {
    marginVertical: 12,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  note: {
    fontSize: 12,
    color: '#E8F5E8',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default RoleSelectionScreen;