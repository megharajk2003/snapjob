import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import * as Location from 'expo-location';

const HirerDashboardScreen = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [location, setLocation] = useState(null);
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLocation();
    fetchNearbyProviders();
    fetchMyJobs();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      
      setLocation({ latitude, longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchNearbyProviders = () => {
    // Mock data - in real app, fetch from API
    const mockProviders = [
      {
        id: '1',
        name: 'Kavitha R.',
        primarySkill: 'Aari Embroidery Blouse Work',
        rating: 4.8,
        completedJobs: 25,
        isVerified: true,
        distance: '0.8 km',
        isAvailable: true,
        location: {
          latitude: 13.0827 + 0.005,
          longitude: 80.2707 + 0.005
        }
      },
      {
        id: '2',
        name: 'Priya S.',
        primarySkill: 'Cooking',
        rating: 4.6,
        completedJobs: 42,
        isVerified: true,
        distance: '1.2 km',
        isAvailable: true,
        location: {
          latitude: 13.0827 - 0.008,
          longitude: 80.2707 + 0.008
        }
      },
      {
        id: '3',
        name: 'Meera K.',
        primarySkill: 'Mehendi Design',
        rating: 4.9,
        completedJobs: 18,
        isVerified: false,
        distance: '2.1 km',
        isAvailable: true,
        location: {
          latitude: 13.0827 + 0.012,
          longitude: 80.2707 - 0.006
        }
      }
    ];
    setNearbyProviders(mockProviders);
  };

  const fetchMyJobs = () => {
    // Mock data - in real app, fetch from API
    const mockJobs = [
      {
        id: '1',
        title: 'Urgent Aari Work for Wedding Blouse',
        status: 'open',
        applications: 3,
        budget: 2500,
        postedAt: '2 hours ago'
      },
      {
        id: '2',
        title: 'Home Cleaning Service',
        status: 'in_progress',
        assignedTo: 'Priya S.',
        budget: 800,
        postedAt: '1 day ago'
      }
    ];
    setMyJobs(mockJobs);
  };

  const handlePostJob = () => {
    router.push('/hirer/post-job');
  };

  const renderProviderCard = ({ item }) => (
    <View style={styles.providerCard}>
      <View style={styles.providerHeader}>
        <View style={styles.providerInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.providerName}>{item.name}</Text>
            {item.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            )}
          </View>
          <Text style={styles.providerSkill}>{item.primarySkill}</Text>
        </View>
        <Text style={styles.providerDistance}>{item.distance}</Text>
      </View>
      
      <View style={styles.providerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.rating}★</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.completedJobs}</Text>
          <Text style={styles.statLabel}>Jobs</Text>
        </View>
        <View style={[styles.statusDot, item.isAvailable ? styles.available : styles.offline]} />
      </View>
    </View>
  );

  const renderJobCard = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, styles[`${item.status}Status`]]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.jobFooter}>
        <View>
          <Text style={styles.budgetText}>₹{item.budget}</Text>
          <Text style={styles.postedTime}>{item.postedAt}</Text>
        </View>
        
        <View style={styles.jobActions}>
          {item.status === 'open' && (
            <Text style={styles.applicationsText}>
              {item.applications} applications
            </Text>
          )}
          {item.status === 'in_progress' && (
            <Text style={styles.assignedText}>
              Assigned to: {item.assignedTo}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      
      {/* Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.userName}>Rajesh</Text>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
        >
          {location && (
            <Marker
              coordinate={location}
              title="Your Location"
              pinColor="#2E7D32"
            />
          )}
          
          {nearbyProviders.map((provider) => (
            <Marker
              key={provider.id}
              coordinate={provider.location}
              title={provider.name}
              description={`${provider.primarySkill} • ${provider.rating}★`}
              pinColor={provider.isVerified ? "#4ECDC4" : "#FF9800"}
            />
          ))}
        </MapView>
        
        {/* Post Job FAB */}
        <TouchableOpacity style={styles.fabButton} onPress={handlePostJob}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Content Tabs */}
      <View style={styles.contentContainer}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Nearby Providers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Jobs</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={nearbyProviders}
          renderItem={renderProviderCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#E8F5E8',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 8,
  },
  mapContainer: {
    height: 180,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  fabButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2E7D32',
  },
  listContainer: {
    paddingBottom: 20,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 6,
  },
  providerSkill: {
    fontSize: 14,
    color: '#64748B',
  },
  providerDistance: {
    fontSize: 14,
    color: '#64748B',
  },
  providerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  available: {
    backgroundColor: '#10B981',
  },
  offline: {
    backgroundColor: '#94A3B8',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  openStatus: {
    backgroundColor: '#DBEAFE',
  },
  in_progressStatus: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E293B',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  postedTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  jobActions: {
    alignItems: 'flex-end',
  },
  applicationsText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  assignedText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
});

export default HirerDashboardScreen;