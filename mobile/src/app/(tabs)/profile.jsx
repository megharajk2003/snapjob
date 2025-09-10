import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  User, 
  Star, 
  MapPin, 
  Phone, 
  Settings, 
  LogOut, 
  Edit3,
  Shield,
  Briefcase,
  IndianRupee,
  Clock,
  Award
} from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { role = 'provider', language = 'en' } = useLocalSearchParams();
  const isEnglish = language === 'en';
  const isProvider = role === 'provider';

  // Mock user data
  const userData = {
    name: 'Priya Sharma',
    phone: '+91 9876543210',
    profileImage: null,
    rating: 4.8,
    totalJobs: isProvider ? 47 : 23,
    location: 'T. Nagar, Chennai',
    joinedDate: 'January 2024',
    isVerified: true,
    skills: isProvider ? ['cooking', 'cleaning', 'tutoring'] : [],
    earnings: isProvider ? 15420 : null,
    completionRate: isProvider ? 96 : null
  };

  const skillCategories = {
    'cooking': { en: 'Cooking & Catering', ta: 'சமையல் மற்றும் உணவு சேவை' },
    'cleaning': { en: 'House Cleaning', ta: 'வீட்டு சுத்தம்' },
    'tutoring': { en: 'Tutoring', ta: 'கற்பித்தல்' },
    'tailoring': { en: 'Blouse Design & Tailoring', ta: 'ரவிக்கை வடிவமைப்பு மற்றும் தையல்' },
    'saree-draping': { en: 'Saree Draping', ta: 'புடவை அணிதல்' },
    'kolam': { en: 'Kolam Drawing', ta: 'கோலம் வரைதல்' },
    'biryani': { en: 'Biryani Specialist', ta: 'பிரியாணி நிபுணர்' }
  };

  const handleLogout = () => {
    Alert.alert(
      isEnglish ? 'Logout' : 'வெளியேறு',
      isEnglish ? 'Are you sure you want to logout?' : 'நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?',
      [
        {
          text: isEnglish ? 'Cancel' : 'ரத்து',
          style: 'cancel'
        },
        {
          text: isEnglish ? 'Logout' : 'வெளியேறு',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear user session and navigate to onboarding
            router.replace('/onboarding');
          }
        }
      ]
    );
  };

  const StatCard = ({ icon: Icon, title, value, color = '#3B82F6' }) => (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      flex: 1,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0'
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${color}20`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
      }}>
        <Icon color={color} size={20} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 4 }}>
        {value}
      </Text>
      <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center' }}>
        {title}
      </Text>
    </View>
  );

  const MenuButton = ({ icon: Icon, title, onPress, color = '#374151', showArrow = true }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0'
      }}
      onPress={onPress}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
      }}>
        <Icon color={color} size={20} />
      </View>
      <Text style={{ fontSize: 16, fontWeight: '500', color, flex: 1 }}>
        {title}
      </Text>
      {showArrow && (
        <Text style={{ fontSize: 18, color: '#94A3B8' }}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0'
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
            {isEnglish ? 'Profile' : 'சுயவிவரம்'}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/profile/edit')}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: '#F8FAFC'
            }}
          >
            <Edit3 color="#374151" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}>
        {/* Profile Header */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          alignItems: 'center'
        }}>
          {/* Profile Image */}
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}>
              {userData.profileImage ? (
                <Image
                  source={{ uri: userData.profileImage }}
                  style={{ width: '100%', height: '100%', borderRadius: 40 }}
                  contentFit="cover"
                />
              ) : (
                <User color="#3B82F6" size={32} />
              )}
            </View>
            
            {userData.isVerified && (
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#10B981',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#FFFFFF'
              }}>
                <Shield color="#FFFFFF" size={12} />
              </View>
            )}
          </View>

          {/* Name and Rating */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 }}>
            {userData.name}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Star color="#F59E0B" size={16} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#F59E0B', marginLeft: 4 }}>
              {userData.rating}
            </Text>
            <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 8 }}>
              ({userData.totalJobs} {isProvider ? (isEnglish ? 'jobs completed' : 'வேலைகள் முடிந்தது') : (isEnglish ? 'jobs posted' : 'வேலைகள் இடப்பட்டது')})
            </Text>
          </View>

          {/* Location */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <MapPin color="#64748B" size={14} />
            <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4 }}>
              {userData.location}
            </Text>
          </View>

          {/* Skills for Provider */}
          {isProvider && userData.skills.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {userData.skills.map((skill) => (
                <View
                  key={skill}
                  style={{
                    backgroundColor: '#F0FDF4',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#BBF7D0'
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '500', color: '#059669' }}>
                    {skillCategories[skill] ? (isEnglish ? skillCategories[skill].en : skillCategories[skill].ta) : skill}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {isProvider ? (
            <>
              <StatCard
                icon={IndianRupee}
                title={isEnglish ? 'Total Earnings' : 'மொத்த வருமானம்'}
                value={`₹${userData.earnings?.toLocaleString()}`}
                color="#10B981"
              />
              <StatCard
                icon={Award}
                title={isEnglish ? 'Success Rate' : 'வெற்றி விகிதம்'}
                value={`${userData.completionRate}%`}
                color="#F59E0B"
              />
            </>
          ) : (
            <>
              <StatCard
                icon={Briefcase}
                title={isEnglish ? 'Jobs Posted' : 'வேலைகள் இடப்பட்டது'}
                value={userData.totalJobs}
                color="#3B82F6"
              />
              <StatCard
                icon={Clock}
                title={isEnglish ? 'Member Since' : 'உறுப்பினர் முதல்'}
                value={userData.joinedDate}
                color="#8B5CF6"
              />
            </>
          )}
        </View>

        {/* Menu Options */}
        <View style={{ marginBottom: 20 }}>
          <MenuButton
            icon={Phone}
            title={userData.phone}
            onPress={() => {}}
            showArrow={false}
          />
          
          <MenuButton
            icon={Settings}
            title={isEnglish ? 'Settings' : 'அமைப்புகள்'}
            onPress={() => router.push('/settings')}
          />
          
          {isProvider && (
            <MenuButton
              icon={Shield}
              title={isEnglish ? 'Verification' : 'சரிபார்ப்பு'}
              onPress={() => router.push('/verification')}
            />
          )}
          
          <MenuButton
            icon={LogOut}
            title={isEnglish ? 'Logout' : 'வெளியேறு'}
            onPress={handleLogout}
            color="#DC2626"
            showArrow={false}
          />
        </View>

        {/* App Info */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 }}>
            QuickJob
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B' }}>
            {isEnglish ? 'Version 1.0.0' : 'பதிப்பு 1.0.0'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}