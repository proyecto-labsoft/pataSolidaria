
import { MaterialBottomTabs } from "@/layouts/material-bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "react-native/Libraries/NewAppScreen";


export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  
  return (
    <MaterialBottomTabs
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={
        {
          // API Reference: https://reactnavigation.org/docs/material-bottom-tab-navigator#options
        }
      }
    >
      <MaterialBottomTabs.Screen
        name="casos"
        options={{
          tabBarLabel: "Casos",
          tabBarIcon(props) {
            return (
              <MaterialIcons name="crisis-alert" size={24} color={"#006064"} />
            );
          },
        }}
      />
      <MaterialBottomTabs.Screen
        name="index"
        options={{
          tabBarLabel: "Familia",
          tabBarIcon(props) {
            return (
              <MaterialIcons name="pets" size={24} color={"#006064"} />
            );
          },
        }}
      />
      <MaterialBottomTabs.Screen
        name="adopciones"
        options={{
          tabBarLabel: "Adopciones",
          tabBarIcon(props) {
            return (
              <MaterialIcons name="favorite" size={24} color={"#006064"} />
            );
          },
        }}
      />
    </MaterialBottomTabs>
  );
}
