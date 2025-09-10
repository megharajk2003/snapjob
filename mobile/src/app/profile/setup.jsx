import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, User, Briefcase, MapPin, Star } from 'lucide-react-native';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';
import useUpload from '@/utils/useUpload';

export default function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const { role, language, phone } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [upload, { loading: uploadLoading }] = useUpload();

  const isEnglish = language === 'en';
  const isProvider = role === 'provider';

  // Common fields
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Provider-specific fields
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [portfolioUrls, setPortfolioUrls] = useState([]);
  const [wantsVerification, setWantsVerification] = useState(false);

  // Tamil Nadu specific job categories
  const jobCategories = [
    { id: 'tutoring', en: 'Tutoring', ta: 'கற்பித்தல்' },
    { id: 'cooking', en: 'Cooking & Catering', ta: 'சமையல் மற்றும் உணவு சேவை' },
    { id: 'cleaning', en: 'House Cleaning', ta: 'வீட்டு சுத்தம்' },
    { id: 'delivery', en: 'Delivery Services', ta: 'டெலிவரி சேவைகள்' },
    { id: 'gardening', en: 'Gardening', ta: 'தோட்டக்கலை' },
    { id: 'repairs', en: 'Home Repairs', ta: 'வீட்டு பழுதுபார்ப்பு' },
    { id: 'tailoring', en: 'Blouse Design & Tailoring', ta: 'ரவிக்கை வடிவமைப்பு மற்றும் தையல்' },
    { id: 'saree-draping', en: 'Saree Draping', ta: 'புடவை அணிதல்' },
    { id: 'kolam', en: 'Kolam Drawing', ta: 'கோலம் வரைதல்' },
    { id: 'biryani', en: 'Biryani Specialist', ta: 'பிரியாணி நிபுணர்' },
    { id: 'mehendi', en: 'Mehendi Artist', ta: 'மெஹந்தி கலைஞர்' },
    { id: 'photography', en: 'Photography', ta: 'புகைப்படம்' },
    { id: 'decoration', en: 'Event Decoration', ta: 'விழா அலங்காரம்' },
    { id: 'massage', en: 'Massage Therapy', ta: 'மசாஜ் சிகிச்சை' },
    { id: 'babysitting', en: 'Baby Sitting', ta: 'குழந்தை பராமரிப்பு' },
    { id: 'elderly-care', en: 'Elderly Care', ta: 'முதியோர் பராமரிப்பு' },
  ];

  const pickImage = async (isPortfolio = false) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        isEnglish ? 'Permission Required' : 'அனுமதி தேவை',
        isEnglish ? 'Please allow access to your photos' : 'தயவுசெய்து உங்கள் புகைப்படங்களுக்கான அணுகலை அனுமதிக்கவும்'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: !isPortfolio,
      aspect: isPortfolio ? undefined : [1, 1],
      quality: 0.8,
      allowsMultipleSelection: isPortfolio,
    });

    if (!result.canceled) {
      if (isPortfolio) {
        setPortfolioImages([...portfolioImages, ...result.assets]);
      } else {
        setProfileImage(result.assets[0]);
      }
    }
  };

  const uploadImages = async () => {
    try {
      // Upload profile image
      if (profileImage) {
        const { url, error } = await upload({ reactNativeAsset: profileImage });
        if (error) throw new Error('Profile image upload failed');
        setProfileImageUrl(url);
      }

      // Upload portfolio images
      if (portfolioImages.length > 0) {
        const uploadPromises = portfolioImages.map(image => 
          upload({ reactNativeAsset: image })
        );
        const results = await Promise.all(uploadPromises);
        const urls = results.map(result => {
          if (result.error) throw new Error('Portfolio image upload failed');
          return result.url;
        });
        setPortfolioUrls(urls);
      }

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        isEnglish ? 'Upload Failed' : 'பதிவேற்றம் தோல்வி',
        isEnglish ? 'Failed to upload images. Please try again.' : 'படங்களை பதிவேற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
      );
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(
        isEnglish ? 'Name Required' : 'பெயர் தேவை',
        isEnglish ? 'Please enter your name' : 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்'
      );
      return;
    }

    if (isProvider && selectedSkills.length === 0) {
      Alert.alert(
        isEnglish ? 'Skills Required' : 'திறமைகள் தேவை',
        isEnglish ? 'Please select at least one skill' : 'தயவுசெய்து குறைந்தது ஒரு திறமையைத் தேர்ந்தெடுக்கவும்'
      );
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      const uploadSuccess = await uploadImages();
      if (!uploadSuccess) {
        setLoading(false);
        return;
      }

      // TODO: Save profile data to backend
      const profileData = {
        name: name.trim(),
        phone,
        role,
        language,
        profileImage: profileImageUrl,
        ...(isProvider && {
          skills: selectedSkills,
          portfolioImages: portfolioUrls,
          wantsVerification
        })
      };

      console.log('Profile data:', profileData);

      // Navigate to main app
      router.replace({
        pathname: isProvider ? '/(tabs)' : '/(tabs)',
        params: { role, language }
      });

    } catch (error) {
      console.error('Profile setup error:', error);
      Alert.alert(
        isEnglish ? 'Setup Failed' : 'அமைப்பு தோல்வி',
        isEnglish ? 'Failed to create profile. Please try again.' : 'சுயவிவரம் உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: insets.top }}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingHorizontal: 20, 
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0'
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16 }}
          >
            <ArrowLeft color="#374151" size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B' }}>
            {isEnglish ? 'Setup Profile' : 'சுயவிவரம் அமைக்கவும்'}
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Profile Image Section */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <TouchableOpacity
              onPress={() => pickImage(false)}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: profileImage ? 'transparent' : '#EFF6FF',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#E2E8F0',
                marginBottom: 16,
                overflow: 'hidden'
              }}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage.uri }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Camera color="#3B82F6" size={32} />
                  <Text style={{ fontSize: 12, color: '#3B82F6', marginTop: 8 }}>
                    {isEnglish ? 'Add Photo' : 'படம் சேர்க்கவும்'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center' }}>
              {isEnglish ? 'Upload your profile photo' : 'உங்கள் சுயவிவர புகைப்படத்தை பதிவேற்றவும்'}
            </Text>
          </View>

          {/* Name Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
              {isEnglish ? 'Full Name' : 'முழு பெயர்'}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#E2E8F0',
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 16
            }}>
              <User color="#94A3B8" size={20} />
              <TextInput
                style={{ flex: 1, fontSize: 16, paddingVertical: 16, marginLeft: 12, color: '#1E293B' }}
                placeholder={isEnglish ? 'Enter your full name' : 'உங்கள் முழு பெயரை உள்ளிடவும்'}
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Provider-specific fields */}
          {isProvider && (
            <>
              {/* Skills Selection */}
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Briefcase color="#374151" size={20} />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 8 }}>
                    {isEnglish ? 'Select Your Skills' : 'உங்கள் திறமைகளை தேர்ந்தெடுக்கவும்'}
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {jobCategories.map((category) => {
                    const isSelected = selectedSkills.includes(category.id);
                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 20,
                          borderWidth: 2,
                          borderColor: isSelected ? '#10B981' : '#E2E8F0',
                          backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF'
                        }}
                        onPress={() => toggleSkill(category.id)}
                      >
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: isSelected ? '#10B981' : '#64748B'
                        }}>
                          {isEnglish ? category.en : category.ta}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Portfolio Images */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                  {isEnglish ? 'Portfolio Images (Optional)' : 'போர்ட்ஃபோலியோ படங்கள் (விருப்பம்)'}
                </Text>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => pickImage(true)}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        backgroundColor: '#EFF6FF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: '#E2E8F0',
                        borderStyle: 'dashed'
                      }}
                    >
                      <Camera color="#3B82F6" size={24} />
                    </TouchableOpacity>
                    
                    {portfolioImages.map((image, index) => (
                      <View key={index} style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        overflow: 'hidden',
                        borderWidth: 2,
                        borderColor: '#E2E8F0'
                      }}>
                        <Image
                          source={{ uri: image.uri }}
                          style={{ width: '100%', height: '100%' }}
                          contentFit="cover"
                        />
                      </View>
                    ))}
                  </View>
                </ScrollView>
                
                <Text style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>
                  {isEnglish ? 'Add photos of your work to attract more clients' : 'அதிக வாடிக்கையாளர்களை ஈர்க்க உங்கள் வேலையின் புகைப்படங்களைச் சேர்க்கவும்'}
                </Text>
              </View>

              {/* ID Verification Option */}
              <View style={{ marginBottom: 32 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: wantsVerification ? '#F59E0B' : '#E2E8F0',
                    backgroundColor: wantsVerification ? '#FFFBEB' : '#FFFFFF'
                  }}
                  onPress={() => setWantsVerification(!wantsVerification)}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#FEF3C7',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                  }}>
                    <Star color="#F59E0B" size={20} />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 }}>
                      {isEnglish ? 'Get Verified Badge' : 'சரிபார்க்கப்பட்ட பேட்ஜ் பெறுங்கள்'}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#64748B' }}>
                      {isEnglish ? 'Upload ID for verification (increases trust)' : 'சரிபார்ப்புக்கு ஐடி பதிவேற்றவும் (நம்பிக்கையை அதிகரிக்கிறது)'}
                    </Text>
                  </View>
                  
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: wantsVerification ? '#F59E0B' : '#CBD5E1',
                    backgroundColor: wantsVerification ? '#F59E0B' : 'transparent'
                  }} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: name.trim() && (!isProvider || selectedSkills.length > 0) ? '#10B981' : '#CBD5E1',
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: insets.bottom + 20
            }}
            onPress={handleSubmit}
            disabled={!name.trim() || (isProvider && selectedSkills.length === 0) || loading || uploadLoading}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#FFFFFF'
            }}>
              {loading || uploadLoading
                ? (isEnglish ? 'Creating Profile...' : 'சுயவிவரம் உருவாக்குகிறது...')
                : (isEnglish ? 'Complete Setup' : 'அமைப்பை முடிக்கவும்')
              }
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}