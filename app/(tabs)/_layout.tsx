
import { MaterialBottomTabs } from "@/layouts/material-bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "react-native/Libraries/NewAppScreen";
import { Tabs } from 'expo-router';


export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="casos"
        options={{
          title: 'Casos',
          tabBarIcon: ({ color }) => <MaterialIcons name="crisis-alert" size={24} color={"#006064"} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Familia',
          tabBarIcon: ({ color }) => <MaterialIcons name="pets" size={24} color={"#006064"} />,
        }}
      />
      <Tabs.Screen
        name="adopciones"
        options={{
          title: 'Adopciones',
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={24} color={"#006064"} />,
        }}
      />
    </Tabs>
    // <MaterialBottomTabs
    //   safeAreaInsets={{ bottom: 0 }}
    //   screenOptions={
    //     {
          
    //       // API Reference: https://reactnavigation.org/docs/material-bottom-tab-navigator#options
    //     }
    //   }
    // >
    //   <MaterialBottomTabs.Screen
    //     name="casos"
    //     options={{
    //       tabBarLabel: "Casos",
    //       tabBarIcon(props) {
    //         return (
    //           <MaterialIcons name="crisis-alert" size={24} color={"#006064"} />
    //         );
    //       },
    //     }}
    //   />
    //   <MaterialBottomTabs.Screen
    //     name="index"
    //     options={{
    //       tabBarLabel: "Familia",
    //       tabBarIcon(props) {
    //         return (
    //           <MaterialIcons name="pets" size={24} color={"#006064"} />
    //         );
    //       },
    //     }}
    //   />
    //   <MaterialBottomTabs.Screen
    //     name="adopciones"
    //     options={{
    //       tabBarLabel: "Adopciones",
    //       tabBarIcon(props) {
    //         return (
    //           <MaterialIcons name="favorite" size={24} color={"#006064"} />
    //         );
    //       },
    //     }}
    //   />
    // </MaterialBottomTabs>
  );
}
