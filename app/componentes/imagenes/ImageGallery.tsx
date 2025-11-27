import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { IconButton, ActivityIndicator, Text } from 'react-native-paper';
import { useObtenerImagenes, useEliminarImagen } from '../../api/imagenes.hooks';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 3; // 3 columnas con padding

interface ImageGalleryProps {
  entityType: 'mascotas' | 'extravios' | 'avistamientos' | 'adopciones';
  entityId: number;
  editable?: boolean;
  onImageCountChange?: (count: number) => void;
}

interface ImageData {
  id: number;
  urlPublica: string;
  nombreArchivo: string;
  orden: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  entityType,
  entityId,
  editable = false,
  onImageCountChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: imagenes, isLoading, error } = useObtenerImagenes(entityType, entityId);
  const eliminarImagen = useEliminarImagen(entityType);

  React.useEffect(() => {
    if (imagenes && onImageCountChange) {
      onImageCountChange(imagenes.length);
    }
  }, [imagenes, onImageCountChange]);

  const handleDelete = (imagenId: number, nombreArchivo: string) => {
    Alert.alert(
      'Eliminar imagen',
      `¿Estás seguro de que quieres eliminar "${nombreArchivo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarImagen.mutateAsync(imagenId);
              Alert.alert('Éxito', 'Imagen eliminada correctamente');
            } catch (error: any) {
              console.error('Error al eliminar imagen:', error);
              Alert.alert('Error', 'No se pudo eliminar la imagen');
            }
          },
        },
      ]
    );
  };

  const renderImageItem = ({ item }: { item: ImageData }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => setSelectedImage(item.urlPublica)}
    >
      <Image
        source={{ uri: item.urlPublica }}
        style={styles.image}
        resizeMode="cover"
      />
      {editable && (
        <IconButton
          icon="delete"
          size={20}
          mode="contained"
          containerColor="rgba(0,0,0,0.6)"
          iconColor="white"
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.nombreArchivo)}
        />
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando imágenes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error al cargar las imágenes</Text>
      </View>
    );
  }

  if (!imagenes || imagenes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No hay imágenes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={imagenes}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal para ver imagen en tamaño completo */}
      <Modal
        visible={!!selectedImage}
        transparent
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}
        >
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
            <IconButton
              icon="close"
              size={30}
              mode="contained"
              containerColor="rgba(0,0,0,0.6)"
              iconColor="white"
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 8,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    margin: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
