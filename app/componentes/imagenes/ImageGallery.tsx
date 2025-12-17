import React, { useState, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { IconButton, ActivityIndicator, Text, useTheme, FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useObtenerImagenes, useEliminarImagen, useSubirImagen } from '../../api/imagenes.hooks';

const { width } = Dimensions.get('screen');

interface ImageGalleryProps {
  entityType: 'mascotas' | 'extravios' | 'avistamientos' | 'adopciones';
  entityId: number;
  editable?: boolean;
  onImageCountChange?: (count: number) => void;
  maxImages?: number;
}

interface ImageData {
  id: number;
  urlPublica: string;
  nombreArchivo: string;
  orden: number;
}

interface ImageState {
  loading: boolean;
  error: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  entityType,
  entityId,
  editable = false,
  onImageCountChange,
  maxImages = 5,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const { data: imagenes, isLoading, error, isFetching } = useObtenerImagenes(entityType, entityId);
  const eliminarImagen = useEliminarImagen(entityType, entityId);
  const subirImagen = useSubirImagen(entityType);
  
  // Estado de carga/error para cada imagen
  const [imageStates, setImageStates] = useState<Record<number, ImageState>>({});
  const [fabOpen, setFabOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Debug logging
  React.useEffect(() => {
    console.log('ImageGallery - entityType:', entityType);
    console.log('ImageGallery - entityId:', entityId);
    console.log('ImageGallery - isLoading:', isLoading);
    console.log('ImageGallery - isFetching:', isFetching);
    console.log('ImageGallery - error:', error);
    console.log('ImageGallery - imagenes:', imagenes);
  }, [entityType, entityId, isLoading, isFetching, error, imagenes]);

  React.useEffect(() => {
    if (imagenes && onImageCountChange) {
      onImageCountChange(imagenes.length);
    }
    
    // Inicializar estado de carga para todas las imágenes
    if (imagenes) {
      const initialStates: Record<number, ImageState> = {};
      imagenes.forEach((img) => {
        initialStates[img.id] = { loading: true, error: false };
      });
      setImageStates(initialStates);
    }
  }, [imagenes, onImageCountChange]);

  const handleImageLoadStart = (imageId: number) => {
    setImageStates((prev) => ({
      ...prev,
      [imageId]: { loading: true, error: false },
    }));
  };

  const handleImageLoad = (imageId: number, nombreArchivo: string) => {
    console.log(`✅ Imagen ${imageId} cargada correctamente:`, nombreArchivo);
    setImageStates((prev) => ({
      ...prev,
      [imageId]: { loading: false, error: false },
    }));
  };

  const handleImageError = (imageId: number, nombreArchivo: string, urlPublica: string) => {
    console.error(`❌ Error al cargar imagen ${imageId} (${nombreArchivo})`);
    console.error('URL que falló:', urlPublica);
    setImageStates((prev) => ({
      ...prev,
      [imageId]: { loading: false, error: true },
    }));
  };

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
    const currentCount = imagenes?.length || 0;
    
    // Verificar límite de imágenes
    if (currentCount >= maxImages) {
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
    } finally {
      setFabOpen(false);
    }
  };

  // Tomar foto con la cámara
  const takePhoto = async () => {
    const currentCount = imagenes?.length || 0;
    
    // Verificar límite de imágenes
    if (currentCount >= maxImages) {
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
    } finally {
      setFabOpen(false);
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

      const currentCount = imagenes?.length || 0;

      await subirImagen.mutateAsync({
        entityId,
        file,
        orden: currentCount,
      });

      Alert.alert('Éxito', 'Imagen subida correctamente');
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

  const handleDeleteCurrent = () => {
    if (!imagenes || imagenes.length === 0) {
      Alert.alert('Sin imágenes', 'No hay imágenes para eliminar');
      return;
    }

    const currentImage = imagenes[currentIndex];
    if (!currentImage) return;

    Alert.alert(
      'Eliminar imagen',
      `¿Estás seguro de que quieres eliminar "${currentImage.nombreArchivo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarImagen.mutateAsync(currentImage.id);
              Alert.alert('Éxito', 'Imagen eliminada correctamente');
              // Ajustar el índice si es necesario
              if (currentIndex >= imagenes.length - 1 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              }
            } catch (error: any) {
              console.error('Error al eliminar imagen:', error);
              Alert.alert('Error', 'No se pudo eliminar la imagen');
            }
          },
        },
      ]
    );
    setFabOpen(false);
  };

  // Renderizado de cada imagen en el carrusel
  const renderSliderItem = ({ item, index }: { item: ImageData; index: number }) => {
    const imageState = imageStates[item.id] || { loading: true, error: false };
    
    return (
      <View style={styles.slideContainer}>
        <Image
          source={{ uri: item.urlPublica }}
          resizeMode="contain"
          style={styles.slideImage}
          onLoadStart={() => handleImageLoadStart(item.id)}
          onLoad={() => handleImageLoad(item.id, item.nombreArchivo)}
          onError={() => handleImageError(item.id, item.nombreArchivo, item.urlPublica)}
        />
        
        {/* Indicador de carga sobre la imagen */}
        {imageState.loading && (
          <View style={styles.imageLoadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.imageLoadingText}>Cargando imagen...</Text>
          </View>
        )}
        
        {/* Mensaje de error sobre la imagen */}
        {imageState.error && (
          <View style={styles.imageErrorOverlay}>
            <IconButton
              icon="image-broken-variant"
              size={48}
              iconColor={theme.colors.error}
            />
            <Text style={styles.imageErrorText}>Error al cargar imagen</Text>
            <Text style={styles.imageErrorSubtext}>{item.nombreArchivo}</Text>
          </View>
        )}
      </View>
    );
  };

  // Indicadores del carrusel
  const renderIndicators = () => {
    if (!imagenes || imagenes.length <= 1) return null;

    return (
      <View style={styles.indicatorContainer}>
        {imagenes.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View 
              key={`indicator-${i}`} 
              style={[
                styles.indicator,
                {
                  backgroundColor: theme.colors.primary,
                  transform: [{ scale }],
                }
              ]} 
            />
          );
        })}
      </View>
    );
  };

  // Mostrar loading si está cargando O si está haciendo fetch
  if (isLoading || isFetching) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando imágenes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error al cargar las imágenes</Text>
        <Text style={styles.errorDetails}>
          {error?.message || 'Error desconocido'}
        </Text>
      </View>
    );
  }

  if (!imagenes || imagenes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No hay imágenes</Text>
        </View>
        {editable && (
          <FAB.Group
            open={fabOpen}
            visible={!isUploading}
            icon={fabOpen ? 'close' : 'camera-plus'}
            color="white"
            backdropColor="transparent"
            actions={[
              {
                icon: 'camera',
                label: 'Cámara',
                onPress: takePhoto,
              },
              {
                icon: 'image',
                label: 'Galería',
                onPress: pickImage,
              },
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
            style={styles.fab}
            fabStyle={{...styles.fabButton, backgroundColor: fabOpen ? theme.colors.inversePrimary : theme.colors.primary }}
          />
        )}
        {isUploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.uploadingText}>Subiendo imagen...</Text>
          </View>
        )}
      </View>
    );
  }

  // Calcular el índice actual basado en el scroll
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        setCurrentIndex(index);
      },
    }
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={imagenes}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        pagingEnabled
        renderItem={renderSliderItem}
        style={styles.carouselList}
      />
      {renderIndicators()}

      {/* Overlay blanco cuando el FAB está abierto */}
      {editable && fabOpen && (
        <View style={styles.fabBackdrop} />
      )}

      {/* FAB con opciones */}
      {editable && (
        <FAB.Group
          open={fabOpen}
          visible={!isUploading}
          icon={fabOpen ? 'close' : 'camera-plus'}
          color="white"
          backdropColor="transparent"
          actions={[
            ...(imagenes && imagenes[currentIndex]?.id !== 0 ? [{
              icon: 'delete',
              label: 'Eliminar',
              onPress: handleDeleteCurrent,
              small: false,
            }] : []),
            {
              icon: 'camera',
              label: 'Cámara',
              onPress: takePhoto,
              disabled: (imagenes?.length || 0) >= maxImages,
            },
            {
              icon: 'image',
              label: 'Galería',
              onPress: pickImage,
              disabled: (imagenes?.length || 0) >= maxImages,
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          style={styles.fab}
          fabStyle={{...styles.fabButton, backgroundColor: fabOpen ? theme.colors.inversePrimary : theme.colors.primary }}
        />
      )}

      {/* Overlay de carga cuando se está subiendo */}
      {isUploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.uploadingText}>Subiendo imagen...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: width - 20,
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  carouselList: {
    width: width,
  },
  slideContainer: {
    width,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '90%',
    height: '90%',
    borderRadius: 12,
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imageLoadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  imageErrorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 20,
  },
  imageErrorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
  },
  imageErrorSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  indicatorContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 230,
  },
  indicator: {
    height: 10,
    margin: 10,
    width: 10,
    borderRadius: 5,
  },
  centerContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorDetails: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
  },
  emptyText: {
    color: 'gray',
    fontSize: 14,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 1000,
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 0,
    top: 170,
    zIndex: 2,
  },
  fabButton: {
    borderRadius: 50,
  },
  fabBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    zIndex: 1,
  },
});
