import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

// Pantallas de autenticación
import LoginScreen from '../pantallas/login';
import RegisterScreen from '../pantallas/register';

// Pantallas protegidas (app principal)
import Home from "../pantallas/home";
import VistaFamiliar from "../pantallas/vistaFamiliar";
import ConfirmarBuscado from "../pantallas/confirmar-buscado";
import Notificaciones from "../pantallas/notificaciones";
import AdminNotificaciones from "../pantallas/adminNotificaciones";
import Perfil from "../pantallas/perfil";
import FAQ from "../pantallas/faq";
import VistaExtravio from "../pantallas/vistaExtravio";
import NuevoAvistamiento from "../pantallas/nuevoAvistamiento";
import NuevoExtraviado from "../pantallas/nuevoExtraviado";
import NuevoBuscado from "../pantallas/nuevoBuscado";
import NuevoFamiliar from "../pantallas/nuevoFamiliar";
import NuevaAdopcion from '../pantallas/nuevaAdopcion';
import ConfirmarAdopcion from '../pantallas/confirmarAdopcion';
import VistaAdopcion from '../pantallas/vistaAdopcion';
import NuevaEmergencia from '../pantallas/nuevaEmergencia';
import VistaEmergencia from '../pantallas/vistaEmergencia';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const { user, loading } = useAuth();
  const navigationRef = useNavigationContainerRef();
  const [rol, setRol] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  // Inicializar notificaciones cuando el usuario está autenticado
  const { expoPushToken, notification } = useNotifications();

  useEffect(() => {
    if (expoPushToken) {
      console.log('📱 Push Token registrado:', expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    if (notification) {
      console.log('🔔 Nueva notificación recibida:', notification);
    }
  }, [notification]);

  useEffect(() => {
    const fetchUserClaims = async () => {
      if (user) {
        const tokenResult = await user.getIdTokenResult(true);
        setRol(tokenResult.claims.rol as string);
        setUsuarioId(tokenResult.claims.usuarioId as string);
        console.log('Rol:', tokenResult.claims.rol);
        console.log('UsuarioId:', tokenResult.claims.usuarioId);
      }
    };
    fetchUserClaims();
  }, [user]);

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
            <Stack.Screen name="AdminNotificaciones" component={AdminNotificaciones} />
            <Stack.Screen name="ConfirmarBuscado" component={ConfirmarBuscado} />
            <Stack.Screen name="Faq" component={FAQ} />
            <Stack.Screen name="VistaExtravio" component={VistaExtravio} />
            <Stack.Screen name="NuevoAvistamiento" component={NuevoAvistamiento} />
            <Stack.Screen name="NuevoFamiliar" component={NuevoFamiliar} />
            <Stack.Screen name="NuevaAdopcion" component={NuevaAdopcion} />
            <Stack.Screen name="ConfirmarAdopcion" component={ConfirmarAdopcion} />
            <Stack.Screen name="VistaAdopcion" component={VistaAdopcion} />
            <Stack.Screen name="VistaEmergencia" component={VistaEmergencia} />
            <Stack.Screen name="NuevaEmergencia" component={NuevaEmergencia} />
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
