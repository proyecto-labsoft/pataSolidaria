import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";  
// Usar tema Material https://callstack.github.io/react-native-paper/docs/guides/theming#using-schemes
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import lightheme from '../assets/light-theme.json'
import QueryClientProviderBase from "./api/QueryClientProviderBase";
import { AuthProvider } from "./contexts/AuthContext";
import AuthNavigator from "./navegacion/AuthNavigator";

// Manejador global para promesas rechazadas (como errores de red de Firebase)
if (typeof global !== 'undefined') {
  const originalHandler = global.Promise;
  global.Promise = class extends originalHandler {
    constructor(executor: any) {
      super((resolve, reject) => {
        return executor(
          resolve,
          (error: any) => {
            // Log silencioso de errores de red de Firebase
            if (error?.code === 'auth/network-request-failed') {
              console.warn('Firebase network error (expected on unstable connections):', error.message);
            }
            reject(error);
          }
        );
      });
    }
  } as any;
}

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
  return (   
    <PaperProvider theme={theme} >
      <AuthProvider>
        <QueryClientProviderBase>
          <SafeAreaProvider>
            <AuthNavigator />
          </SafeAreaProvider>
        </QueryClientProviderBase>
      </AuthProvider>
    </PaperProvider>
  );
}