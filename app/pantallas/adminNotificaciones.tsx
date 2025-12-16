import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { useTheme, Text as TextPaper, Button, TextInput, SegmentedButtons, Card } from "react-native-paper";
import React, { useState } from "react";
import AppbarNav from "../componentes/navegacion/appbarNav";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from '../api/api.rutas';

export default function AdminNotificaciones() {
  const theme = useTheme();
  const { getToken } = useAuth();
  
  const [tipoNotificacion, setTipoNotificacion] = useState('broadcast');
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [topic, setTopic] = useState('');
  const [userId, setUserId] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviarNotificacion = async () => {
    if (!titulo || !mensaje) {
      Alert.alert('Error', 'Título y mensaje son obligatorios');
      return;
    }

    if (tipoNotificacion === 'topic' && !topic) {
      Alert.alert('Error', 'El topic es obligatorio');
      return;
    }

    if (tipoNotificacion === 'usuario' && !userId) {
      Alert.alert('Error', 'El ID de usuario es obligatorio');
      return;
    }

    try {
      setEnviando(true);
      const token = await getToken();

      let endpoint = '';
      let body: any = {
        title: titulo,
        body: mensaje,
      };

      switch (tipoNotificacion) {
        case 'broadcast':
          endpoint = `${API_URL}/notifications/admin/broadcast`;
          body.type = 'admin_broadcast';
          break;
        case 'topic':
          endpoint = `${API_URL}/notifications/admin/topic`;
          body.topic = topic;
          body.type = 'topic_notification';
          break;
        case 'usuario':
          endpoint = `${API_URL}/notifications/admin/send-to-user`;
          body.userId = userId;
          body.type = 'admin_message';
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          '✅ Notificación enviada',
          tipoNotificacion === 'broadcast' 
            ? `Enviada a ${data.successCount || 0} usuarios` 
            : 'Notificación enviada exitosamente',
          [{ text: 'OK', onPress: limpiarFormulario }]
        );
      } else {
        Alert.alert('❌ Error', data.error || 'Error al enviar notificación');
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      Alert.alert('❌ Error', 'Error de conexión al enviar notificación');
    } finally {
      setEnviando(false);
    }
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setMensaje('');
    setTopic('');
    setUserId('');
  };
/*
  const obtenerEstadisticas = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/notifications/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          '📊 Estadísticas de Notificaciones',
          `Usuarios con notificaciones: ${data.totalUsersWithNotificationsEnabled}\n` +
          `Con token válido: ${data.usersWithValidTokens}\n` +
          `Sin token: ${data.usersWithoutTokens}`
        );
      } else {
        Alert.alert('Error', 'No se pudieron obtener las estadísticas');
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };
*/
  return (
    <View style={{ flex: 1 }}>
      <AppbarNav titulo="Enviar Notificaciones" tamanioTitulo="headlineSmall" />
      
      <ScrollView style={styles.container}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            {/* <TextPaper variant="titleLarge" style={{ marginBottom: 16 }}>
              Panel de Administración
            </TextPaper> */}

            <SegmentedButtons
              value={tipoNotificacion}
              onValueChange={setTipoNotificacion}
              buttons={[
                {
                  value: 'broadcast',
                  label: 'Todos',
                  icon: 'bullhorn',
                },
                {
                  value: 'topic',
                  label: 'Topic',
                  icon: 'tag',
                },
                {
                  value: 'usuario',
                  label: 'Usuario',
                  icon: 'account',
                },
              ]}
              style={{ marginBottom: 16 }}
            />

            <TextInput
              label="Título"
              value={titulo}
              onChangeText={setTitulo}
              mode="outlined"
              style={styles.input}
              maxLength={50}
              placeholder="Título de la notificación"
            />

            <TextInput
              label="Mensaje"
              value={mensaje}
              onChangeText={setMensaje}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              maxLength={200}
              placeholder="Contenido del mensaje"
            />

            {tipoNotificacion === 'topic' && (
              <TextInput
                label="Topic"
                value={topic}
                onChangeText={setTopic}
                mode="outlined"
                style={styles.input}
                placeholder="ej: adopciones"
                left={<TextInput.Icon icon="tag" />}
              />
            )}

            {tipoNotificacion === 'usuario' && (
              <TextInput
                label="ID de Usuario"
                value={userId}
                onChangeText={setUserId}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                placeholder="Ingrese el ID del usuario"
                left={<TextInput.Icon icon="account" />}
              />
            )}

            <Button
              mode="contained"
              onPress={enviarNotificacion}
              loading={enviando}
              disabled={enviando || !titulo || !mensaje}
              style={styles.button}
              icon="send"
            >
              {enviando ? 'Enviando...' : 'Enviar Notificación'}
            </Button>

            {/* <Button
              mode="outlined"
              onPress={limpiarFormulario}
              style={styles.button}
              icon="broom"
            >
              Limpiar
            </Button> */}
          </Card.Content>
        </Card>
{/* 
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <TextPaper variant="titleMedium" style={{ marginBottom: 12 }}>
              Información
            </TextPaper>

            <View style={styles.infoBox}>
              <TextPaper variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                📢 <TextPaper style={{ fontWeight: 'bold' }}>Broadcast:</TextPaper> Envía a todos los usuarios con notificaciones habilitadas
              </TextPaper>
            </View>

            <View style={styles.infoBox}>
              <TextPaper variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                🏷️ <TextPaper style={{ fontWeight: 'bold' }}>Topic:</TextPaper> Envía a usuarios suscritos a un tema (ej: adopciones)
              </TextPaper>
            </View>

            <View style={styles.infoBox}>
              <TextPaper variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                👤 <TextPaper style={{ fontWeight: 'bold' }}>Usuario:</TextPaper> Envía a un usuario específico por ID
              </TextPaper>
            </View>

            <Button
              mode="text"
              onPress={obtenerEstadisticas}
              style={{ marginTop: 12 }}
              icon="chart-bar"
            >
              Ver Estadísticas
            </Button>
          </Card.Content>
        </Card>
 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  infoBox: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
});
