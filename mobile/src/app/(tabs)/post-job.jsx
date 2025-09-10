import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  FileText,
  Plus,
  Minus,
} from "lucide-react-native";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import * as Location from "expo-location";

export default function PostJobScreen() {
  const insets = useSafeAreaInsets();
  const { language = "en" } = useLocalSearchParams();
  const isEnglish = language === "en";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    budgetType: "fixed", // 'fixed' or 'hourly'
    location: "",
    isUrgent: false,
  });

  // Tamil Nadu specific job categories
  const jobCategories = [
    { id: "tutoring", en: "Tutoring", ta: "கற்பித்தல்" },
    { id: "cooking", en: "Cooking & Catering", ta: "சமையல் மற்றும் உணவு சேவை" },
    { id: "cleaning", en: "House Cleaning", ta: "வீட்டு சுத்தம்" },
    { id: "delivery", en: "Delivery Services", ta: "டெலிவரி சேவைகள்" },
    { id: "gardening", en: "Gardening", ta: "தோட்டக்கலை" },
    { id: "repairs", en: "Home Repairs", ta: "வீட்டு பழுதுபார்ப்பு" },
    {
      id: "tailoring",
      en: "Blouse Design & Tailoring",
      ta: "ரவிக்கை வடிவமைப்பு மற்றும் தையல்",
    },
    { id: "saree-draping", en: "Saree Draping", ta: "புடவை அணிதல்" },
    { id: "kolam", en: "Kolam Drawing", ta: "கோலம் வரைதல்" },
    { id: "biryani", en: "Biryani Specialist", ta: "பிரியாணி நிபுணர்" },
    { id: "mehendi", en: "Mehendi Artist", ta: "மெஹந்தி கலைஞர்" },
    { id: "photography", en: "Photography", ta: "புகைப்படம்" },
    { id: "decoration", en: "Event Decoration", ta: "விழா அலங்காரம்" },
    { id: "massage", en: "Massage Therapy", ta: "மசாஜ் சிகிச்சை" },
    { id: "babysitting", en: "Baby Sitting", ta: "குழந்தை பராமரிப்பு" },
    { id: "elderly-care", en: "Elderly Care", ta: "முதியோர் பராமரிப்பு" },
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const adjustBudget = (increment) => {
    const currentBudget = parseInt(formData.budget) || 0;
    const step = formData.budgetType === "hourly" ? 50 : 100;
    const newBudget = Math.max(0, currentBudget + (increment ? step : -step));
    updateFormData("budget", newBudget.toString());
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert(
        isEnglish ? "Title Required" : "தலைப்பு தேவை",
        isEnglish
          ? "Please enter a job title"
          : "தயவுசெய்து வேலை தலைப்பை உள்ளிடவும்",
      );
      return false;
    }

    if (!formData.category) {
      Alert.alert(
        isEnglish ? "Category Required" : "வகை தேவை",
        isEnglish
          ? "Please select a job category"
          : "தயவுசெய்து வேலை வகையைத் தேர்ந்தெடுக்கவும்",
      );
      return false;
    }

    if (!formData.description.trim()) {
      Alert.alert(
        isEnglish ? "Description Required" : "விளக்கம் தேவை",
        isEnglish
          ? "Please provide a job description"
          : "தயவுசெய்து வேலை விளக்கத்தை வழங்கவும்",
      );
      return false;
    }

    if (!formData.budget || parseInt(formData.budget) <= 0) {
      Alert.alert(
        isEnglish ? "Budget Required" : "பட்ஜெட் தேவை",
        isEnglish
          ? "Please set a valid budget amount"
          : "தயவுசெய்து சரியான பட்ஜெட் தொகையை அமைக்கவும்",
      );
      return false;
    }

    if (!formData.location.trim()) {
      Alert.alert(
        isEnglish ? "Location Required" : "இடம் தேவை",
        isEnglish
          ? "Please enter the job location"
          : "தயவுசெய்து வேலை இடத்தை உள்ளிடவும்",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Get user location for better job discovery
      let userLocation = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const currentLocation = await Location.getCurrentPositionAsync({});
          userLocation = currentLocation.coords;
        }
      } catch (locationError) {
        console.log("Could not get location:", locationError);
      }

      const jobData = {
        hirerId: 1, // TODO: Get from user context/auth
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        budget: parseInt(formData.budget),
        budgetType: formData.budgetType,
        location: formData.location.trim(),
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        isUrgent: formData.isUrgent,
      };

      console.log("Posting job:", jobData);

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post job");
      }

      const result = await response.json();
      console.log("Job posted successfully:", result);

      Alert.alert(
        isEnglish ? "Job Posted!" : "வேலை இடப்பட்டது!",
        isEnglish
          ? "Your job has been posted successfully. You will receive applications soon."
          : "உங்கள் வேலை வெற்றிகரமாக இடப்பட்டது. விரைவில் விண்ணப்பங்கள் வரும்.",
        [
          {
            text: isEnglish ? "View Jobs" : "வேலைகளைப் பார்க்கவும்",
            onPress: () => {
              // Reset form
              setFormData({
                title: "",
                category: "",
                description: "",
                budget: "",
                budgetType: "fixed",
                location: "",
                isUrgent: false,
              });
              // Navigate to jobs list
              router.push("/(tabs)/jobs");
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error posting job:", error);
      Alert.alert(
        isEnglish ? "Error" : "தவறு",
        isEnglish
          ? `Failed to post job: ${error.message}`
          : `வேலை இடுவதில் தோல்வி: ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
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
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#1E293B",
              marginBottom: 8,
            }}
          >
            {isEnglish ? "Post a Job" : "வேலை இடுங்கள்"}
          </Text>
          <Text style={{ fontSize: 14, color: "#64748B" }}>
            {isEnglish
              ? "Find skilled workers for your tasks"
              : "உங்கள் பணிகளுக்கு திறமையான தொழிலாளர்களைக் கண்டறியுங்கள்"}
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Job Title */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 12,
              }}
            >
              {isEnglish ? "Job Title" : "வேலை தலைப்பு"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#E2E8F0",
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 16,
              }}
            >
              <Briefcase color="#94A3B8" size={20} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  paddingVertical: 16,
                  marginLeft: 12,
                  color: "#1E293B",
                }}
                placeholder={
                  isEnglish
                    ? "e.g., House Cleaning Needed"
                    : "உதா., வீட்டு சுத்தம் தேவை"
                }
                placeholderTextColor="#94A3B8"
                value={formData.title}
                onChangeText={(value) => updateFormData("title", value)}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 12,
              }}
            >
              {isEnglish ? "Category" : "வகை"}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {jobCategories.map((category) => {
                const isSelected = formData.category === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: isSelected ? "#3B82F6" : "#E2E8F0",
                      backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                    }}
                    onPress={() => updateFormData("category", category.id)}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: isSelected ? "#3B82F6" : "#64748B",
                      }}
                    >
                      {isEnglish ? category.en : category.ta}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 12,
              }}
            >
              {isEnglish ? "Description" : "விளக்கம்"}
            </Text>
            <View
              style={{
                borderWidth: 2,
                borderColor: "#E2E8F0",
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                  color: "#1E293B",
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
                placeholder={
                  isEnglish
                    ? "Describe what you need help with..."
                    : "உங்களுக்கு என்ன உதவி தேவை என்பதை விவரிக்கவும்..."
                }
                placeholderTextColor="#94A3B8"
                value={formData.description}
                onChangeText={(value) => updateFormData("description", value)}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Budget */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 12,
              }}
            >
              {isEnglish ? "Budget" : "பட்ஜெட்"}
            </Text>

            {/* Budget Type Toggle */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 16,
                backgroundColor: "#F1F5F9",
                borderRadius: 12,
                padding: 4,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor:
                    formData.budgetType === "fixed" ? "#FFFFFF" : "transparent",
                  alignItems: "center",
                }}
                onPress={() => updateFormData("budgetType", "fixed")}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color:
                      formData.budgetType === "fixed" ? "#3B82F6" : "#64748B",
                  }}
                >
                  {isEnglish ? "Fixed Price" : "நிலையான விலை"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor:
                    formData.budgetType === "hourly"
                      ? "#FFFFFF"
                      : "transparent",
                  alignItems: "center",
                }}
                onPress={() => updateFormData("budgetType", "hourly")}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color:
                      formData.budgetType === "hourly" ? "#3B82F6" : "#64748B",
                  }}
                >
                  {isEnglish ? "Per Hour" : "மணிக்கு"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Budget Amount */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#E2E8F0",
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 16,
                  borderRightWidth: 1,
                  borderRightColor: "#E2E8F0",
                }}
                onPress={() => adjustBudget(false)}
              >
                <Minus color="#64748B" size={20} />
              </TouchableOpacity>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                }}
              >
                <IndianRupee color="#10B981" size={20} />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1E293B",
                    marginLeft: 8,
                    textAlign: "center",
                  }}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  value={formData.budget}
                  onChangeText={(value) =>
                    updateFormData("budget", value.replace(/[^0-9]/g, ""))
                  }
                  keyboardType="numeric"
                />
                <Text style={{ fontSize: 14, color: "#64748B" }}>
                  {formData.budgetType === "hourly"
                    ? isEnglish
                      ? "/hour"
                      : "/மணி"
                    : ""}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  padding: 16,
                  borderLeftWidth: 1,
                  borderLeftColor: "#E2E8F0",
                }}
                onPress={() => adjustBudget(true)}
              >
                <Plus color="#64748B" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 12,
              }}
            >
              {isEnglish ? "Location" : "இடம்"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#E2E8F0",
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 16,
              }}
            >
              <MapPin color="#94A3B8" size={20} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  paddingVertical: 16,
                  marginLeft: 12,
                  color: "#1E293B",
                }}
                placeholder={
                  isEnglish ? "e.g., T. Nagar, Chennai" : "உதா., டி. நகர், சென்னை"
                }
                placeholderTextColor="#94A3B8"
                value={formData.location}
                onChangeText={(value) => updateFormData("location", value)}
              />
            </View>
          </View>

          {/* Urgent Toggle */}
          <View style={{ marginBottom: 32 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: formData.isUrgent ? "#DC2626" : "#E2E8F0",
                backgroundColor: formData.isUrgent ? "#FEF2F2" : "#FFFFFF",
              }}
              onPress={() => updateFormData("isUrgent", !formData.isUrgent)}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: formData.isUrgent ? "#FECACA" : "#F1F5F9",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Clock
                  color={formData.isUrgent ? "#DC2626" : "#64748B"}
                  size={20}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1E293B",
                    marginBottom: 4,
                  }}
                >
                  {isEnglish ? "Mark as Urgent" : "அவசரம் என குறிக்கவும்"}
                </Text>
                <Text style={{ fontSize: 14, color: "#64748B" }}>
                  {isEnglish
                    ? "Get faster responses from workers"
                    : "தொழிலாளர்களிடமிருந்து வேகமான பதில்களைப் பெறுங்கள்"}
                </Text>
              </View>

              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: formData.isUrgent ? "#DC2626" : "#CBD5E1",
                  backgroundColor: formData.isUrgent
                    ? "#DC2626"
                    : "transparent",
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#3B82F6",
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: insets.bottom + 20,
            }}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              {loading
                ? isEnglish
                  ? "Posting Job..."
                  : "வேலை இடுகிறது..."
                : isEnglish
                  ? "Post Job"
                  : "வேலை இடுங்கள்"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
