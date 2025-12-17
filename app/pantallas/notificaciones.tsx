import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { useTheme, Text as TextPaper, Divider, Card, IconButton, FAB } from "react-native-paper";
import React, { useState, useEffect } from "react";
import AppbarNav from "../componentes/navegacion/appbarNav";
import * as Notifications from 'expo-notifications';
import { calcularTiempoTranscurrido } from "../utiles/calcularTiempoTranscurrido";
import { useAuth } from "../contexts/AuthContext";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: Date;
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
        date: new Date(),
        data: notification.request.content.data,
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      // Cargar notificaciones programadas y entregadas
      const delivered = await Notifications.getPresentedNotificationsAsync();
      
      const mappedNotifications: NotificationItem[] = delivered.map(n => ({
        id: n.request.identifier,
        title: n.request.content.title || 'Notificación',
        body: n.request.content.body || '',
        date: n.date ? new Date(n.date) : new Date(),
        data: n.request.content.data,
        read: false,
      }));

      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const handleNotificationPress = (item: NotificationItem) => {
    // Marcar como leída
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
    );

    // Navegar según el tipo de notificación
    if (item.data?.type === 'avistamiento' && item.data?.extravioId) {
      navigation.navigate('VistaExtravio' as never, { id: item.data.extravioId } as never);
    } else if (item.data?.type === 'adopcion' && item.data?.adopcionId) {
      // Navegar a adopciones
      navigation.navigate('Home' as never, { screen: 'Adopciones' } as never);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = async () => {
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
            {calcularTiempoTranscurrido(item.date.toISOString())}
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