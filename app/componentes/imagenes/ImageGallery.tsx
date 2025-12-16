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

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  entityType,
  entityId,
  editable = false,
  onImageCountChange,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
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

  // Renderizado de cada imagen en el carrusel
  const renderSliderItem = ({ item, index }: { item: ImageData; index: number }) => (
    <View style={styles.slideContainer}>
      <Image
        source={{ uri: item.urlPublica }}
        resizeMode="contain"
        style={styles.slideImage}
      />
      {editable && (
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
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    color: 'gray',
  },
});
