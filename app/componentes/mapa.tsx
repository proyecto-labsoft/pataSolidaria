import React, { FC, useState, useEffect, useRef } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { getCurrentPositionAsync, PermissionStatus, requestForegroundPermissionsAsync, reverseGeocodeAsync, useForegroundPermissions } from 'expo-location';
import { ActivityIndicator } from 'react-native-paper';


type MapProps = {
  localizar?: boolean;
  latitude: number | null;
  longitude: number | null;
  style?: object;
  modificarDomicilio?: (domicilio: string) => void;
};

export const Mapa: FC<MapProps> = ({ localizar= false, latitude, longitude, style, modificarDomicilio }) => {

  const mapRef = useRef<MapView>();
  const [status, requestPermissionLocation] = useForegroundPermissions();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({
    latitude: latitude,
    longitude: longitude,
  });
  const INITIAL_CAMERA = {
    center: {
      latitude: location.latitude ?? -54.8019,
      longitude: location.longitude ?? -68.3029
    },
    zoom: 14,
    heading: 0,
    pitch: 0
  };

  useEffect(() => {
    const obtenerUbicacion = async () => {
      const location = await getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });

      mapRef.current?.animateCamera({
        center: { latitude, longitude },
        pitch: 0,
        heading: 0,
        zoom: 15,
        altitude: 0,
      });

      await getAddress({ latitude, longitude });
    };

    const fetchLocation = async () => {
      setLoading(true);
      try {
        if (status?.status === PermissionStatus.GRANTED) {
          await obtenerUbicacion();
        } else {
          const { status: newStatus, canAskAgain } = await requestForegroundPermissionsAsync();

          if (newStatus === PermissionStatus.GRANTED) {
            await obtenerUbicacion();
          } else if (!canAskAgain) {
            Linking.openSettings(); // El usuario tiene que concederlo manualmente
          }
        }
      } catch (error) {
        console.log('Error fetching location', error);
      } finally {
        setLoading(false);
      }
    };

    if (localizar) {
      fetchLocation();
    }
  }, [localizar]);
  
  const handleMarkerPoint = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    getAddress({ latitude, longitude });
  };

  const getAddress = async (ubi: { latitude: number, longitude: number }) => {
    try {
      let [address] = await reverseGeocodeAsync(ubi);
      if (address) {
        modificarDomicilio?.((address.street === null ? 'sin calle' : address.street) + ' ' + (address.streetNumber === null ? 'sin altura' : address.streetNumber));
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={ mapRef }
        style={{ ...styles.map, ...style }}
        zoomControlEnabled
        // initialRegion={INITIAL_REGION}
        initialCamera={ INITIAL_CAMERA }
        //mapType='none'
        onPress={ handleMarkerPoint }
      >
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {location.latitude && location.longitude && 
          <Marker
            coordinate={{ 
              latitude: location.latitude, 
              longitude: location.longitude 
            }}
            draggable
            onDragEnd={ handleMarkerPoint }
          />
        }
      </MapView>
      {loading && <ActivityIndicator style={ styles.loading } size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
});
