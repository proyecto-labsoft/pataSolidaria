import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar cómo se manejan las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Registra el dispositivo para recibir notificaciones push
 * @returns Token de push notification o null si falla
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token = null;

  if (!Device.isDevice) {
    alert('Las notificaciones push solo funcionan en dispositivos físicos');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No se otorgaron permisos para notificaciones');
      return null;
    }

    // Obtener el token de Expo Push Notification
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? 
                      Constants.easConfig?.projectId;
    
    if (!projectId) {
      console.error('❌ No se encontró projectId en la configuración de Expo');
      alert('Error de configuración: projectId no encontrado');
      return null;
    }
    
    console.log('🔑 Usando projectId:', projectId);
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    // Guardar el token localmente
    await AsyncStorage.setItem('pushToken', token);

    // Configuración adicional para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Error al registrar notificaciones:', error);
    return null;
  }
}

/**
 * Obtiene el token de notificación guardado
 */
export async function getSavedPushToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('pushToken');
  } catch (error) {
    console.error('Error al obtener token guardado:', error);
    return null;
  }
}

/**
 * Programa una notificación local
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: any,
  seconds: number = 0
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: seconds > 0 ? { seconds } : null,
  });
}

/**
 * Cancela todas las notificaciones programadas
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancela una notificación específica
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Maneja notificaciones recibidas cuando la app está en primer plano
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Maneja cuando el usuario toca una notificación
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Obtiene el conteo de notificaciones pendientes
 */
export async function getBadgeCountAsync(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Establece el conteo de notificaciones (badge)
 */
export async function setBadgeCountAsync(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Envía el token de notificación al backend
 */
export async function sendPushTokenToBackend(
  token: string,
  userToken: string,
  apiUrl: string
): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/usuarios/push-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ pushToken: token }),
    });

    if (response.ok) {
      console.log('✅ Push token enviado al backend exitosamente');
      return true;
    } else {
      const errorData = await response.text();
      console.error('❌ Error del backend:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Error al enviar token al backend:', error);
    return false;
  }
}

/**
 * Elimina el token de notificación del backend (cuando el usuario cierra sesión)
 */
export async function removePushTokenFromBackend(
  userToken: string,
  apiUrl: string
): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/usuarios/push-token`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      console.log('✅ Push token eliminado del backend exitosamente');
      return true;
    } else {
      console.error('❌ Error al eliminar push token del backend:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error al eliminar token del backend:', error);
    return false;
  }
}
