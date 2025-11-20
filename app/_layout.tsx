import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";  
// Usar tema Material https://callstack.github.io/react-native-paper/docs/guides/theming#using-schemes
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';

import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./pantallas/home";
import VistaFamiliar from "./pantallas/vistaFamiliar";

import lightheme from '../assets/light-theme.json'
import ConfirmarBuscado from "./pantallas/confirmar-buscado";
import Notificaciones from "./pantallas/notificaciones";
import Perfil from "./pantallas/perfil";
import FAQ from "./pantallas/faq";
import VistaExtravio from "./pantallas/vistaExtravio";
import NuevoAvistamiento from "./pantallas/nuevoAvistamiento";
import FondoGradiente from "./fondoGradiente";
import NuevoExtraviado from "./pantallas/nuevoExtraviado";
import NuevoBuscado from "./pantallas/nuevoBuscado";
import NuevoFamiliar from "./pantallas/nuevoFamiliar";
import QueryClientProviderBase from "./api/QueryClientProviderBase";

const generatedColors = {
   primary: '#0776A0',
    onPrimary: '#FFFFFF',
    primaryContainer: '#C3E7FF',
    onPrimaryContainer: '#001E2E',

    secondary: '#FFA400',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#FFE3B2',
    onSecondaryContainer: '#4A2600',

    tertiary: '#FF5900',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD2B2',
    onTertiaryContainer: '#4A2600',

    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    background: '#FAFCFF',
    onBackground: '#191C1E',
    surface: '#FAFCFF',
    onSurface: '#191C1E',
    surfaceVariant: '#DCE4E9',
    onSurfaceVariant: '#41484D',

    outline: '#71787D',
    outlineVariant: '#C3C7C9',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#2E3133',
    inverseOnSurface: '#F0F1F3',
    inversePrimary: '#5CBEFF',
    surfaceDisabled: '#E2E2E2',
    onSurfaceDisabled: '#A6A6A6',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...lightheme.colors,
    ...generatedColors,
  }
};

export default function Layout() {
  const Stack = createNativeStackNavigator();
  
  const navigationRef = useNavigationContainerRef();

  return (   
    <PaperProvider theme={theme} >
      <QueryClientProviderBase>
      <SafeAreaProvider>
        <FondoGradiente>
        <NavigationContainer ref={navigationRef} independent={true}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ contentStyle:{backgroundColor:'transparent'},headerShown: false}} >
            <Stack.Screen name="Home" component={Home} options={{ headerShown:false }} />
            <Stack.Screen name="Familiar" component={VistaFamiliar} options={{ headerShown:false }}/>
            <Stack.Screen name="NuevoBuscado" component={NuevoBuscado} options={{ headerShown:false }} />
            <Stack.Screen name="NuevoExtraviado" component={NuevoExtraviado} options={{ headerShown:false }} />
            <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown:false }} />
            <Stack.Screen name="Notificaciones" component={Notificaciones} options={{ headerShown:false }} />
            <Stack.Screen name="ConfirmarBuscado" component={ConfirmarBuscado} options={{ headerShown:false }} />
            <Stack.Screen name="Faq" component={FAQ} options={{ headerShown:false }} />
            <Stack.Screen name="VistaExtravio" component={VistaExtravio} options={{ headerShown:false }} />
            <Stack.Screen name="NuevoAvistamiento" component={NuevoAvistamiento} options={{ headerShown:false }} />
            <Stack.Screen name="NuevoFamiliar" component={NuevoFamiliar} options={{ headerShown:false }} />
          </Stack.Navigator>
        </NavigationContainer>
        </FondoGradiente>
      </SafeAreaProvider>
      </QueryClientProviderBase>
    </PaperProvider>
  );
}