import React, { FC, useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native-paper';


type MapProps = {
  localizar: boolean;
  latitude: number | null;
  longitude: number | null;
  style?: object;
  modificarDomicilio: (domicilio: string) => void;
};

export const Mapa: FC<MapProps> = ({ localizar, latitude, longitude, style, modificarDomicilio }) => {

  const mapRef = useRef<MapView>();
  const [loading, setLoading] = useState(true);
  const locationUshuaia = {
    latitude: -54.8019,
    longitude:  -68.3029,
  };
  const [location, setLocation] = useState({
    latitude: latitude,
    longitude: longitude,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permiso de ubicación denegado');
            return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLocation({ latitude, longitude });
  
        mapRef.current?.animateCamera({
            center: { latitude, longitude },
        });
        
        getAddress({ latitude, longitude });
      } catch (error) {
        console.log('Error fetching location', error);
      } finally {
        setLoading(false);
      }
    };

    if(localizar){
      fetchLocation();
    }
  }, [localizar]);
  
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
    <View style={{ flex: 1 }}>
      <MapView
        ref={ mapRef }
        style={{ ...styles.map, ...style }}
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
        onPress={ handleMarkerPoint }
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.de/{z}/{x}/{y}.png"
          maximumZ={19}
        />
        {location.latitude && location.longitude && 
          <Marker
            coordinate={ location }
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
