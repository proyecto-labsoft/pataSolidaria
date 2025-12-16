import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Divider } from 'react-native-paper';
import AppbarNav from '../navegacion/appbarNav';
import { ImageGallery } from '../imagenes';

interface VistaImagenesProps {
  entityType: 'mascotas' | 'extravios' | 'avistamientos' | 'adopciones';
  entityId: number;
  titulo: string;
  subtitulo?: string;
}

/**
 * Pantalla completa para gestionar imágenes de una entidad
 * Úsala después de crear una mascota, extravío, avistamiento o adopción
 */
export default function VistaImagenesEntidad({
  entityType,
  entityId,
  titulo,
  subtitulo,
}: VistaImagenesProps) {
  return (
    <>
      <AppbarNav titulo={titulo} tamanioTitulo="headlineSmall" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Información de contexto */}
          {subtitulo && (
            <Card style={styles.infoCard}>
              <Card.Content>
                <Text variant="bodyMedium">{subtitulo}</Text>
              </Card.Content>
            </Card>
          )}

          {/* Galería de imágenes con FAB integrado */}
          <Card style={styles.galleryCard}>
            <Card.Content>
              <ImageGallery
                entityType={entityType}
                entityId={entityId}
                maxImages={5}
                editable={true}
              />
            </Card.Content>
          </Card>

          {/* Instrucciones */}
          <Card style={styles.helpCard}>
            <Card.Content>
              <Text variant="titleSmall" style={styles.helpTitle}>
                💡 Consejos
              </Text>
              <Text variant="bodySmall" style={styles.helpText}>
                • Puedes subir hasta 5 imágenes
              </Text>
              <Text variant="bodySmall" style={styles.helpText}>
                • Usa el botón flotante para agregar o eliminar imágenes
              </Text>
              <Text variant="bodySmall" style={styles.helpText}>
                • Toca el botón 🗑️ en cada imagen para eliminarla individualmente
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  infoCard: {
    margin: 16,
    marginBottom: 0,
  },
  galleryCard: {
    margin: 16,
  },
  helpCard: {
    margin: 16,
    backgroundColor: '#f5f5f5',
  },
  helpTitle: {
    marginBottom: 8,
  },
  helpText: {
    marginBottom: 4,
  },
});
