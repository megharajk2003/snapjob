import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Users, Search, Globe } from 'lucide-react-native';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRole, setSelectedRole] = useState('');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
  ];

  const roles = [
    {
      id: 'hirer',
      title: selectedLanguage === 'ta' ? 'வேலை கொடுப்பவர்' : 'Job Giver',
      subtitle: selectedLanguage === 'ta' ? 'உங்கள் வேலைக்கு ஆள் தேடுங்கள்' : 'Find people for your tasks',
      icon: Search,
      color: '#3B82F6'
    },
    {
      id: 'provider',
      title: selectedLanguage === 'ta' ? 'வேலை தேடுபவர்' : 'Job Seeker',
      subtitle: selectedLanguage === 'ta' ? 'உடனடி வேலை கண்டுபிடியுங்கள்' : 'Find immediate work',
      icon: Users,
      color: '#10B981'
    }
  ];

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert(
        selectedLanguage === 'ta' ? 'தவறு' : 'Error',
        selectedLanguage === 'ta' ? 'தயவுசெய்து உங்கள் பாத்திரத்தை தேர்ந்தெடுக்கவும்' : 'Please select your role'
      );
      return;
    }
    
    router.push({
      pathname: '/auth/phone',
      params: { role: selectedRole, language: selectedLanguage }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: insets.top }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 }}>
          QuickJob
        </Text>
        <Text style={{ fontSize: 18, color: '#64748B', fontWeight: '500' }}>
          {selectedLanguage === 'ta' ? 'உடனடி வேலை' : 'Instant Work'}
        </Text>
      </View>

      {/* Language Selection */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Globe color="#64748B" size={20} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 8 }}>
            {selectedLanguage === 'ta' ? 'மொழி தேர்ந்தெடுக்கவும்' : 'Select Language'}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: selectedLanguage === lang.code ? '#3B82F6' : '#E2E8F0',
                backgroundColor: selectedLanguage === lang.code ? '#EFF6FF' : '#FFFFFF'
              }}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: selectedLanguage === lang.code ? '#3B82F6' : '#64748B',
                textAlign: 'center'
              }}>
                {lang.nativeName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Role Selection */}
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 20 }}>
          {selectedLanguage === 'ta' ? 'நீங்கள் எவ்வாறு QuickJob ஐ பயன்படுத்த விரும்புகிறீர்கள்?' : 'How would you like to use QuickJob?'}
        </Text>

        <View style={{ gap: 16, flex: 1 }}>
          {roles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <TouchableOpacity
                key={role.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: isSelected ? role.color : '#E2E8F0',
                  backgroundColor: isSelected ? `${role.color}10` : '#FFFFFF',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
                onPress={() => setSelectedRole(role.id)}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: role.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16
                }}>
                  <IconComponent color="#FFFFFF" size={24} />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#1E293B',
                    marginBottom: 4
                  }}>
                    {role.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#64748B' }}>
                    {role.subtitle}
                  </Text>
                </View>
                
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: isSelected ? role.color : '#CBD5E1',
                  backgroundColor: isSelected ? role.color : 'transparent'
                }} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Continue Button */}
      <View style={{ padding: 20, paddingBottom: insets.bottom + 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedRole ? '#3B82F6' : '#CBD5E1',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center'
          }}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF'
          }}>
            {selectedLanguage === 'ta' ? 'தொடர்' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}