import Head from "expo-router/head";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Usar tema Material https://callstack.github.io/react-native-paper/docs/guides/theming#using-schemes
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Appbar ,
  BottomNavigation
} from 'react-native-paper';
import lightheme from '../assets/light-theme.json'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./home";
import VistaFamiliar from "./vista-familiar";
import Perfil from "./perfil";

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const theme = {
  ...DefaultTheme,
  colors: lightheme.colors,
};

export default function Layout() {
  
  //  return (   
  //    <PaperProvider theme={theme}>
  //      <SafeAreaProvider>
  //        <Head>
  //          <title>Expo Router Layouts Demo</title>
  //          <meta name="description" content="Expo Router Layouts Demo" />
  //        </Head>
  //        <Stack>
  //          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  //          <Stack.Screen
  //              name="vista-familiar"
  //              options={{ headerShown: false }}
  //          />
  //        </Stack>
  //      </SafeAreaProvider>
  //    </PaperProvider>
  //  );
  const Stack = createNativeStackNavigator();

   return (   
    <PaperProvider theme={theme} >
      <SafeAreaProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Familiar" component={VistaFamiliar} />
          <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}