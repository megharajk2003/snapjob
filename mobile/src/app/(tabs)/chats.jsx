import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MessageCircle, Clock, User } from 'lucide-react-native';

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const { language = 'en' } = useLocalSearchParams();
  const isEnglish = language === 'en';
  
  const [refreshing, setRefreshing] = useState(false);

  // Mock chat data
  const mockChats = [
    {
      id: '1',
      name: 'Priya Sharma',
      lastMessage: 'I can start the cleaning work tomorrow morning at 9 AM',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      profileImage: null,
      jobTitle: 'House Cleaning',
      isOnline: true
    },
    {
      id: '2',
      name: 'Ravi Kumar',
      lastMessage: 'Thank you for hiring me. The repair work is completed.',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      profileImage: null,
      jobTitle: 'Home Repairs',
      isOnline: false
    }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch latest chats from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleChatPress = (chat) => {
    router.push(`/chat/${chat.id}`);
  };

  const renderChatItem = (chat) => {
    return (
      <TouchableOpacity
        key={chat.id}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3
        }}
        onPress={() => handleChatPress(chat)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Profile Image */}
          <View style={{ position: 'relative', marginRight: 12 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {chat.profileImage ? (
                <Image
                  source={{ uri: chat.profileImage }}
                  style={{ width: '100%', height: '100%', borderRadius: 24 }}
                  contentFit="cover"
                />
              ) : (
                <User color="#3B82F6" size={24} />
              )}
            </View>
            
            {/* Online indicator */}
            {chat.isOnline && (
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: '#10B981',
                borderWidth: 2,
                borderColor: '#FFFFFF'
              }} />
            )}
          </View>

          {/* Chat Content */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B' }}>
                {chat.name}
              </Text>
              <Text style={{ fontSize: 12, color: '#64748B' }}>
                {chat.lastMessageTime}
              </Text>
            </View>
            
            <Text style={{ fontSize: 12, color: '#3B82F6', marginBottom: 4 }}>
              {chat.jobTitle}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{
                fontSize: 14,
                color: '#64748B',
                flex: 1,
                marginRight: 8
              }} numberOfLines={1}>
                {chat.lastMessage}
              </Text>
              
              {chat.unreadCount > 0 && (
                <View style={{
                  backgroundColor: '#EF4444',
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 6
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#FFFFFF'
                  }}>
                    {chat.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          {isEnglish ? 'Chats' : 'அரட்டைகள்'}
        </Text>
        <Text style={{ fontSize: 14, color: '#64748B' }}>
          {isEnglish ? 'Communicate with your clients and workers' : 'உங்கள் வாடிக்கையாளர்கள் மற்றும் தொழிலாளர்களுடன் தொடர்பு கொள்ளுங்கள்'}
        </Text>
      </View>

      {/* Chats List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {mockChats.length > 0 ? (
          mockChats.map(renderChatItem)
        ) : (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60
          }}>
            <MessageCircle color="#94A3B8" size={48} />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#374151',
              marginTop: 16,
              marginBottom: 8
            }}>
              {isEnglish ? 'No conversations yet' : 'இன்னும் உரையாடல்கள் இல்லை'}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#64748B',
              textAlign: 'center',
              lineHeight: 20
            }}>
              {isEnglish 
                ? 'Start applying for jobs or posting jobs to begin conversations'
                : 'உரையாடல்களைத் தொடங்க வேலைகளுக்கு விண்ணப்பிக்கவும் அல்லது வேலைகளை இடவும்'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}