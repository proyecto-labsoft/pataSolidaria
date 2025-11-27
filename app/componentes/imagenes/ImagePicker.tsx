import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useSubirImagen } from '../../api/imagenes.hooks';

interface ImagePickerComponentProps {
  entityType: 'mascotas' | 'extravios' | 'avistamientos' | 'adopciones';
  entityId: number;
  onImageUploaded?: () => void;
  maxImages?: number;
  currentImagesCount?: number;
}

export const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  entityType,
  entityId,
  onImageUploaded,
  maxImages = 5,
  currentImagesCount = 0,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const subirImagen = useSubirImagen(entityType);

  // Solicitar permisos para acceder a la galería
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos permisos para acceder a tu galería de fotos'
        );
        return false;
      }
    }
    return true;
  };

  // Seleccionar imagen de la galería
  const pickImage = async () => {
    // Verificar límite de imágenes
    if (currentImagesCount >= maxImages) {
      Alert.alert(
        'Límite alcanzado',
        `Solo puedes subir un máximo de ${maxImages} imágenes`
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Tomar foto con la cámara
  const takePhoto = async () => {
    // Verificar límite de imágenes
    if (currentImagesCount >= maxImages) {
      Alert.alert(
        'Límite alcanzado',
        `Solo puedes subir un máximo de ${maxImages} imágenes`
      );
      return;
    }

    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos permisos para usar la cámara'
        );
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  // Subir imagen al backend
  const uploadImage = async (asset: ImagePicker.ImagePickerAsset) => {
    setIsUploading(true);

    try {
      // Preparar el archivo para FormData
      const file = {
        uri: asset.uri,
        type: 'image/jpeg',
        name: `image-${Date.now()}.jpg`,
      };

      await subirImagen.mutateAsync({
        entityId,
        file,
        orden: currentImagesCount,
      });

      Alert.alert('Éxito', 'Imagen subida correctamente');
      onImageUploaded?.();
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo subir la imagen';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Agregar Imágenes ({currentImagesCount}/{maxImages})
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={pickImage}
          disabled={isUploading || currentImagesCount >= maxImages}
          style={styles.button}
          icon="image"
        >
          Galería
        </Button>

        <Button
          mode="contained"
          onPress={takePhoto}
          disabled={isUploading || currentImagesCount >= maxImages}
          style={styles.button}
          icon="camera"
        >
          Cámara
        </Button>
      </View>

      {isUploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Subiendo imagen...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
});
