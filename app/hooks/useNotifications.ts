import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  getSavedPushToken,
  sendPushTokenToBackend
} from '../services/notificationService';
import { getCurrentUserToken } from '../services/authService';

export interface NotificationData {
  title?: string;
  body?: string;
  data?: any;
}

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Registrar para notificaciones push
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      
      // Enviar token al backend si el usuario está autenticado
      if (token) {
        getCurrentUserToken().then(userToken => {
          if (userToken) {
            const API_URL = 'http://localhost:8080/api'; // TODO: Mover a config
            sendPushTokenToBackend(token, userToken, API_URL);
          }
        });
      }
    });

    // Listener para cuando se recibe una notificación (app en primer plano)
    notificationListener.current = addNotificationReceivedListener(notification => {
      setNotification({
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data
      });
    });

    // Listener para cuando el usuario toca una notificación
    responseListener.current = addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
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
    
    // Ejemplo: navegar según el tipo de notificación
    // if (data.type === 'nueva_adopcion') {
    //   router.push(`/adopciones/${data.id}`);
    // } else if (data.type === 'avistamiento') {
    //   router.push(`/extravios/${data.extravioId}`);
    // }
  };

  return {
    expoPushToken,
    notification,
  };
}
