import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import * as ImagePicker from 'expo-image-picker';

const ProfileSetupScreen = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    profilePicture: null,
    primarySkill: '',
    secondarySkills: [],
    portfolio: []
  });

  const skills = [
    'Aari Embroidery Blouse Work',
    'Saree Draping',
    'Mehendi Design',
    'Chettinad Sambar Specialist',
    'Golu Padi Setup Assistant',
    'Varalakshmi Pooja Decoration',
    'School Project Model Making',
    'Murali/Tanjore Painting',
    'Cooking',
    'Cleaning',
    'Plumbing',
    'Electrical Work',
    'Gardening',
    'Tutoring',
    'Pet Care',
    'Delivery'
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfile({ ...profile, profilePicture: result.assets[0].uri });
    }
  };

  const handlePrimarySkillSelect = (skill) => {
    setProfile({ ...profile, primarySkill: skill });
  };

  const toggleSecondarySkill = (skill) => {
    const { secondarySkills } = profile;
    if (secondarySkills.includes(skill)) {
      setProfile({
        ...profile,
        secondarySkills: secondarySkills.filter(s => s !== skill)
      });
    } else if (secondarySkills.length < 5) {
      setProfile({
        ...profile,
        secondarySkills: [...secondarySkills, skill]
      });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!profile.firstName || !profile.lastName) {
        Alert.alert('Required', 'Please fill in your name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!profile.primarySkill) {
        Alert.alert('Required', 'Please select your primary skill');
        return;
      }
      setStep(3);
    } else {
      // Complete profile setup
      router.replace('/(tabs)/provider-home');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('profileSetup')}</Text>
      
      <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
        {profile.profilePicture ? (
          <Image source={{ uri: profile.profilePicture }} style={styles.profilePhoto} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera" size={40} color="#94A3B8" />
            <Text style={styles.photoText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={profile.firstName}
        onChangeText={(text) => setProfile({ ...profile, firstName: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={profile.lastName}
        onChangeText={(text) => setProfile({ ...profile, lastName: text })}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('skillsSelection')}</Text>
      <Text style={styles.stepSubtitle}>Select your primary skill</Text>
      
      <ScrollView style={styles.skillsList}>
        {skills.map((skill) => (
          <TouchableOpacity
            key={skill}
            style={[
              styles.skillItem,
              profile.primarySkill === skill && styles.selectedSkill
            ]}
            onPress={() => handlePrimarySkillSelect(skill)}
          >
            <Text style={[
              styles.skillText,
              profile.primarySkill === skill && styles.selectedSkillText
            ]}>
              {t(`skills.${skill}`)}
            </Text>
            {profile.primarySkill === skill && (
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Secondary Skills</Text>
      <Text style={styles.stepSubtitle}>Select up to 5 additional skills</Text>
      
      <ScrollView style={styles.skillsList}>
        {skills.filter(skill => skill !== profile.primarySkill).map((skill) => (
          <TouchableOpacity
            key={skill}
            style={[
              styles.skillItem,
              profile.secondarySkills.includes(skill) && styles.selectedSecondarySkill
            ]}
            onPress={() => toggleSecondarySkill(skill)}
          >
            <Text style={[
              styles.skillText,
              profile.secondarySkills.includes(skill) && styles.selectedSecondarySkillText
            ]}>
              {t(`skills.${skill}`)}
            </Text>
            {profile.secondarySkills.includes(skill) && (
              <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.selectedCount}>
        {profile.secondarySkills.length}/5 skills selected
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Setup Profile</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>{step}/3</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {step === 3 ? 'Complete Setup' : t('next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  photoText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  skillsList: {
    flex: 1,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedSkill: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  selectedSecondarySkill: {
    backgroundColor: '#F0FDFA',
    borderColor: '#4ECDC4',
  },
  skillText: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  selectedSkillText: {
    color: '#FFFFFF',
  },
  selectedSecondarySkillText: {
    color: '#047857',
  },
  selectedCount: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginTop: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  nextButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSetupScreen;