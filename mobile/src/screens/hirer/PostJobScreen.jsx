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
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { Picker } from '@react-native-picker/picker';

const PostJobScreen = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    paymentType: 'fixed', // 'fixed' or 'hourly'
    budget: '',
    address: '',
    scheduledFor: '',
    verifiedOnly: false
  });

  const categories = [
    'Tailoring',
    'Cooking', 
    'Cleaning',
    'Plumbing',
    'Electrical Work',
    'Gardening',
    'Tutoring',
    'Pet Care',
    'Delivery',
    'Event Services',
    'Beauty Services',
    'Repair Services'
  ];

  const jobTemplates = [
    {
      title: 'Fix Leaking Tap',
      description: 'Need a plumber to fix a leaking kitchen tap',
      category: 'Plumbing',
      budget: '500'
    },
    {
      title: 'Assemble Furniture',
      description: 'Help needed to assemble a new wardrobe',
      category: 'Repair Services',
      budget: '800'
    },
    {
      title: 'Urgent Passport Photo',
      description: 'Need passport size photos urgently',
      category: 'Photography',
      budget: '200'
    }
  ];

  const handleTemplateSelect = (template) => {
    setJobData({
      ...jobData,
      title: template.title,
      description: template.description,
      category: template.category,
      budget: template.budget
    });
  };

  const handlePostJob = async () => {
    if (!jobData.title || !jobData.description || !jobData.category || !jobData.budget) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    try {
      // In real app, post to backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Your job has been posted successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to post job. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      
      {/* Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('postNewJob')}</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {jobTemplates.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.templateCard}
                onPress={() => handleTemplateSelect(template)}
              >
                <Text style={styles.templateTitle}>{template.title}</Text>
                <Text style={styles.templateCategory}>{template.category}</Text>
                <Text style={styles.templateBudget}>₹{template.budget}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Job Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('jobTitle')} *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Need a cook for dinner party"
              value={jobData.title}
              onChangeText={(text) => setJobData({ ...jobData, title: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('jobDescription')} *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the work in detail..."
              value={jobData.description}
              onChangeText={(text) => setJobData({ ...jobData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={jobData.category}
                onValueChange={(value) => setJobData({ ...jobData, category: value })}
                style={styles.picker}
              >
                <Picker.Item label="Select category" value="" />
                {categories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('budget')}</Text>
          
          <View style={styles.paymentTypeContainer}>
            <TouchableOpacity
              style={[
                styles.paymentTypeButton,
                jobData.paymentType === 'fixed' && styles.activePaymentType
              ]}
              onPress={() => setJobData({ ...jobData, paymentType: 'fixed' })}
            >
              <Text style={[
                styles.paymentTypeText,
                jobData.paymentType === 'fixed' && styles.activePaymentTypeText
              ]}>
                Fixed Price
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentTypeButton,
                jobData.paymentType === 'hourly' && styles.activePaymentType
              ]}
              onPress={() => setJobData({ ...jobData, paymentType: 'hourly' })}
            >
              <Text style={[
                styles.paymentTypeText,
                jobData.paymentType === 'hourly' && styles.activePaymentTypeText
              ]}>
                Per Hour
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Amount ({jobData.paymentType === 'fixed' ? 'Total' : 'Per Hour'}) *
            </Text>
            <View style={styles.budgetInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="0"
                value={jobData.budget}
                onChangeText={(text) => setJobData({ ...jobData, budget: text })}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('location')}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={jobData.address}
              onChangeText={(text) => setJobData({ ...jobData, address: text })}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchLabel}>Verified Providers Only</Text>
              <Text style={styles.switchSubLabel}>
                Only show your job to providers with verified badges
              </Text>
            </View>
            <Switch
              value={jobData.verifiedOnly}
              onValueChange={(value) => setJobData({ ...jobData, verifiedOnly: value })}
              trackColor={{ false: '#E2E8F0', true: '#66BB6A' }}
              thumbColor={jobData.verifiedOnly ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>
        </View>
      </ScrollView>

      {/* Post Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.postButton} onPress={handlePostJob}>
          <Text style={styles.postButtonText}>Post Job</Text>
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
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 140,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  templateBudget: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
  },
  paymentTypeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activePaymentType: {
    backgroundColor: '#FFFFFF',
  },
  paymentTypeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activePaymentTypeText: {
    color: '#2E7D32',
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#374151',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  switchSubLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  postButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostJobScreen;