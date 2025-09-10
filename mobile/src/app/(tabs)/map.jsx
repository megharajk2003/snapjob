import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  MapPin,
  Filter,
  ToggleLeft,
  ToggleRight,
  User,
  Briefcase,
  Star,
  Clock,
  IndianRupee,
} from "lucide-react-native";

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { userId, role = "provider", language = "en" } = useLocalSearchParams();
  const mapRef = useRef(null);

  const isEnglish = language === "en";
  const isProvider = role === "provider";

  const [location, setLocation] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [nearbyData, setNearbyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const skillCategories = [
    { id: "all", en: "All", ta: "அனைத்தும்" },
    { id: "cooking", en: "Cooking", ta: "சமையல்" },
    { id: "cleaning", en: "Cleaning", ta: "சுத்தம்" },
    { id: "repairs", en: "Repairs", ta: "பழுதுபார்ப்பு" },
    { id: "tutoring", en: "Tutoring", ta: "கற்பித்தல்" },
    { id: "tailoring", en: "Tailoring", ta: "தையல்" },
    { id: "biryani", en: "Biryani", ta: "பிரியாணி" },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyData();
    }
  }, [location, selectedFilter, isProvider]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          isEnglish ? "Location Permission" : "இடம் அனுமதி",
          isEnglish
            ? "Please enable location access to find nearby opportunities"
            : "அருகிலுள்ள வாய்ப்புகளைக் கண்டறிய இடம் அணுகலை இயக்கவும்",
        );
        // Default to Chennai coordinates
        setLocation({ latitude: 13.0827, longitude: 80.2707 });
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setLocation({ latitude, longitude });

      // Animate to user location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      }
    } catch (error) {
      console.error("Location error:", error);
      // Default to Chennai coordinates
      setLocation({ latitude: 13.0827, longitude: 80.2707 });
    }
  };

  const fetchNearbyData = async () => {
    if (!location) return;

    setLoading(true);
    try {
      if (isProvider) {
        await fetchNearbyJobs();
      } else {
        await fetchNearbyProviders();
      }
    } catch (error) {
      console.error("Error fetching nearby data:", error);
      Alert.alert(
        isEnglish ? "Error" : "தவறு",
        isEnglish
          ? "Failed to load nearby data. Please try again."
          : "அருகிலுள்ள தரவை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyJobs = async () => {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      radius: "10", // 10km radius for map view
      limit: "20",
    });

    if (selectedFilter !== "all") {
      params.append("category", selectedFilter);
    }

    const response = await fetch(`/api/jobs?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const result = await response.json();
    const jobsWithCoordinates = result.jobs.filter(
      (job) => job.latitude && job.longitude,
    );
    setNearbyData(jobsWithCoordinates);
  };

  const fetchNearbyProviders = async () => {
    const params = new URLSearchParams({
      role: "provider",
      available: "true",
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      radius: "10",
      limit: "20",
    });

    if (selectedFilter !== "all") {
      params.append("category", selectedFilter);
    }

    const response = await fetch(`/api/users?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch providers");
    }

    const result = await response.json();
    const providersWithCoordinates = result.users.filter(
      (user) => user.latitude && user.longitude,
    );
    setNearbyData(providersWithCoordinates);
  };

  const toggleAvailability = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAvailable: !isAvailable,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update availability");
      }

      setIsAvailable(!isAvailable);
    } catch (error) {
      console.error("Error updating availability:", error);
      Alert.alert(
        isEnglish ? "Error" : "தவறு",
        isEnglish
          ? "Failed to update availability"
          : "கிடைக்கும் நிலையை புதுப்பிக்க முடியவில்லை",
      );
    }
  };

  const handleMarkerPress = (item) => {
    if (isProvider) {
      // Navigate to job details
      router.push(`/job/${item.id}`);
    } else {
      // Navigate to provider profile
      router.push(`/provider/${item.id}`);
    }
  };

  const renderMarker = (item, index) => {
    const isJob = isProvider;
    const coordinate = isJob
      ? { latitude: item.latitude, longitude: item.longitude }
      : { latitude: item.latitude, longitude: item.longitude };

    return (
      <Marker
        key={item.id}
        coordinate={coordinate}
        onPress={() => handleMarkerPress(item)}
      >
        <View
          style={{
            backgroundColor: isJob ? "#3B82F6" : "#10B981",
            padding: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 40,
            minHeight: 40,
          }}
        >
          {isJob ? (
            <Briefcase color="#FFFFFF" size={16} />
          ) : (
            <User color="#FFFFFF" size={16} />
          )}
        </View>
      </Marker>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E2E8F0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#1E293B" }}
            >
              QuickJob
            </Text>
            <Text style={{ fontSize: 14, color: "#64748B" }}>
              {isProvider
                ? isEnglish
                  ? "Find nearby jobs"
                  : "அருகிலுள்ள வேலைகளைக் கண்டறியுங்கள்"
                : isEnglish
                  ? "Find skilled workers"
                  : "திறமையான தொழிலாளர்களைக் கண்டறியுங்கள்"}
            </Text>
          </View>

          {isProvider && userId && (
            <TouchableOpacity
              onPress={toggleAvailability}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isAvailable ? "#F0FDF4" : "#F1F5F9",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: isAvailable ? "#10B981" : "#CBD5E1",
              }}
            >
              {isAvailable ? (
                <ToggleRight color="#10B981" size={20} />
              ) : (
                <ToggleLeft color="#64748B" size={20} />
              )}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: isAvailable ? "#10B981" : "#64748B",
                  marginLeft: 4,
                }}
              >
                {isAvailable
                  ? isEnglish
                    ? "Available"
                    : "கிடைக்கிறது"
                  : isEnglish
                    ? "Offline"
                    : "ஆஃப்லைன்"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Bar */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#E2E8F0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            alignItems: "center",
          }}
        >
          <Filter color="#64748B" size={16} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#374151",
              marginLeft: 8,
              marginRight: 16,
            }}
          >
            {isEnglish ? "Filter:" : "வடிகட்டி:"}
          </Text>

          <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
            {skillCategories.slice(0, 4).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor:
                    selectedFilter === category.id ? "#EFF6FF" : "#F8FAFC",
                  borderWidth: 1,
                  borderColor:
                    selectedFilter === category.id ? "#3B82F6" : "#E2E8F0",
                }}
                onPress={() => setSelectedFilter(category.id)}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color:
                      selectedFilter === category.id ? "#3B82F6" : "#64748B",
                  }}
                >
                  {isEnglish ? category.en : category.ta}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Map */}
      <View style={{ flex: 1 }}>
        {location && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            {nearbyData.map((item, index) => renderMarker(item, index))}
          </MapView>
        )}

        {/* Loading indicator */}
        {loading && (
          <View
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 14, color: "#64748B" }}>
              {isEnglish
                ? "Loading nearby data..."
                : "அருகிலுள்ள தரவை ஏற்றுகிறது..."}
            </Text>
          </View>
        )}

        {/* Floating Info Card */}
        {nearbyData.length > 0 && !loading && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <MapPin color="#3B82F6" size={16} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#374151",
                  marginLeft: 8,
                }}
              >
                {isProvider
                  ? isEnglish
                    ? `${nearbyData.length} jobs nearby`
                    : `${nearbyData.length} அருகிலுள்ள வேலைகள்`
                  : isEnglish
                    ? `${nearbyData.length} workers nearby`
                    : `${nearbyData.length} அருகிலுள்ள தொழிலாளர்கள்`}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: isProvider ? "#3B82F6" : "#10B981",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={() => router.push(isProvider ? "/jobs" : "/post-job")}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}
              >
                {isProvider
                  ? isEnglish
                    ? "View All Jobs"
                    : "அனைத்து வேலைகளையும் பார்க்கவும்"
                  : isEnglish
                    ? "Post a Job"
                    : "வேலை இடுங்கள்"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty state */}
        {nearbyData.length === 0 && !loading && location && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              {isProvider
                ? isEnglish
                  ? "No jobs nearby"
                  : "அருகில் வேலைகள் இல்லை"
                : isEnglish
                  ? "No workers nearby"
                  : "அருகில் தொழிலாளர்கள் இல்லை"}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#64748B",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {isProvider
                ? isEnglish
                  ? "Try expanding your search radius or check back later"
                  : "உங்கள் தேடல் ஆரத்தை விரிவுபடுத்த முயற்சிக்கவும் அல்லது பின்னர் சரிபார்க்கவும்"
                : isEnglish
                  ? "Be the first to post a job in your area"
                  : "உங்கள் பகுதியில் வேலை இடும் முதல் நபராக இருங்கள்"}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: isProvider ? "#3B82F6" : "#10B981",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                minWidth: 120,
              }}
              onPress={() => router.push(isProvider ? "/jobs" : "/post-job")}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}
              >
                {isProvider
                  ? isEnglish
                    ? "Browse All"
                    : "அனைதையும் உலாவு"
                  : isEnglish
                    ? "Post Job"
                    : "வேலை இடு"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
