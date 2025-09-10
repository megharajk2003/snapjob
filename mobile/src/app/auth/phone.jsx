import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone, MessageSquare } from 'lucide-react-native';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

export default function PhoneAuthScreen() {
  const insets = useSafeAreaInsets();
  const { role, language } = useLocalSearchParams();
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  const isEnglish = language === 'en';

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert(
        isEnglish ? 'Invalid Number' : 'தவறான எண்',
        isEnglish ? 'Please enter a valid 10-digit mobile number' : 'தயவுசெய்து சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்'
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement OTP sending logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setStep('otp');
    } catch (error) {
      Alert.alert(
        isEnglish ? 'Error' : 'தவறு',
        isEnglish ? 'Failed to send OTP. Please try again.' : 'OTP அனுப்புவதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert(
        isEnglish ? 'Invalid OTP' : 'தவறான OTP',
        isEnglish ? 'Please enter the complete 6-digit OTP' : 'தயவுசெய்து முழுமையான 6 இலக்க OTP ஐ உள்ளிடவும்'
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement OTP verification logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      
      // Navigate to profile setup or main app based on role
      router.replace({
        pathname: '/profile/setup',
        params: { role, language, phone: phoneNumber }
      });
    } catch (error) {
      Alert.alert(
        isEnglish ? 'Verification Failed' : 'சரிபார்ப்பு தோல்வி',
        isEnglish ? 'Invalid OTP. Please try again.' : 'தவறான OTP. மீண்டும் முயற்சிக்கவும்.'
      );
    } finally {
      setLoading(false);
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
            {step === 'phone' 
              ? (isEnglish ? 'Phone Verification' : 'போன் சரிபார்ப்பு')
              : (isEnglish ? 'Enter OTP' : 'OTP உள்ளிடவும்')
            }
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
          {step === 'phone' ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {/* Phone Icon */}
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#EFF6FF',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: 32
              }}>
                <Phone color="#3B82F6" size={32} />
              </View>

              {/* Title */}
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1E293B',
                textAlign: 'center',
                marginBottom: 16
              }}>
                {isEnglish ? 'Enter Your Mobile Number' : 'உங்கள் மொபைல் எண்ணை உள்ளிடவும்'}
              </Text>

              <Text style={{
                fontSize: 16,
                color: '#64748B',
                textAlign: 'center',
                marginBottom: 40,
                lineHeight: 24
              }}>
                {isEnglish 
                  ? 'We will send you a verification code to confirm your number'
                  : 'உங்கள் எண்ணை உறுதிப்படுத்த நாங்கள் உங்களுக்கு சரிபார்ப்பு குறியீட்டை அனுப்புவோம்'
                }
              </Text>

              {/* Phone Input */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#E2E8F0',
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 16,
                marginBottom: 32
              }}>
                <Text style={{ fontSize: 16, color: '#374151', marginRight: 12 }}>+91</Text>
                <TextInput
                  style={{ flex: 1, fontSize: 16, paddingVertical: 16, color: '#1E293B' }}
                  placeholder={isEnglish ? 'Mobile number' : 'மொபைல் எண்'}
                  placeholderTextColor="#94A3B8"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              {/* Send OTP Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: phoneNumber.length === 10 ? '#3B82F6' : '#CBD5E1',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center'
                }}
                onPress={handleSendOTP}
                disabled={phoneNumber.length !== 10 || loading}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}>
                  {loading 
                    ? (isEnglish ? 'Sending...' : 'அனுப்புகிறது...')
                    : (isEnglish ? 'Send OTP' : 'OTP அனுப்பு')
                  }
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {/* Message Icon */}
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#F0FDF4',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: 32
              }}>
                <MessageSquare color="#10B981" size={32} />
              </View>

              {/* Title */}
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1E293B',
                textAlign: 'center',
                marginBottom: 16
              }}>
                {isEnglish ? 'Verify Your Number' : 'உங்கள் எண்ணை சரிபார்க்கவும்'}
              </Text>

              <Text style={{
                fontSize: 16,
                color: '#64748B',
                textAlign: 'center',
                marginBottom: 40,
                lineHeight: 24
              }}>
                {isEnglish 
                  ? `We sent a 6-digit code to +91${phoneNumber}`
                  : `நாங்கள் +91${phoneNumber} க்கு 6 இலக்க குறியீட்டை அனுப்பியுள்ளோம்`
                }
              </Text>

              {/* OTP Input */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => otpRefs.current[index] = ref}
                    style={{
                      width: 48,
                      height: 56,
                      borderWidth: 2,
                      borderColor: digit ? '#3B82F6' : '#E2E8F0',
                      borderRadius: 12,
                      backgroundColor: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: '600',
                      textAlign: 'center',
                      color: '#1E293B'
                    }}
                    value={digit}
                    onChangeText={(value) => handleOTPChange(value, index)}
                    keyboardType="numeric"
                    maxLength={1}
                  />
                ))}
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: otp.join('').length === 6 ? '#10B981' : '#CBD5E1',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 16
                }}
                onPress={handleVerifyOTP}
                disabled={otp.join('').length !== 6 || loading}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}>
                  {loading 
                    ? (isEnglish ? 'Verifying...' : 'சரிபார்க்கிறது...')
                    : (isEnglish ? 'Verify OTP' : 'OTP சரிபார்க்கவும்')
                  }
                </Text>
              </TouchableOpacity>

              {/* Resend OTP */}
              <TouchableOpacity onPress={() => setStep('phone')}>
                <Text style={{
                  fontSize: 14,
                  color: '#3B82F6',
                  textAlign: 'center',
                  textDecorationLine: 'underline'
                }}>
                  {isEnglish ? 'Resend OTP' : 'OTP மீண்டும் அனுப்பு'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}