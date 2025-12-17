import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { useTheme, Text as TextPaper, Divider, Card, IconButton, FAB } from "react-native-paper";
import React, { useState, useEffect } from "react";
import AppbarNav from "../componentes/navegacion/appbarNav";
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcularTiempoTranscurrido } from "../utiles/calcularTiempoTranscurrido";
import { useAuth } from "../contexts/AuthContext";

const NOTIFICATIONS_STORAGE_KEY = '@notifications_history';
const MAX_NOTIFICATIONS = 100; // Límite de notificaciones guardadas

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string; // Cambiar a string para facilitar serialización
  data?: any;
  read: boolean;
}

export default function Notificaciones() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Cargar notificaciones previas
    loadNotifications();

    // Listener para nuevas notificaciones
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const newNotification: NotificationItem = {
        id: notification.request.identifier,
        title: notification.request.content.title || 'Notificación',
        body: notification.request.content.body || '',
        date: new Date().toISOString(),
        data: notification.request.content.data,
        read: false,
      };

      // Guardar y actualizar notificaciones
      saveNotification(newNotification);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Cargar notificaciones desde AsyncStorage
  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        const parsed: NotificationItem[] = JSON.parse(stored);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  // Guardar una nueva notificación
  const saveNotification = async (newNotification: NotificationItem) => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      let allNotifications: NotificationItem[] = stored ? JSON.parse(stored) : [];
      
      // Agregar la nueva notificación al inicio
      allNotifications = [newNotification, ...allNotifications];
      
      // Limitar el número de notificaciones guardadas
      if (allNotifications.length > MAX_NOTIFICATIONS) {
        allNotifications = allNotifications.slice(0, MAX_NOTIFICATIONS);
      }
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(allNotifications));
      
      // Actualizar el estado
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error guardando notificación:', error);
    }
  };

  // Actualizar notificaciones en AsyncStorage
  const updateNotifications = async (updatedNotifications: NotificationItem[]) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error actualizando notificaciones:', error);
    }
  };

  const handleNotificationPress = (item: NotificationItem) => {
    // Marcar como leída y actualizar en AsyncStorage
    const updatedNotifications = notifications.map(n => 
      n.id === item.id ? { ...n, read: true } : n
    );
    updateNotifications(updatedNotifications);

    // Navegar según el tipo de notificación
    if (item.data?.type === 'avistamiento' && item.data?.extravioId) {
      navigation.navigate('VistaExtravio' as never, { id: item.data.extravioId } as never);
    } else if (item.data?.type === 'adopcion' && item.data?.adopcionId) {
      // Navegar a adopciones
      navigation.navigate('Home' as never, { screen: 'Adopciones' } as never);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    updateNotifications(updatedNotifications);
  };

  const clearAll = async () => {
    await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    setNotifications([]);
    await Notifications.dismissAllNotificationsAsync();
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Card 
        style={[
          styles.notificationCard,
          { 
            backgroundColor: item.read 
              ? theme.colors.surfaceVariant 
              : theme.colors.primaryContainer 
          }
        ]}
        elevation={item.read ? 0 : 2}
      >
        <Card.Content>
          <View style={styles.notificationHeader}>
            <TextPaper 
              variant="titleMedium" 
              style={{ 
                color: theme.colors.onSurface, 
                fontWeight: item.read ? 'normal' : 'bold',
                flex: 1
              }}
            >
              {item.title}
            </TextPaper>
            {!item.read && (
              <View 
                style={[
                  styles.unreadDot, 
                  { backgroundColor: theme.colors.primary }
                ]} 
              />
            )}
          </View>
          
          <TextPaper 
            variant="bodyMedium" 
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
          >
            {item.body}
          </TextPaper>
          
          <TextPaper 
            variant="bodySmall" 
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
          >
            {calcularTiempoTranscurrido(item.date)}
          </TextPaper>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppbarNav titulo="Notificaciones" tamanioTitulo="headlineSmall" />
      
      {notifications.length > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={markAllAsRead}>
            <TextPaper variant="labelLarge" style={{ color: theme.colors.primary }}>
              Marcar todas como leídas
            </TextPaper>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll}>
            <TextPaper variant="labelLarge" style={{ color: theme.colors.error }}>
              Limpiar todo
            </TextPaper>
          </TouchableOpacity>
        </View>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <IconButton 
            icon="bell-outline" 
            size={80} 
            iconColor={theme.colors.onSurfaceVariant}
          />
          <TextPaper 
            variant="titleLarge" 
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}
          >
            No hay notificaciones
          </TextPaper>
          <TextPaper 
            variant="bodyMedium" 
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
          >
            Cuando recibas notificaciones, aparecerán aquí
          </TextPaper>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* FAB solo visible para administradores */}
      {isAdmin && (
        <FAB
          icon="send"
          color="white"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('AdminNotificaciones' as never)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 25,
    bottom: 25,
    borderRadius: 28,
  },
});