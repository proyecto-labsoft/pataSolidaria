import React, { FC, useState, useEffect } from 'react';
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

  const mapRef = React.createRef<MapView>();
  const locationUshuaia = {
    latitude: -54.8019,
    longitude:  -68.3029,
  };
  const [location, setLocation] = useState({
    latitude: latitude /*|| -54.8019*/,
    longitude: longitude /*|| -68.3029*/,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
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
        
// TODO devuelve undefined aqui, no se por que, ya tengo la ubicacion en latitude longitude        
console.log('location antes getAddress: ', { latitude, longitude });
        getAddress({ latitude, longitude });
        // setDatosFamiliar((prevState) => ({
        //     ...prevState,
        //     ubicacion: { latitude, longitude },
        // }));
    };

    if(localizar){
      requestLocationPermission();
    }
}, [localizar]);
  
  // const handleMarkerDragEnd = (e) => {
  const handleMarkerPoint = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    const lat = parseFloat(latitude.toFixed(7));
    const lon = parseFloat(longitude.toFixed(7));
    console.log('location antes de getAdres en handleMarkerPoint: ', { lat, lon });
    getAddress({ latitude: lat, longitude: lon });
  };

  // const handleMapPress = (e) => {
  //   const { latitude, longitude } = e.nativeEvent.coordinate;
  //   setLocation({ latitude, longitude });
    
  // };

  const getAddress = async (ubi) => {
    try {
console.log('location dentro getAddress: ', ubi);
      const address = await mapRef.current?.addressForCoordinate(ubi);
      if (address) {
        
        modificarDomicilio((address.thoroughfare === null ? 'sin calle' : address.thoroughfare) + ' ' + (address.subThoroughfare === null ? 'sin altura' : address.subThoroughfare));
      }
      console.log('address: ', address);
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
    }
  }
console.log('location antes return: ', location);
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
        //provider={undefined}
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
              // title={'Chili'}
              // description={'Algun domi 1234'}
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
