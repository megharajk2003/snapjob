import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Switch,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useLanguage } from '../../context/LanguageContext';
import * as Location from 'expo-location';

const ProviderHomeScreen = () => {
  const { t } = useLanguage();
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearbyJobs, setNearbyJobs] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLocation();
    fetchNearbyJobs();
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

  const fetchNearbyJobs = () => {
    // Mock data - in real app, fetch from API
    const mockJobs = [
      {
        id: '1',
        title: 'Urgent Aari Work for Wedding Blouse',
        description: 'Need intricate Aari embroidery work completed for a silk blouse within 3 days.',
        budget: 2500,
        paymentType: 'fixed',
        distance: '1.2 km',
        postedAt: '2 hours ago',
        isUrgent: true,
        location: {
          latitude: 13.0827 + 0.01,
          longitude: 80.2707 + 0.01
        }
      },
      {
        id: '2',
        title: 'Home Cooking for Dinner Party',
        description: 'Need a cook for authentic Tamil dinner for 8 people.',
        budget: 200,
        paymentType: 'hourly',
        distance: '2.5 km',
        postedAt: '1 hour ago',
        isUrgent: false,
        location: {
          latitude: 13.0827 - 0.01,
          longitude: 80.2707 - 0.01
        }
      },
      {
        id: '3',
        title: 'Mehendi Design for Wedding',
        description: 'Bridal mehendi for wedding ceremony.',
        budget: 1500,
        paymentType: 'fixed',
        distance: '3.8 km',
        postedAt: '30 minutes ago',
        isUrgent: true,
        location: {
          latitude: 13.0827 + 0.02,
          longitude: 80.2707 - 0.015
        }
      }
    ];
    setNearbyJobs(mockJobs);
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // In real app, update backend
  };

  const applyForJob = (jobId) => {
    Alert.alert('Application Sent', 'Your application has been sent to the hirer');
    // In real app, send application to backend
  };

  const renderJobCard = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          {item.isUrgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        <Text style={styles.jobDistance}>{item.distance}</Text>
      </View>
      
      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.jobFooter}>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>
            {item.paymentType === 'fixed' ? 'Total' : 'Per Hour'}:
          </Text>
          <Text style={styles.budgetAmount}>₹{item.budget}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => applyForJob(item.id)}
        >
          <Text style={styles.applyButtonText}>{t('apply')}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.postedTime}>{item.postedAt}</Text>
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
            <Text style={styles.userName}>Kavitha</Text>
          </View>
          
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityLabel}>
              {isAvailable ? t('availableForWork') : 'Offline'}
            </Text>
            <Switch
              value={isAvailable}
              onValueChange={toggleAvailability}
              trackColor={{ false: '#E2E8F0', true: '#66BB6A' }}
              thumbColor={isAvailable ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>
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
          
          {nearbyJobs.map((job) => (
            <Marker
              key={job.id}
              coordinate={job.location}
              title={job.title}
              description={`₹${job.budget} • ${job.distance}`}
              pinColor={job.isUrgent ? "#FF6B6B" : "#4ECDC4"}
            />
          ))}
        </MapView>
      </View>

      {/* Jobs List */}
      <View style={styles.jobsContainer}>
        <View style={styles.jobsHeader}>
          <Text style={styles.jobsTitle}>Nearby Jobs</Text>
          <Text style={styles.jobsCount}>{nearbyJobs.length} available</Text>
        </View>
        
        <FlatList
          data={nearbyJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsList}
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
  availabilityContainer: {
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 12,
    color: '#E8F5E8',
    marginBottom: 4,
  },
  mapContainer: {
    height: 200,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  jobsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  jobsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  jobsCount: {
    fontSize: 14,
    color: '#64748B',
  },
  jobsList: {
    paddingBottom: 20,
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
    marginBottom: 8,
  },
  jobTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  urgentText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  jobDistance: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 4,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  applyButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  postedTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
});

export default ProviderHomeScreen;