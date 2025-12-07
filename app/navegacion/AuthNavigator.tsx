import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Pantallas de autenticación
import LoginScreen from '../pantallas/login';
import RegisterScreen from '../pantallas/register';

// Pantallas protegidas (app principal)
import Home from "../pantallas/home";
import VistaFamiliar from "../pantallas/vistaFamiliar";
import ConfirmarBuscado from "../pantallas/confirmar-buscado";
import Notificaciones from "../pantallas/notificaciones";
import Perfil from "../pantallas/perfil";
import FAQ from "../pantallas/faq";
import VistaExtravio from "../pantallas/vistaExtravio";
import NuevoAvistamiento from "../pantallas/nuevoAvistamiento";
import NuevoExtraviado from "../pantallas/nuevoExtraviado";
import NuevoBuscado from "../pantallas/nuevoBuscado";
import NuevoFamiliar from "../pantallas/nuevoFamiliar";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const { user, loading } = useAuth();
  const navigationRef = useNavigationContainerRef();
  
  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} independent={true}>
      <Stack.Navigator 
        screenOptions={{ 
          contentStyle: { backgroundColor: 'transparent' },
          headerShown: false 
        }}
      >
        {user ? (
          // Usuario autenticado - Stack de la app principal
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Familiar" component={VistaFamiliar} />
            <Stack.Screen name="NuevoBuscado" component={NuevoBuscado} />
            <Stack.Screen name="NuevoExtraviado" component={NuevoExtraviado} />
            <Stack.Screen name="Perfil" component={Perfil} />
            <Stack.Screen name="Notificaciones" component={Notificaciones} />
            <Stack.Screen name="ConfirmarBuscado" component={ConfirmarBuscado} />
            <Stack.Screen name="Faq" component={FAQ} />
            <Stack.Screen name="VistaExtravio" component={VistaExtravio} />
            <Stack.Screen name="NuevoAvistamiento" component={NuevoAvistamiento} />
            <Stack.Screen name="NuevoFamiliar" component={NuevoFamiliar} />
          </>
        ) : (
          // Usuario NO autenticado - Solo Login y Registro
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
