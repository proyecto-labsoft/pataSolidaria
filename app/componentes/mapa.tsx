import React, { FC, useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';


type MapProps = {
  localizar: boolean;
  latitude: number | null;
  longitude: number | null;
  style?: object;
  modificarDomicilio: (domicilio: string) => void;
};

export const Mapa: FC<MapProps> = ({ localizar, latitude, longitude, style, modificarDomicilio }) => {

  const mapRef = useRef<MapView>();
  const locationUshuaia = {
    latitude: -54.8019,
    longitude:  -68.3029,
  };
  const [location, setLocation] = useState({
    latitude: latitude,
    longitude: longitude,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          console.log('Permiso de ubicación denegado');
          return;
      }
//TODO buscar si poder tener un loading mientras esta cargando la ubicacion
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });

      mapRef.current?.animateCamera({
          center: { latitude, longitude },
      });
      
      getAddress({ latitude, longitude });
    };

    if(localizar){
      requestLocationPermission();
    }
  }, []);
  
  const handleMarkerPoint = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    getAddress({ latitude, longitude });
  };

  const getAddress = async (ubi) => {
    try {
      let [address] = await Location.reverseGeocodeAsync(ubi);
      if (address) {
        modificarDomicilio((address.street === null ? 'sin calle' : address.street) + ' ' + (address.streetNumber === null ? 'sin altura' : address.streetNumber));
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
    }
  };

  return (
    <MapView
      ref={mapRef}
      style={{...styles.map, ...style}}
      // initialRegion={{
      //   latitude: location.latitude,
      //   longitude: location.longitude,
      //   latitudeDelta: 0.0922,
      //   longitudeDelta: 0.0421,
      // }}
      zoomControlEnabled
      initialCamera={{
        center: {
          latitude: location.latitude ?? locationUshuaia.latitude,
          longitude: location.longitude ?? locationUshuaia.longitude
        },
        zoom: 14,
        heading: 0,
        pitch: 0
      }}
      mapType='none'
      onPress={handleMarkerPoint}
    >
      <UrlTile
          urlTemplate="https://a.tile.openstreetmap.de/{z}/{x}/{y}.png"
          maximumZ={19}
      />
      {location.latitude && location.longitude && (        
        <Marker
            coordinate={location}
            draggable
            onDragEnd={handleMarkerPoint}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200,
  },
});
