import React, { useState, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { IconButton, ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useObtenerImagenes, useEliminarImagen } from '../../api/imagenes.hooks';

const { width } = Dimensions.get('screen');

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

interface ImageState {
  loading: boolean;
  error: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  entityType,
  entityId,
  editable = false,
  onImageCountChange,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const { data: imagenes, isLoading, error, isFetching } = useObtenerImagenes(entityType, entityId);
  const eliminarImagen = useEliminarImagen(entityType);
  
  // Estado de carga/error para cada imagen
  const [imageStates, setImageStates] = useState<Record<number, ImageState>>({});

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
        
        {editable && !imageState.loading && (
          <IconButton
            icon="delete"
            size={24}
            mode="contained"
            containerColor="rgba(0,0,0,0.7)"
            iconColor="white"
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.nombreArchivo)}
          />
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
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No hay imágenes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={imagenes}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        pagingEnabled
        renderItem={renderSliderItem}
        style={styles.carouselList}
      />
      {renderIndicators()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: width - 20,
    alignItems: 'center',
    borderRadius: 20,
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
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 20,
    margin: 0,
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
});
