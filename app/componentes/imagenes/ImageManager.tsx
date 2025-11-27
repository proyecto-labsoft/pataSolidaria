import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { ImagePickerComponent } from './ImagePicker';
import { ImageGallery } from './ImageGallery';

interface ImageManagerProps {
  entityType: 'mascotas' | 'extravios' | 'avistamientos' | 'adopciones';
  entityId: number;
  maxImages?: number;
  editable?: boolean;
  showUploader?: boolean;
}

/**
 * Componente completo para gestionar imágenes:
 * - Muestra galería de imágenes existentes
 * - Permite subir nuevas imágenes
 * - Permite eliminar imágenes
 */
export const ImageManager: React.FC<ImageManagerProps> = ({
  entityType,
  entityId,
  maxImages = 5,
  editable = true,
  showUploader = true,
}) => {
  const [currentImagesCount, setCurrentImagesCount] = useState(0);

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Galería de imágenes */}
        <ImageGallery
          entityType={entityType}
          entityId={entityId}
          editable={editable}
          onImageCountChange={setCurrentImagesCount}
        />

        {/* Separador */}
        {showUploader && editable && <Divider style={styles.divider} />}

        {/* Selector de imágenes */}
        {showUploader && editable && (
          <ImagePickerComponent
            entityType={entityType}
            entityId={entityId}
            maxImages={maxImages}
            currentImagesCount={currentImagesCount}
            onImageUploaded={() => {
              // La galería se actualizará automáticamente por React Query
            }}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  divider: {
    marginVertical: 16,
  },
});
