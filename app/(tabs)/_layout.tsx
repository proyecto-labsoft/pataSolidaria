import { Tabs } from "expo-router";
import { Foundation, FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="casos"
        options={{
          title: "Casos",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="edit" size={24}  />
          ),
        }}
      />
      <Tabs.Screen
        // Esta ruta será la principal porque index es la primer ruta que busca en la carpeta
        name="index"
        options={{
          title: "Familia",
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size={24}  />
          ),
        }}
      />
      <Tabs.Screen
        name="adopciones"
        options={{
          title: "Adopciones",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="edit" size={24}  />
          ),
        }}
      />
    </Tabs>
  );
}
