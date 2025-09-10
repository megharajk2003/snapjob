import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Star,
  User,
  Briefcase
} from 'lucide-react-native';

export default function JobsScreen() {
  const insets = useSafeAreaInsets();
  const { language = 'en' } = useLocalSearchParams();
  const isEnglish = language === 'en';
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('available'); // 'available', 'applied', 'ongoing', 'completed'

  // Mock job data
  const mockJobs = {
    available: [
      {
        id: '1',
        title: 'House Cleaning Needed',
        category: 'cleaning',
        description: 'Need someone to clean a 2BHK apartment. All cleaning supplies will be provided.',
        budget: 500,
        budgetType: 'fixed',
        location: 'T. Nagar, Chennai',
        distance: 0.8,
        postedBy: 'Meera Devi',
        postedByRating: 4.7,
        timeAgo: '2 hours ago',
        applicants: 3,
        isUrgent: false
      },
      {
        id: '2',
        title: 'Biryani Cooking for Party',
        category: 'biryani',
        description: 'Need an expert biryani cook for a family function. 50 people expected.',
        budget: 200,
        budgetType: 'hourly',
        location: 'Adyar, Chennai',
        distance: 1.5,
        postedBy: 'Suresh Babu',
        postedByRating: 4.9,
        timeAgo: '1 hour ago',
        applicants: 8,
        isUrgent: true
      },
      {
        id: '3',
        title: 'Saree Draping Service',
        category: 'saree-draping',
        description: 'Need help with traditional saree draping for wedding function.',
        budget: 300,
        budgetType: 'fixed',
        location: 'Mylapore, Chennai',
        distance: 2.1,
        postedBy: 'Lakshmi Priya',
        postedByRating: 4.8,
        timeAgo: '30 minutes ago',
        applicants: 2,
        isUrgent: false
      }
    ],
    applied: [
      {
        id: '4',
        title: 'Kolam Drawing Classes',
        category: 'kolam',
        description: 'Teaching kolam to children during summer vacation.',
        budget: 150,
        budgetType: 'hourly',
        location: 'Velachery, Chennai',
        distance: 3.2,
        postedBy: 'Radha Krishnan',
        postedByRating: 4.6,
        timeAgo: '1 day ago',
        status: 'pending',
        appliedAt: '2 hours ago'
      }
    ],
    ongoing: [],
    completed: []
  };

  const tabs = [
    { id: 'available', en: 'Available', ta: 'கிடைக்கிறது', count: mockJobs.available.length },
    { id: 'applied', en: 'Applied', ta: 'விண்ணப்பித்தது', count: mockJobs.applied.length },
    { id: 'ongoing', en: 'Ongoing', ta: 'நடந்து கொண்டிருக்கிறது', count: mockJobs.ongoing.length },
    { id: 'completed', en: 'Completed', ta: 'முடிந்தது', count: mockJobs.completed.length }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch latest jobs from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJobPress = (job) => {
    router.push(`/job/${job.id}`);
  };

  const renderJobCard = (job) => {
    const isApplied = selectedTab === 'applied';
    
    return (
      <TouchableOpacity
        key={job.id}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3
        }}
        onPress={() => handleJobPress(job)}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', flex: 1 }}>
                {job.title}
              </Text>
              {job.isUrgent && (
                <View style={{
                  backgroundColor: '#FEF2F2',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#FECACA'
                }}>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: '#DC2626' }}>
                    {isEnglish ? 'URGENT' : 'அவசரம்'}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <User color="#64748B" size={14} />
              <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4 }}>
                {job.postedBy}
              </Text>
              <Star color="#F59E0B" size={12} style={{ marginLeft: 8 }} />
              <Text style={{ fontSize: 12, color: '#64748B', marginLeft: 2 }}>
                {job.postedByRating}
              </Text>
            </View>
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <IndianRupee color="#10B981" size={16} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#10B981' }}>
                {job.budget}
              </Text>
              <Text style={{ fontSize: 12, color: '#64748B', marginLeft: 2 }}>
                {job.budgetType === 'hourly' ? (isEnglish ? '/hr' : '/மணி') : ''}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#64748B' }}>
              {job.budgetType === 'fixed' ? (isEnglish ? 'Fixed' : 'நிலையான') : (isEnglish ? 'Per Hour' : 'மணிக்கு')}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 12 }}>
          {job.description}
        </Text>

        {/* Location and Distance */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <MapPin color="#64748B" size={14} />
          <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4, flex: 1 }}>
            {job.location}
          </Text>
          <Text style={{ fontSize: 12, color: '#64748B' }}>
            {job.distance} km {isEnglish ? 'away' : 'தூரம்'}
          </Text>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock color="#64748B" size={14} />
            <Text style={{ fontSize: 12, color: '#64748B', marginLeft: 4 }}>
              {isApplied ? `${isEnglish ? 'Applied' : 'விண்ணப்பித்தது'} ${job.appliedAt}` : job.timeAgo}
            </Text>
          </View>
          
          {!isApplied && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Briefcase color="#64748B" size={14} />
              <Text style={{ fontSize: 12, color: '#64748B', marginLeft: 4 }}>
                {job.applicants} {isEnglish ? 'applicants' : 'விண்ணப்பதாரர்கள்'}
              </Text>
            </View>
          )}
          
          {isApplied && (
            <View style={{
              backgroundColor: job.status === 'pending' ? '#FEF3C7' : '#F0FDF4',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: job.status === 'pending' ? '#D97706' : '#059669'
              }}>
                {job.status === 'pending' 
                  ? (isEnglish ? 'Pending' : 'நிலுவையில்')
                  : (isEnglish ? 'Accepted' : 'ஏற்றுக்கொள்ளப்பட்டது')
                }
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const currentJobs = mockJobs[selectedTab] || [];

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
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 }}>
          {isEnglish ? 'Jobs' : 'வேலைகள்'}
        </Text>
        <Text style={{ fontSize: 14, color: '#64748B' }}>
          {isEnglish ? 'Find work opportunities near you' : 'உங்களுக்கு அருகில் வேலை வாய்ப்புகளைக் கண்டறியுங்கள்'}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={{
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0'
      }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          style={{ flexGrow: 0 }}
        >
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedTab === tab.id ? '#EFF6FF' : 'transparent',
                  borderWidth: 1,
                  borderColor: selectedTab === tab.id ? '#3B82F6' : '#E2E8F0',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: selectedTab === tab.id ? '#3B82F6' : '#64748B'
                }}>
                  {isEnglish ? tab.en : tab.ta}
                </Text>
                {tab.count > 0 && (
                  <View style={{
                    backgroundColor: selectedTab === tab.id ? '#3B82F6' : '#94A3B8',
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#FFFFFF'
                    }}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Jobs List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {currentJobs.length > 0 ? (
          currentJobs.map(renderJobCard)
        ) : (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60
          }}>
            <Briefcase color="#94A3B8" size={48} />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#374151',
              marginTop: 16,
              marginBottom: 8
            }}>
              {isEnglish ? 'No jobs found' : 'வேலைகள் எதுவும் கிடைக்கவில்லை'}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#64748B',
              textAlign: 'center',
              lineHeight: 20
            }}>
              {selectedTab === 'available' 
                ? (isEnglish ? 'Check back later for new opportunities' : 'புதிய வாய்ப்புகளுக்கு பின்னர் சரிபார்க்கவும்')
                : (isEnglish ? `No ${selectedTab} jobs at the moment` : `தற்போது ${selectedTab} வேலைகள் எதுவும் இல்லை`)
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}