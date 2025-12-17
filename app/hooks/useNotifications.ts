import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../api/api.rutas';
import { useNavigation } from '@react-navigation/native';
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  getSavedPushToken,
  sendPushTokenToBackend
} from '../services/notificationService';
import { getCurrentUserToken } from '../services/authService';

const NOTIFICATIONS_STORAGE_KEY = '@notifications_history';
const MAX_NOTIFICATIONS = 100;

export interface NotificationData {
  title?: string;
  body?: string;
  data?: any;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  data?: any;
  read: boolean;
}

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  
  // Obtener la referencia de navegación si está disponible
  const navigation = useNavigation();

  // Función para guardar notificación en AsyncStorage
  const saveNotificationToStorage = async (notificationItem: NotificationItem) => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      let allNotifications: NotificationItem[] = stored ? JSON.parse(stored) : [];
      
      // Evitar duplicados
      const exists = allNotifications.some(n => n.id === notificationItem.id);
      if (exists) return;
      
      // Agregar la nueva notificación al inicio
      allNotifications = [notificationItem, ...allNotifications];
      
      // Limitar el número de notificaciones guardadas
      if (allNotifications.length > MAX_NOTIFICATIONS) {
        allNotifications = allNotifications.slice(0, MAX_NOTIFICATIONS);
      }
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(allNotifications));
    } catch (error) {
      console.error('Error guardando notificación en storage:', error);
    }
  };

  useEffect(() => {
    // Registrar para notificaciones push
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      
      // Enviar token al backend si el usuario está autenticado
      if (token) {
        getCurrentUserToken().then(userToken => {
          if (userToken) {
            sendPushTokenToBackend(token, userToken, API_URL);
          }
        });
      }
    });

    // Listener para cuando se recibe una notificación (app en primer plano)
    notificationListener.current = addNotificationReceivedListener(notification => {
      const notificationData = {
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data
      };
      
      setNotification(notificationData);
      
      // Guardar en AsyncStorage
      const notificationItem: NotificationItem = {
        id: notification.request.identifier,
        title: notificationData.title || 'Notificación',
        body: notificationData.body || '',
        date: new Date().toISOString(),
        data: notificationData.data,
        read: false,
      };
      
      saveNotificationToStorage(notificationItem);
    });

    // Listener para cuando el usuario toca una notificación
    responseListener.current = addNotificationResponseReceivedListener(response => {
      const notification = response.notification;
      const data = notification.request.content.data;
      
      // Guardar la notificación si viene de segundo plano/cerrada
      const notificationItem: NotificationItem = {
        id: notification.request.identifier,
        title: notification.request.content.title || 'Notificación',
        body: notification.request.content.body || '',
        date: new Date().toISOString(),
        data: notification.request.content.data,
        read: true, // Ya fue tocada
      };
      
      saveNotificationToStorage(notificationItem);
      
      handleNotificationResponse(data);
    });

    // Obtener token guardado si existe
    getSavedPushToken().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const handleNotificationResponse = (data: any) => {
    // Maneja la navegación basada en el tipo de notificación
    console.log('Notification tapped with data:', data);
    
    try {
      if (data.type === 'avistamiento' && data.extravioId) {
        navigation.navigate('VistaExtravio' as never, { id: data.extravioId } as never);
      } else if (data.type === 'adopcion' && data.adopcionId) {
        navigation.navigate('Home' as never, { screen: 'Adopciones' } as never);
      } else if (data.type === 'extravio_encontrado' && data.extravioId) {
        navigation.navigate('VistaExtravio' as never, { id: data.extravioId } as never);
      } else if (data.type === 'postulacion' && data.postulacionId) {
        // Navegar a postulaciones
        navigation.navigate('Home' as never);
      }
    } catch (error) {
      console.error('Error al navegar desde notificación:', error);
    }
  };

  return {
    expoPushToken,
    notification,
  };
}
