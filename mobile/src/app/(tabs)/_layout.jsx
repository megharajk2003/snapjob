import { Tabs } from "expo-router";
import {
  Map,
  List,
  MessageCircle,
  User,
  Plus,
  Briefcase,
} from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";

export default function TabLayout() {
  const { role = "provider", language = "en" } = useLocalSearchParams();
  const isEnglish = language === "en";
  const isProvider = role === "provider";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderColor: "#E5E7EB",
          paddingTop: 4,
          height: 85,
        },
        tabBarActiveTintColor: isProvider ? "#10B981" : "#3B82F6",
        tabBarInactiveTintColor: "#6B6B6B",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: isEnglish ? "Map" : "வரைபடம்",
          tabBarIcon: ({ color, size }) => <Map color={color} size={24} />,
        }}
      />

      {isProvider ? (
        <Tabs.Screen
          name="jobs"
          options={{
            title: isEnglish ? "Jobs" : "வேலைகள்",
            tabBarIcon: ({ color, size }) => (
              <Briefcase color={color} size={24} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="post-job"
          options={{
            title: isEnglish ? "Post Job" : "வேலை இடுங்கள்",
            tabBarIcon: ({ color, size }) => <Plus color={color} size={24} />,
          }}
        />
      )}

      <Tabs.Screen
        name="chats"
        options={{
          title: isEnglish ? "Chats" : "அரட்டைகள்",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: isEnglish ? "Profile" : "சுயவிவரம்",
          tabBarIcon: ({ color, size }) => <User color={color} size={24} />,
        }}
      />

      {/* Hidden dynamic routes */}
      <Tabs.Screen
        name="job/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="chat/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="provider/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
